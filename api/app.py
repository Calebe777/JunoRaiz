"""JUNO, painel do blog: API em Flask + PostgreSQL.

GET    /api/login ............ está logado?
POST   /api/login ............ { password }: entra
DELETE /api/login ............ sai
GET    /api/posts ............ posts publicados (usado pelo blog)
GET    /api/posts?all=1 ...... todos, com rascunhos (painel)
POST   /api/posts ............ cria ou atualiza: { post, originalSlug, status: 'draft' | 'published' }
PATCH  /api/posts ............ publica ou despublica: { slug, status }
DELETE /api/posts ............ apaga: { slug } (e as imagens que só esse post usava)
POST   /api/upload ........... multipart (campo "image"): salva em assets/img/blog/ e devolve o caminho

Configuração por variáveis de ambiente, num arquivo fora da pasta pública do site:
DATABASE_URL, SECRET_KEY, ADMIN_PASSWORD_HASH, SITE_ROOT e COOKIE_SECURE.
"""
import logging
import os
import re
import secrets
import time
import unicodedata
from datetime import date, timedelta
from urllib.parse import urlparse

import psycopg
from flask import Flask, jsonify, request, session
from psycopg.rows import dict_row
from werkzeug.exceptions import HTTPException
from werkzeug.security import check_password_hash

IMG_DIR = "assets/img/blog/"
IMG_RE = re.compile(r"^assets/img/blog/[a-z0-9][a-z0-9-]{0,80}\.(webp|jpg|jpeg|png|gif)$")
IMG_IN_TEXT_RE = re.compile(r"assets/img/blog/[a-z0-9][a-z0-9-]{0,80}\.(?:webp|jpg|jpeg|png|gif)")
SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
MAX_IMAGE = 8 * 1024 * 1024

SCHEMA = """
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(10) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    post_date DATE NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT '',
    cover VARCHAR(200) NOT NULL DEFAULT '',
    title_pt VARCHAR(200) NOT NULL,
    excerpt_pt VARCHAR(600) NOT NULL DEFAULT '',
    body_pt TEXT NOT NULL,
    title_en VARCHAR(200),
    excerpt_en VARCHAR(600),
    body_en TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blog_posts_status_date ON blog_posts (status, post_date);
"""

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.environ.get("SECRET_KEY") or secrets.token_hex(32),
    SESSION_COOKIE_NAME="juno_session",
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Strict",
    SESSION_COOKIE_SECURE=os.environ.get("COOKIE_SECURE", "1") != "0",
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
    MAX_CONTENT_LENGTH=MAX_IMAGE + 1024 * 1024,
)
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("juno-blog")


class ApiError(Exception):
    def __init__(self, msg, status=400):
        super().__init__(msg)
        self.msg, self.status = msg, status


def fail(msg, status=400):
    raise ApiError(msg, status)


def out(data, status=200):
    resp = jsonify(data)
    resp.status_code = status
    resp.headers["Cache-Control"] = "no-store"
    return resp


@app.errorhandler(ApiError)
def on_api_error(e):
    return out({"error": e.msg}, e.status)


@app.errorhandler(HTTPException)
def on_http_error(e):
    msgs = {405: "Método não permitido.", 404: "Não encontrado.", 413: "Imagem grande demais (máx. 8 MB)."}
    return out({"error": msgs.get(e.code, "Requisição inválida.")}, e.code)


@app.errorhandler(Exception)
def on_crash(e):
    log.exception("erro inesperado")
    return out({"error": "Algo deu errado no servidor."}, 500)


# ---------- banco ----------

_schema_ready = False


def db():
    global _schema_ready
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        fail("Painel ainda não configurado: falta o DATABASE_URL no servidor.", 503)
    try:
        conn = psycopg.connect(url, row_factory=dict_row, connect_timeout=5)
    except psycopg.Error as e:
        log.error("banco: %s", e)
        fail("Não consegui conectar no banco de dados.", 500)
    if not _schema_ready:
        with conn.transaction():
            conn.execute("SELECT pg_advisory_xact_lock(7311)")  # dois workers subindo juntos não criam a tabela ao mesmo tempo
            conn.execute(SCHEMA)
        _schema_ready = True
    return conn


def find_post(conn, slug):
    return conn.execute("SELECT * FROM blog_posts WHERE slug = %s", (slug,)).fetchone()


# ---------- sessão ----------

def admin_hash():
    h = os.environ.get("ADMIN_PASSWORD_HASH", "")
    if not h:
        fail("Painel ainda não configurado: falta a senha (ADMIN_PASSWORD_HASH) no servidor.", 503)
    return h


def logged_in():
    return bool(session.get("admin"))


def require_admin():
    if not logged_in():
        fail("Faça login de novo.", 401)


def json_body():
    """Toda escrita exige corpo JSON: junto com o cookie SameSite, barra envio por outros sites."""
    if "application/json" not in (request.content_type or "").lower():
        fail("Requisição inválida.", 415)
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}


# ---------- posts ----------

def row_to_post(r, with_status):
    p = {
        "slug": r["slug"],
        "date": r["post_date"].isoformat(),
        "category": r["category"],
        "cover": r["cover"],
        "pt": {"title": r["title_pt"], "excerpt": r["excerpt_pt"], "body": r["body_pt"]},
    }
    if r["title_en"]:
        p["en"] = {"title": r["title_en"], "excerpt": r["excerpt_en"] or "", "body": r["body_en"] or ""}
    if with_status:
        p["status"] = r["status"]
        p["updatedAt"] = r["updated_at"].strftime("%Y-%m-%d %H:%M:%S")
    return p


def text(v, max_len):
    return str(v if v is not None else "").strip().replace("\r", "")[:max_len]


def clean_lang(c, required):
    if not isinstance(c, dict):
        c = {}
    lang = {"title": text(c.get("title"), 200), "excerpt": text(c.get("excerpt"), 600), "body": text(c.get("body"), 200000)}
    if not required and not (lang["title"] or lang["body"] or lang["excerpt"]):
        return None
    if not lang["title"]:
        fail("Falta o título do post." if required else "A versão em inglês precisa de título (ou deixe ela toda em branco).")
    if not lang["body"]:
        fail("O texto do post está vazio." if required else "A versão em inglês precisa de texto (ou deixe ela toda em branco).")
    return lang


def clean_post(p):
    post = {
        "slug": text(p.get("slug"), 100),
        "date": text(p.get("date"), 10),
        "category": text(p.get("category"), 40),
        "cover": text(p.get("cover"), 200),
        "pt": clean_lang(p.get("pt"), True),
        "en": clean_lang(p.get("en"), False),
    }
    if not SLUG_RE.match(post["slug"]):
        fail("O endereço do post só pode ter letras minúsculas, números e hífen.")
    try:
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", post["date"]):
            raise ValueError
        date.fromisoformat(post["date"])
    except ValueError:
        fail("Data inválida.")
    if post["cover"] and not IMG_RE.match(post["cover"]):
        fail("Capa inválida.")
    return post


def post_images(r):
    """Imagens do blog usadas por um post (capa + imagens no texto)."""
    joined = "\n".join([r["cover"] or "", r["body_pt"] or "", r["body_en"] or ""])
    return set(IMG_IN_TEXT_RE.findall(joined))


def status_of(v):
    if v not in ("draft", "published"):
        fail("Status inválido.")
    return v


def site_root():
    return os.environ.get("SITE_ROOT", os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# ---------- rotas ----------

@app.route("/api/login", methods=["GET", "POST", "DELETE"])
def login():
    pw_hash = admin_hash()
    if request.method == "GET":
        return out({"loggedIn": logged_in()})
    if request.method == "POST":
        body = json_body()
        if not check_password_hash(pw_hash, str(body.get("password") or "")):
            time.sleep(1)
            fail("Senha incorreta.", 401)
        session.clear()
        session.permanent = True
        session["admin"] = True
        return out({"loggedIn": True})
    session.clear()
    return out({"loggedIn": False})


@app.route("/api/posts", methods=["GET", "POST", "PATCH", "DELETE"])
def posts():
    if request.method == "GET":
        all_posts = bool(request.args.get("all"))
        if all_posts:
            require_admin()
        sql = "SELECT * FROM blog_posts" + ("" if all_posts else " WHERE status = 'published'") + " ORDER BY post_date DESC, id DESC"
        with db() as conn:
            rows = conn.execute(sql).fetchall()
        return out({"posts": [row_to_post(r, all_posts) for r in rows]})

    require_admin()
    body = json_body()

    with db() as conn:
        if request.method == "POST":
            post = clean_post(body["post"] if isinstance(body.get("post"), dict) else {})
            status = status_of(body.get("status", "published"))
            original = str(body["originalSlug"]) if body.get("originalSlug") else None
            en = post["en"] or {}
            values = (post["slug"], status, post["date"], post["category"], post["cover"],
                      post["pt"]["title"], post["pt"]["excerpt"], post["pt"]["body"],
                      en.get("title"), en.get("excerpt"), en.get("body"))
            with conn.transaction():
                taken = find_post(conn, post["slug"])
                if taken and post["slug"] != original:
                    fail("Já existe um post com esse endereço. Troque o endereço.")
                existing = find_post(conn, original) if original else None
                if existing:
                    conn.execute(
                        "UPDATE blog_posts SET slug = %s, status = %s, post_date = %s, category = %s, cover = %s,"
                        " title_pt = %s, excerpt_pt = %s, body_pt = %s, title_en = %s, excerpt_en = %s, body_en = %s,"
                        " updated_at = now() WHERE id = %s",
                        values + (existing["id"],))
                else:
                    conn.execute(
                        "INSERT INTO blog_posts (slug, status, post_date, category, cover,"
                        " title_pt, excerpt_pt, body_pt, title_en, excerpt_en, body_en)"
                        " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                        values)
            return out({"ok": True, "slug": post["slug"], "status": status, "isNew": not existing})

        if request.method == "PATCH":
            status = status_of(body.get("status", ""))
            row = conn.execute("UPDATE blog_posts SET status = %s, updated_at = now() WHERE slug = %s RETURNING id",
                               (status, str(body.get("slug") or ""))).fetchone()
            if not row:
                fail("Esse post não existe mais.", 404)
            return out({"ok": True, "status": status})

        # DELETE
        gone = find_post(conn, str(body.get("slug") or ""))
        if not gone:
            fail("Esse post não existe mais.", 404)
        conn.execute("DELETE FROM blog_posts WHERE id = %s", (gone["id"],))
        still_used = set()
        for r in conn.execute("SELECT cover, body_pt, body_en FROM blog_posts").fetchall():
            still_used |= post_images(r)
    for img in post_images(gone) - still_used:
        path = os.path.join(site_root(), img)
        try:
            if os.path.isfile(path):
                os.remove(path)
        except OSError as e:
            log.warning("não apaguei %s: %s", img, e)
    return out({"ok": True})


IMAGE_TYPES = (
    (lambda b: b[:3] == b"\xff\xd8\xff", "jpg"),
    (lambda b: b[:8] == b"\x89PNG\r\n\x1a\n", "png"),
    (lambda b: b[:6] in (b"GIF87a", b"GIF89a"), "gif"),
    (lambda b: b[:4] == b"RIFF" and b[8:12] == b"WEBP", "webp"),
)


def slugify_name(name):
    base = os.path.splitext(os.path.basename(name or ""))[0].lower()
    base = unicodedata.normalize("NFKD", base).encode("ascii", "ignore").decode()
    base = re.sub(r"[^a-z0-9]+", "-", base).strip("-")
    return base[:40].strip("-") or "imagem"


@app.route("/api/upload", methods=["POST"])
def upload():
    require_admin()
    # multipart não passa pelo filtro de JSON: confere a origem pra barrar envio por outros sites
    origin = request.headers.get("Origin", "")
    if origin and urlparse(origin).hostname != (request.host or "").split(":")[0]:
        fail("Requisição inválida.", 403)

    f = request.files.get("image")
    if not f:
        fail("Não recebi a imagem. Tente de novo.")
    data = f.read(MAX_IMAGE + 1)
    if len(data) > MAX_IMAGE:
        fail("Imagem grande demais (máx. 8 MB).")
    ext = next((e for check, e in IMAGE_TYPES if check(data)), None)
    if not ext:
        fail("Formato de imagem não suportado. Use JPG, PNG, WebP ou GIF.")

    path = f"{IMG_DIR}{slugify_name(request.form.get('name') or f.filename)}-{secrets.token_hex(3)}.{ext}"
    folder = os.path.join(site_root(), IMG_DIR)
    try:
        os.makedirs(folder, exist_ok=True)
        with open(os.path.join(site_root(), path), "xb") as fh:
            fh.write(data)
        os.chmod(os.path.join(site_root(), path), 0o644)
    except OSError as e:
        log.error("upload: %s", e)
        fail("Não consegui salvar a imagem no servidor (permissão da pasta assets/img/blog).", 500)
    return out({"path": path})

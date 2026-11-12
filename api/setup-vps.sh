#!/bin/bash
# Instala ou atualiza a API do blog (Python + PostgreSQL em Docker) na VPS.
# Uso:  bash api/setup-vps.sh                 instala / atualiza
#       bash api/setup-vps.sh --trocar-senha  troca a senha do painel
set -euo pipefail

SITE=/var/www/usejuno/home
CONF_DIR=/etc/juno-blog
ENV_FILE=$CONF_DIR/blog.env
PORT=8790
COMPOSE=(docker compose -f "$SITE/api/docker-compose.yml")
STAMP=$(date +%F-%H%M)

echo "== 1/5 conferindo o servidor =="
command -v docker >/dev/null || { echo "ERRO: docker não instalado"; exit 1; }
docker compose version >/dev/null || { echo "ERRO: falta o plugin docker compose"; exit 1; }
if ss -ltn | grep -c ":$PORT " >/dev/null && ! docker ps --format '{{.Names}}' | grep -c '^juno-blog-api' >/dev/null; then
  echo "ERRO: a porta $PORT já está em uso por outro programa"; exit 1
fi

echo "== 2/5 senhas em $ENV_FILE (fora da pasta do site) =="
mkdir -p "$CONF_DIR" && chmod 700 "$CONF_DIR"
if [ ! -f "$ENV_FILE" ]; then
  DB_PASS=$(openssl rand -hex 24)
  cat > "$ENV_FILE" <<ENV
POSTGRES_USER=juno
POSTGRES_PASSWORD=$DB_PASS
POSTGRES_DB=juno
DATABASE_URL=postgresql://juno:$DB_PASS@db:5432/juno
SECRET_KEY=$(openssl rand -hex 32)
ENV
  echo "arquivo criado com senha do banco e chave de sessão aleatórias"
else
  echo "arquivo já existe, mantido"
fi
chmod 600 "$ENV_FILE"

echo "== 3/5 subindo banco e API =="
mkdir -p "$SITE/assets/img/blog" && chown 33:33 "$SITE/assets/img/blog"
"${COMPOSE[@]}" build --quiet api

if ! grep -q '^ADMIN_PASSWORD_HASH=' "$ENV_FILE" || [ "${1:-}" = "--trocar-senha" ]; then
  while true; do
    read -rsp "Escolha a senha do painel /admin: " PW1; echo
    read -rsp "Repita a senha: " PW2; echo
    [ "$PW1" = "$PW2" ] && [ ${#PW1} -ge 8 ] && break
    echo "As senhas não batem ou têm menos de 8 caracteres. Tente de novo."
  done
  HASH=$(PW="$PW1" "${COMPOSE[@]}" run --rm --no-deps -T -e PW api \
    python -c "import os; from werkzeug.security import generate_password_hash as g; print(g(os.environ['PW']))")
  unset PW1 PW2
  sed -i '/^ADMIN_PASSWORD_HASH=/d' "$ENV_FILE"
  echo "ADMIN_PASSWORD_HASH='$HASH'" >> "$ENV_FILE"
  echo "senha do painel salva (só o hash fica guardado)"
fi
"${COMPOSE[@]}" up -d --force-recreate

echo "== 4/5 nginx: /api/ vai pra API, arquivos ocultos (.git) bloqueados =="
CONF=$(grep -rl "root $SITE;" /etc/nginx/ 2>/dev/null | head -1)
[ -n "$CONF" ] || { echo "ERRO: config do nginx do site não encontrada"; exit 1; }
if grep -q "proxy_pass http://127.0.0.1:$PORT" "$CONF"; then
  echo "nginx já estava configurado ($CONF)"
else
  cp "$CONF" "/root/usejuno-nginx-$STAMP.bak"
  python3 - "$CONF" "$PORT" <<'PY'
import sys
path, port = sys.argv[1], sys.argv[2]
s = open(path, encoding="utf-8").read()
if f"proxy_pass http://127.0.0.1:{port};" in s:
    sys.exit(0)
anchor ="    location / {\n        try_files $uri $uri.html"
if s.count(anchor) != 1:
    sys.exit("ERRO: não achei o 'location /' do site na config do nginx; nada foi alterado")
block = (
    "    location ~ /\\.(?!well-known) {\n"
    "        deny all;\n"
    "    }\n\n"
    "    location /api/ {\n"
    f"        proxy_pass http://127.0.0.1:{port};\n"
    "        proxy_set_header Host $host;\n"
    "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n"
    "        proxy_set_header X-Forwarded-Proto $scheme;\n"
    "        client_max_body_size 10m;\n"
    "    }\n\n"
)
open(path, "w", encoding="utf-8").write(s.replace(anchor, block + anchor))
PY
  if nginx -t 2>/dev/null; then systemctl reload nginx && echo "nginx atualizado e recarregado"
  else cp "/root/usejuno-nginx-$STAMP.bak" "$CONF"; nginx -t; echo "ERRO: nginx -t falhou, config antiga restaurada"; exit 1; fi
fi

echo "== 5/5 conferindo =="
for i in $(seq 1 20); do curl -fsS "http://127.0.0.1:$PORT/api/login" >/dev/null 2>&1 && break; sleep 2; done
B=https://usejuno.com.br
printf '%-22s %s\n' "/api/login"   "$(curl -s $B/api/login)"
printf '%-22s %s\n' "/api/posts"   "$(curl -s $B/api/posts | head -c 80)"
printf '%-22s %s\n' "/api/app.py"  "$(curl -s -o /dev/null -w 'HTTP %{http_code} (tem que ser 404)' $B/api/app.py)"
printf '%-22s %s\n' "/.git/config" "$(curl -s -o /dev/null -w 'HTTP %{http_code} (tem que ser 403)' $B/.git/config)"
printf '%-22s %s\n' "/admin/"      "$(curl -s -o /dev/null -w 'HTTP %{http_code}' $B/admin/)"
echo "PRONTO. Painel: $B/admin/"

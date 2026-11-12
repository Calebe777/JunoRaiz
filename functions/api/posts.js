import { json } from '../_lib/auth.js';
import { listPosts, commitPosts } from '../_lib/github.js';

const IMG_DIR = 'assets/img/blog/';
const IMG_RE = /^assets\/img\/blog\/[a-z0-9][a-z0-9-]{0,80}\.(webp|jpg|jpeg|png|gif)$/;
const MAX_IMG = 6 * 1024 * 1024;

function fail(msg) {
  const e = new Error(msg);
  e.userMessage = msg;
  throw e;
}

function text(v, max) {
  return String(v == null ? '' : v).replace(/\r/g, '').slice(0, max);
}

function cleanLang(c, required) {
  if (!c) return null;
  const out = { title: text(c.title, 200).trim(), excerpt: text(c.excerpt, 600).trim(), body: text(c.body, 200000).trim() };
  if (!out.title && !out.body && !required) return null;
  if (!out.title) fail('Falta o título do post.');
  if (!out.body) fail('O texto do post está vazio.');
  return out;
}

function cleanPost(p) {
  const post = {
    slug: text(p.slug, 100).trim(),
    date: text(p.date, 10),
    category: text(p.category, 40).trim(),
    cover: text(p.cover, 200).trim(),
    pt: cleanLang(p.pt, true)
  };
  const en = cleanLang(p.en, false);
  if (en) {
    if (!en.title || !en.body) fail('A versão em inglês precisa de título e texto (ou deixe ela toda em branco).');
    post.en = en;
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug)) fail('O endereço do post só pode ter letras minúsculas, números e hífen.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) fail('Data inválida.');
  if (post.cover && !IMG_RE.test(post.cover)) fail('Capa inválida.');
  return post;
}

function cleanFiles(files) {
  return (Array.isArray(files) ? files : []).map((f) => {
    const path = String(f.path || '');
    const base64 = String(f.base64 || '');
    if (!IMG_RE.test(path) || !path.startsWith(IMG_DIR)) fail('Nome de imagem inválido.');
    if (!/^[A-Za-z0-9+/]+=*$/.test(base64) || base64.length * 0.75 > MAX_IMG) fail('Imagem grande demais (máx. 6 MB).');
    return { path, base64 };
  });
}

export async function onRequestGet({ env }) {
  return json({ posts: await listPosts(env) });
}

/* cria ou atualiza; originalSlug indica qual post está sendo editado */
export async function onRequestPost({ request, env }) {
  const body = await request.json();
  const post = cleanPost(body.post || {});
  const files = cleanFiles(body.files);
  const originalSlug = body.originalSlug ? String(body.originalSlug) : null;
  let isNew = true;
  await commitPosts(env, (posts) => {
    if (posts.some((p) => p.slug === post.slug && p.slug !== originalSlug)) fail('Já existe um post com esse endereço. Troque o endereço.');
    const idx = originalSlug ? posts.findIndex((p) => p.slug === originalSlug) : -1;
    isNew = idx < 0;
    const next = posts.slice();
    if (isNew) next.push(post); else next[idx] = post;
    return { posts: next, files, message: `blog: ${isNew ? 'publica' : 'atualiza'} "${post.pt.title}"` };
  });
  return json({ ok: true, slug: post.slug, isNew });
}

export async function onRequestDelete({ request, env }) {
  const { slug } = await request.json();
  await commitPosts(env, (posts) => {
    const gone = posts.find((p) => p.slug === slug);
    if (!gone) fail('Esse post não existe mais.');
    return { posts: posts.filter((p) => p !== gone), files: [], message: `blog: remove "${gone.pt.title}"` };
  });
  return json({ ok: true });
}

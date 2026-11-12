import { configured, isLoggedIn, json } from '../_lib/auth.js';

/* Toda rota /api exige login, menos o próprio login. */
export async function onRequest(context) {
  const { request, env, next } = context;
  const path = new URL(request.url).pathname.replace(/\/$/, '');
  if (!configured(env)) return json({ error: 'Painel ainda não configurado: faltam ADMIN_PASSWORD e GITHUB_TOKEN no Cloudflare.' }, 503);
  if (path === '/api/login') return next();
  if (request.method !== 'GET' && !(request.headers.get('Content-Type') || '').includes('application/json')) {
    return json({ error: 'Requisição inválida.' }, 415);
  }
  if (!(await isLoggedIn(request, env))) return json({ error: 'Faça login de novo.' }, 401);
  try {
    return await next();
  } catch (e) {
    if (e.userMessage) return json({ error: e.userMessage }, 400);
    console.error(e);
    return json({ error: 'Não deu pra falar com o GitHub agora. Tente de novo em instantes.' }, 502);
  }
}

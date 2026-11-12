/* Sessão do painel /admin: cookie assinado com HMAC, válido por 7 dias.
   A chave deriva da senha + token do GitHub, então trocar a senha derruba as sessões abertas. */

const COOKIE = 'juno_admin';
const MAX_AGE = 60 * 60 * 24 * 7;
const enc = new TextEncoder();

async function key(env) {
  const raw = await crypto.subtle.digest('SHA-256', enc.encode('juno-admin|' + env.ADMIN_PASSWORD + '|' + env.GITHUB_TOKEN));
  return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export function configured(env) {
  return Boolean(env.ADMIN_PASSWORD && env.GITHUB_TOKEN);
}

/* compara sem vazar tempo, mesmo com tamanhos diferentes */
export async function passwordMatches(env, given) {
  const a = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(String(given || ''))));
  const b = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(env.ADMIN_PASSWORD)));
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function sessionCookie(env) {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  const sig = await crypto.subtle.sign('HMAC', await key(env), enc.encode(exp));
  return `${COOKIE}=${exp}.${b64url(sig)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearCookie() {
  return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

export async function isLoggedIn(request, env) {
  if (!configured(env)) return false;
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|;\\s*)' + COOKIE + '=(\\d+)\\.([\\w-]+)'));
  if (!m || Number(m[1]) < Date.now() / 1000) return false;
  try {
    return await crypto.subtle.verify('HMAC', await key(env), fromB64url(m[2]), enc.encode(m[1]));
  } catch (e) {
    return false;
  }
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }
  });
}

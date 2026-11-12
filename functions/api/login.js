import { passwordMatches, sessionCookie, clearCookie, isLoggedIn, json } from '../_lib/auth.js';

export async function onRequestGet({ request, env }) {
  return json({ loggedIn: await isLoggedIn(request, env) });
}

export async function onRequestPost({ request, env }) {
  let body = {};
  try { body = await request.json(); } catch (e) {}
  if (!(await passwordMatches(env, body.password))) {
    await new Promise((r) => setTimeout(r, 800));
    return json({ error: 'Senha incorreta.' }, 401);
  }
  return json({ loggedIn: true }, 200, { 'Set-Cookie': await sessionCookie(env) });
}

export async function onRequestDelete() {
  return json({ loggedIn: false }, 200, { 'Set-Cookie': clearCookie() });
}

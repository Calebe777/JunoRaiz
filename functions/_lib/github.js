/* Leitura e gravação dos posts direto no repositório do GitHub.
   Cada publicação vira um único commit (texto + imagens), e o Cloudflare Pages
   publica o site sozinho depois do push. */

export const POSTS_PATH = 'assets/js/posts.js';
const MARK = 'window.JUNO_POSTS =';

const HEADER = `/*
  POSTS DO BLOG DA JUNO
  =====================
  Este arquivo é gerado pelo painel do blog (usejuno.com.br/admin).
  Prefira publicar e editar posts por lá: se editar à mão, mantenha o formato JSON
  (aspas duplas, sem vírgula sobrando), senão o painel não consegue ler o arquivo.

  Campos de cada post: slug, date (ano-mês-dia), category, cover (caminho da capa ou ""),
  pt { title, excerpt, body } e, opcional, en { title, excerpt, body }.
  O texto (body) aceita: ## subtítulo, ### subtítulo menor, **negrito**, *itálico*,
  > citação, - lista, 1. lista numerada, [texto](link), ![descrição](imagem) e ---.
*/
`;

function cfg(env) {
  return {
    api: (env.GITHUB_API || 'https://api.github.com').replace(/\/$/, ''),
    repo: env.GITHUB_REPO || 'Calebe777/JunoRaiz',
    branch: env.GITHUB_BRANCH || 'main',
    token: env.GITHUB_TOKEN
  };
}

async function gh(env, method, path, body, accept) {
  const c = cfg(env);
  const res = await fetch(`${c.api}/repos/${c.repo}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${c.token}`,
      Accept: accept || 'application/vnd.github+json',
      'User-Agent': 'juno-blog-admin',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const err = new Error(`GitHub ${method} ${path}: ${res.status} ${await res.text()}`);
    err.status = res.status;
    throw err;
  }
  return accept === 'application/vnd.github.raw' ? res.text() : res.json();
}

export function parsePosts(src) {
  const at = src.indexOf(MARK);
  const end = src.lastIndexOf(']');
  if (at < 0 || end < at) throw new Error('posts.js fora do formato esperado');
  return JSON.parse(src.slice(src.indexOf('[', at), end + 1));
}

export function serializePosts(posts) {
  const sorted = posts.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return HEADER + MARK + ' ' + JSON.stringify(sorted, null, 2) + ';\n';
}

async function head(env) {
  const c = cfg(env);
  const ref = await gh(env, 'GET', `/git/ref/heads/${c.branch}`);
  const commit = await gh(env, 'GET', `/git/commits/${ref.object.sha}`);
  return { sha: ref.object.sha, tree: commit.tree.sha };
}

async function readAt(env, sha) {
  const src = await gh(env, 'GET', `/contents/${POSTS_PATH}?ref=${sha}`, null, 'application/vnd.github.raw');
  return parsePosts(src);
}

export async function listPosts(env) {
  const h = await head(env);
  return readAt(env, h.sha);
}

/* change(posts) devolve { posts, message, files: [{ path, base64 }] }.
   Se alguém publicou no meio do caminho, refaz a partir do commit mais novo. */
export async function commitPosts(env, change) {
  const c = cfg(env);
  for (let attempt = 0; attempt < 3; attempt++) {
    const h = await head(env);
    const result = change(await readAt(env, h.sha));
    const tree = [];
    for (const f of result.files || []) {
      const blob = await gh(env, 'POST', '/git/blobs', { content: f.base64, encoding: 'base64' });
      tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
    }
    const blob = await gh(env, 'POST', '/git/blobs', { content: serializePosts(result.posts), encoding: 'utf-8' });
    tree.push({ path: POSTS_PATH, mode: '100644', type: 'blob', sha: blob.sha });
    const newTree = await gh(env, 'POST', '/git/trees', { base_tree: h.tree, tree });
    const commit = await gh(env, 'POST', '/git/commits', { message: result.message, tree: newTree.sha, parents: [h.sha] });
    try {
      await gh(env, 'PATCH', `/git/refs/heads/${c.branch}`, { sha: commit.sha, force: false });
      return commit.sha;
    } catch (e) {
      if (e.status !== 422 || attempt === 2) throw e;
    }
  }
}

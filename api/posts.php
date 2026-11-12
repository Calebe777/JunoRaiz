<?php
/*
  GET ................ posts publicados (usado pelo blog)
  GET ?all=1 ......... todos, com rascunhos (painel)
  POST ............... cria ou atualiza: { post, originalSlug, status: 'draft' | 'published' }
  PATCH .............. publica ou despublica: { slug, status }
  DELETE ............. apaga: { slug } (e as imagens que só esse post usava)
*/
require __DIR__ . '/lib.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $all = !empty($_GET['all']);
    if ($all) require_admin();
    $sql = 'SELECT * FROM blog_posts' . ($all ? '' : " WHERE status = 'published'") . ' ORDER BY post_date DESC, id DESC';
    $posts = array_map(fn ($r) => row_to_post($r, $all), db()->query($sql)->fetchAll());
    json_out(['posts' => $posts]);
}

require_admin();
$body = json_body();
$pdo = db();

function find_post(PDO $pdo, string $slug): ?array
{
    $st = $pdo->prepare('SELECT * FROM blog_posts WHERE slug = ?');
    $st->execute([$slug]);
    return $st->fetch() ?: null;
}

function status_of($v): string
{
    if ($v !== 'draft' && $v !== 'published') fail('Status inválido.');
    return $v;
}

if ($method === 'POST') {
    $post = clean_post(is_array($body['post'] ?? null) ? $body['post'] : []);
    $status = status_of($body['status'] ?? 'published');
    $original = isset($body['originalSlug']) && $body['originalSlug'] !== '' ? (string) $body['originalSlug'] : null;

    $pdo->beginTransaction();
    $taken = find_post($pdo, $post['slug']);
    if ($taken && $post['slug'] !== $original) {
        $pdo->rollBack();
        fail('Já existe um post com esse endereço. Troque o endereço.');
    }
    $values = [
        $post['slug'], $status, $post['date'], $post['category'], $post['cover'],
        $post['pt']['title'], $post['pt']['excerpt'], $post['pt']['body'],
        $post['en']['title'] ?? null, $post['en']['excerpt'] ?? null, $post['en']['body'] ?? null,
    ];
    $existing = $original !== null ? find_post($pdo, $original) : null;
    if ($existing) {
        $st = $pdo->prepare('UPDATE blog_posts SET slug = ?, status = ?, post_date = ?, category = ?, cover = ?,
            title_pt = ?, excerpt_pt = ?, body_pt = ?, title_en = ?, excerpt_en = ?, body_en = ? WHERE id = ?');
        $st->execute([...$values, $existing['id']]);
    } else {
        $st = $pdo->prepare('INSERT INTO blog_posts (slug, status, post_date, category, cover,
            title_pt, excerpt_pt, body_pt, title_en, excerpt_en, body_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $st->execute($values);
    }
    $pdo->commit();
    json_out(['ok' => true, 'slug' => $post['slug'], 'status' => $status, 'isNew' => !$existing]);
}

if ($method === 'PATCH') {
    $status = status_of($body['status'] ?? '');
    $st = $pdo->prepare('UPDATE blog_posts SET status = ? WHERE slug = ?');
    $st->execute([$status, (string) ($body['slug'] ?? '')]);
    if (!find_post($pdo, (string) ($body['slug'] ?? ''))) fail('Esse post não existe mais.', 404);
    json_out(['ok' => true, 'status' => $status]);
}

if ($method === 'DELETE') {
    $gone = find_post($pdo, (string) ($body['slug'] ?? ''));
    if (!$gone) fail('Esse post não existe mais.', 404);
    $pdo->prepare('DELETE FROM blog_posts WHERE id = ?')->execute([$gone['id']]);

    $stillUsed = [];
    foreach ($pdo->query('SELECT cover, body_pt, body_en FROM blog_posts')->fetchAll() as $r) {
        $stillUsed = array_merge($stillUsed, post_images($r));
    }
    foreach (array_diff(post_images($gone), $stillUsed) as $img) {
        $file = site_root() . '/' . $img;
        if (is_file($file)) @unlink($file);
    }
    json_out(['ok' => true]);
}

fail('Método não permitido.', 405);

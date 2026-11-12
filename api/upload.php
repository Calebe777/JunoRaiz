<?php
/* POST multipart (campo "image"): salva a imagem em assets/img/blog/ e devolve o caminho.
   O painel já reduz e converte pra WebP antes de enviar. */
require __DIR__ . '/lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Método não permitido.', 405);
require_admin();
/* multipart não passa pelo filtro de JSON: confere a origem pra barrar envio por outros sites */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== parse_url('http://' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST)) {
    fail('Requisição inválida.', 403);
}

$f = $_FILES['image'] ?? null;
if (!$f || $f['error'] !== UPLOAD_ERR_OK) {
    $big = $f && in_array($f['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true);
    fail($big ? 'Imagem grande demais.' : 'Não recebi a imagem. Tente de novo.');
}
if ($f['size'] > 8 * 1024 * 1024) fail('Imagem grande demais (máx. 8 MB).');

$types = ['image/webp' => 'webp', 'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif'];
$info = @getimagesize($f['tmp_name']);
$ext = $info ? ($types[$info['mime']] ?? null) : null;
if (!$ext) fail('Formato de imagem não suportado. Use JPG, PNG, WebP ou GIF.');

$base = mb_strtolower(pathinfo((string) ($_POST['name'] ?? $f['name']), PATHINFO_FILENAME));
$base = strtr($base, ['á' => 'a', 'à' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'é' => 'e', 'ê' => 'e', 'è' => 'e', 'í' => 'i', 'ì' => 'i',
    'ó' => 'o', 'ô' => 'o', 'õ' => 'o', 'ò' => 'o', 'ú' => 'u', 'ü' => 'u', 'ù' => 'u', 'ç' => 'c', 'ñ' => 'n']);
$base = trim(preg_replace('~[^a-z0-9]+~', '-', $base), '-');
$base = substr($base, 0, 40) ?: 'imagem';
$path = IMG_DIR . $base . '-' . bin2hex(random_bytes(3)) . '.' . $ext;

$dir = site_root() . '/' . IMG_DIR;
if (!is_dir($dir) && !@mkdir($dir, 0755, true)) fail('A pasta de imagens do blog não existe e não consegui criar.', 500);
if (!@move_uploaded_file($f['tmp_name'], site_root() . '/' . $path)) fail('Não consegui salvar a imagem no servidor (permissão da pasta assets/img/blog).', 500);

json_out(['path' => $path]);

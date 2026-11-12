<?php
/* JUNO, painel do blog: conexão com o MySQL, sessão do admin e utilidades da API */

declare(strict_types=1);

/* avisos do PHP vão pro log, nunca no meio da resposta JSON */
ini_set('display_errors', '0');

const IMG_DIR = 'assets/img/blog/';
const IMG_RE = '~^assets/img/blog/[a-z0-9][a-z0-9-]{0,80}\.(webp|jpg|jpeg|png|gif)$~';

function config(): array
{
    static $cfg = null;
    if ($cfg === null) {
        $file = __DIR__ . '/config.php';
        if (!is_file($file)) {
            json_out(['error' => 'Painel ainda não configurado: falta o arquivo api/config.php no servidor.'], 503);
        }
        $cfg = require $file;
    }
    return $cfg;
}

function json_out(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $msg, int $status = 400): void
{
    json_out(['error' => $msg], $status);
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo) return $pdo;
    $c = config()['db'];
    try {
        $pdo = new PDO(
            "mysql:host={$c['host']};port={$c['port']};dbname={$c['name']};charset=utf8mb4",
            $c['user'],
            $c['pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
    } catch (PDOException $e) {
        error_log('JUNO blog: ' . $e->getMessage());
        fail('Não consegui conectar no banco de dados.', 500);
    }
    $pdo->exec("CREATE TABLE IF NOT EXISTS blog_posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
        post_date DATE NOT NULL,
        category VARCHAR(40) NOT NULL DEFAULT '',
        cover VARCHAR(200) NOT NULL DEFAULT '',
        title_pt VARCHAR(200) NOT NULL,
        excerpt_pt VARCHAR(600) NOT NULL DEFAULT '',
        body_pt MEDIUMTEXT NOT NULL,
        title_en VARCHAR(200) NULL,
        excerpt_en VARCHAR(600) NULL,
        body_en MEDIUMTEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY status_date (status, post_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    return $pdo;
}

/* ---------- sessão ---------- */

function is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('juno_session');
    /* cookie inválido (ex.: de outro sistema) faria o session_start falhar */
    if (isset($_COOKIE['juno_session']) && !preg_match('~^[A-Za-z0-9,-]{1,128}$~', $_COOKIE['juno_session'])) {
        unset($_COOKIE['juno_session']);
    }
    if (!ini_get('session.save_path')) session_save_path(sys_get_temp_dir());
    session_set_cookie_params([
        'lifetime' => 60 * 60 * 24 * 7,
        'path' => '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.gc_maxlifetime', (string) (60 * 60 * 24 * 7));
    session_start();
}

function logged_in(): bool
{
    start_session();
    return !empty($_SESSION['admin']);
}

/* Toda escrita exige login e corpo JSON (junto com o cookie SameSite, barra envio por outros sites). */
function require_admin(): void
{
    if (!logged_in()) fail('Faça login de novo.', 401);
}

function json_body(): array
{
    if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') === false) fail('Requisição inválida.', 415);
    $data = json_decode((string) file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

/* ---------- posts ---------- */

function row_to_post(array $r, bool $withStatus): array
{
    $p = [
        'slug' => $r['slug'],
        'date' => $r['post_date'],
        'category' => $r['category'],
        'cover' => $r['cover'],
        'pt' => ['title' => $r['title_pt'], 'excerpt' => $r['excerpt_pt'], 'body' => $r['body_pt']],
    ];
    if ($r['title_en'] !== null && $r['title_en'] !== '') {
        $p['en'] = ['title' => $r['title_en'], 'excerpt' => (string) $r['excerpt_en'], 'body' => (string) $r['body_en']];
    }
    if ($withStatus) {
        $p['status'] = $r['status'];
        $p['updatedAt'] = $r['updated_at'];
    }
    return $p;
}

function text($v, int $max): string
{
    return mb_substr(str_replace("\r", '', trim((string) ($v ?? ''))), 0, $max);
}

function clean_lang($c, bool $required): ?array
{
    if (!is_array($c)) $c = [];
    $out = ['title' => text($c['title'] ?? '', 200), 'excerpt' => text($c['excerpt'] ?? '', 600), 'body' => text($c['body'] ?? '', 200000)];
    if (!$required && $out['title'] === '' && $out['body'] === '' && $out['excerpt'] === '') return null;
    if ($out['title'] === '') fail($required ? 'Falta o título do post.' : 'A versão em inglês precisa de título (ou deixe ela toda em branco).');
    if ($out['body'] === '') fail($required ? 'O texto do post está vazio.' : 'A versão em inglês precisa de texto (ou deixe ela toda em branco).');
    return $out;
}

function clean_post(array $p): array
{
    $post = [
        'slug' => text($p['slug'] ?? '', 100),
        'date' => text($p['date'] ?? '', 10),
        'category' => text($p['category'] ?? '', 40),
        'cover' => text($p['cover'] ?? '', 200),
        'pt' => clean_lang($p['pt'] ?? null, true),
        'en' => clean_lang($p['en'] ?? null, false),
    ];
    if (!preg_match('~^[a-z0-9]+(-[a-z0-9]+)*$~', $post['slug'])) fail('O endereço do post só pode ter letras minúsculas, números e hífen.');
    $d = DateTime::createFromFormat('!Y-m-d', $post['date']);
    if (!$d || $d->format('Y-m-d') !== $post['date']) fail('Data inválida.');
    if ($post['cover'] !== '' && !preg_match(IMG_RE, $post['cover'])) fail('Capa inválida.');
    return $post;
}

/* imagens do blog usadas por um post (capa + imagens no texto) */
function post_images(array $r): array
{
    $text = $r['cover'] . "\n" . $r['body_pt'] . "\n" . ($r['body_en'] ?? '');
    preg_match_all('~assets/img/blog/[a-z0-9][a-z0-9-]{0,80}\.(?:webp|jpg|jpeg|png|gif)~', $text, $m);
    return array_values(array_unique($m[0]));
}

function site_root(): string
{
    return dirname(__DIR__);
}

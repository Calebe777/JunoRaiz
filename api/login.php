<?php
/* GET: está logado?  POST { password }: entra.  DELETE: sai. */
require __DIR__ . '/lib.php';

$method = $_SERVER['REQUEST_METHOD'];
$hash = (string) (config()['admin_password_hash'] ?? '');
if ($hash === '') fail('Painel ainda não configurado: falta a senha (admin_password_hash) no api/config.php.', 503);

if ($method === 'GET') {
    json_out(['loggedIn' => logged_in()]);
}

if ($method === 'POST') {
    $body = json_body();
    start_session();
    if (!password_verify((string) ($body['password'] ?? ''), $hash)) {
        sleep(1);
        fail('Senha incorreta.', 401);
    }
    session_regenerate_id(true);
    $_SESSION['admin'] = true;
    json_out(['loggedIn' => true]);
}

if ($method === 'DELETE') {
    start_session();
    $_SESSION = [];
    session_destroy();
    setcookie('juno_session', '', ['expires' => time() - 3600, 'path' => '/', 'secure' => is_https(), 'httponly' => true, 'samesite' => 'Strict']);
    json_out(['loggedIn' => false]);
}

fail('Método não permitido.', 405);

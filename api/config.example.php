<?php
/*
  Configuração do painel do blog.
  Copie este arquivo para config.php (na mesma pasta) e preencha. O config.php
  não vai pro GitHub: ele existe só no servidor.
*/
return [
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'juno',
        'user' => 'juno',
        'pass' => '',
    ],

    /* Senha do painel, guardada como hash. Para gerar, rode no servidor:
       php -r "echo password_hash('SUA-SENHA-AQUI', PASSWORD_DEFAULT), PHP_EOL;"
       e cole o resultado abaixo. */
    'admin_password_hash' => '',
];

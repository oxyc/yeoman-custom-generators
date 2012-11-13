<?php

require 'vendor/autoload.php';
$config = require 'config.php';<% if (slim) { %>
<% if (twig) { %>
$twigView = new \Slim\Extras\Views\Twig();
$twigView->setTemplatesDirectory($config['templates.path']);
$twigView->twigOptions = array(
  'cache' => DEBUG ? FALSE : $config['twig.cache'],
);
<% } %>
$app = new \Slim\Slim(array(
  'mode' => DEBUG ? 'development' : 'production',
<% if (twig) { %>  'view' => $twigView,<% } %>
));
$app->config($config);
<% if (fbsdk) { %>
$fb = new Facebook(array(
  'appId' => $config['fb']['app_id'],
  'secret' => $config['fb']['secret'],
  'cookie' => TRUE,
));
$req = $fb->getSignedRequest();
$app->config('fb.session', array(
  'page_id' => $req['page']['id'],
  'page_admin' => $req['page']['admin'],
  'is_liked' => DEBUG ? TRUE : $req['page']['liked'],
  'country' => $req['user']['country'],
  'locale' => $req['user']['locale'],
));
<% } %>
$app->get('/', function() use ($app) {
  $vars['fb'] = $app->config('fb');
  $vars['site'] = $app->config('site');
  $vars['page'] = $vars['site'];
  return $app->render('index.html', $vars);
});

$app->get('/page/:page', function($page) use ($app) {
  $path = 'pages/' . $page . '.html';
  $vars['site'] = $app->config('site');
  return $app->render($path, $vars);
});

$app->run();<% } %>

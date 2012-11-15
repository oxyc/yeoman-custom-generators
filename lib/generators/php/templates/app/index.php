<?php

require 'vendor/autoload.php';
$config = require 'config.php';<% if (slim) { %>
<% if (twig) { %>
$twigView = new \Slim\Extras\Views\Twig();
$twigView->setTemplatesDirectory($config['templates.path']);
$twigView->twigOptions = array(
  'cache' => DEBUG ? FALSE : $config['twig.cache'],
);
<% } /* twig */ %>
$app = new \Slim\Slim(array(
  'mode' => DEBUG ? 'development' : 'production',
<% if (twig) { %>  'view' => $twigView,<% } /* twig */ %>
));
$app->config($config);<% } /* slim */ %>
<% if (twig && !slim) { %>
$loader = new Twig_Loader_Filesystem($config['templates.path']);
$twig = new Twig_Environment($loader, array(
  'cache' => DEBUG ? FALSE : $config['twig.cache'],
));
<% } /* twig && slim */ %><% if (fbsdk) { %>
<% if (slim) { %>$app->fb<% } else { %>$fb<% } %> = new Facebook(array(
  'appId' => $config['fb']['app_id'],
  'secret' => $config['fb']['secret'],
  'cookie' => TRUE,
));
$req = <% if (slim) { %>$app->fb<% } else { %>$fb<% } %>->getSignedRequest();
<% if (slim) { %>$app->config('fb.session',<% } else { %>$config['fb.session'] =<% } %> array(
  'page_id' => $req['page']['id'],
  'page_admin' => $req['page']['admin'],
  'is_liked' => DEBUG ? TRUE : $req['page']['liked'],
  'country' => $req['user']['country'],
  'locale' => $req['user']['locale'],
<% if (slim) { %>)<% } %>);
<% } /* fb */ %><% if (slim) { %>
$app->get('/', function() use ($app) {<% if (fbsdk) { %>
  $vars['fb'] = $app->config('fb');<% } %>
  $vars['site'] = $app->config('site');
  $vars['site']['title'] = new Welcome();
  $vars['page'] = $vars['site'];
  return $app->render('index.html', $vars);
});

$app->get('/page/:page', function($page) use ($app) {
  $path = 'pages/' . $page . '.html';
  $vars['site'] = $app->config('site');
  return $app->render($path, $vars);
});

$app->run();<% } /* slim */ else { %>
echo new Welcome();
<% } %>

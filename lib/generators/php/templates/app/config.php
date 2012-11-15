<?php

define('DEBUG', TRUE);

return array(
  'templates.path' => 'templates',<% if (twig) { %>
  'twig.cache' => __DIR__ . '/cache',<% } %>
  'debug' => DEBUG,
  'site' => array(
    'title' => 'title',
    'description' => 'description',
    'ga' => 'googleanalaytics',
  ),
  <% if (fbsdk) { %>'fb' => array(
    'app_id' => 'app_id',
    'secret' => 'secret',
    'page_id' => 'page_id',
    'admins' => 'admins',
    'app_url' => 'http://www.facebook.com/',
    'page_url' => 'http://www.facebook.com/',
  ),<% } %>
);

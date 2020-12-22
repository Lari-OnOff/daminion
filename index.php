<?php
  $page = '_main.php';
  if (array_key_exists('task',$_GET))
  {
    $tasks = array('1','2html','2canvas');
    $task = $_GET['task'];
    if (array_search($task,$tasks)!==false) $page = '_task'.$task.'.php'; else
    {
      header('Context-Type: text/plain');
      echo 'Invalid parameter.<br><a href="/">Return to main page</a>';
      exit;
    }
  }
?><!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="/css/style.css" media="all">
    <title>Daminion Test Task</title>
  </head>
  <body>
    <?php require $page; ?>
  </body>
</html>
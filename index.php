<html>
    <head>
        <title>Pixelove</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="style.css" />


        <script type="text/javascript" src="jquery-1.11.3.js"></script>
        <script type="text/javascript" src="jquery.touchevents.js"></script>
        <script type="text/javascript" src="jquery.mousewheel.js"></script>
        <script type="text/javascript" src="main.js"></script>

        <link rel="shortcut icon" href="favicon.png">
        <link rel="icon" type="image/png" href="favicon.png">
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,800,600' rel='stylesheet' type='text/css'>
    </head>
    <body>

      <? include('markup-top.php'); ?>

      <div id="viewer">
        <div class="wrapper">
          <? include('markup-slides.php'); ?>
        </div>
      </div>

      <? include('markup-screens.php'); ?>

    </body>
</html>

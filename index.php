<html>

<head>
    <title>Index</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="css/style-main.css"/>

    <script type="application/javascript" src="bootstrap/js/bootstrap.min.js"></script>
    <script type="application/javascript" src="bootstrap/js/bootstrap.bundle.min.js"></script>
    <script type="application/javascript" src="js/homeActions.js"></script>
    
    <!-- Per redirezionare ad una pagina 
    <meta http-equiv="refresh" content="0; pages/login.html"/>-->
</head>

<body class="">

    <!-- Includi l'header -->
    <?php include_once "pages/utils/header.php"; ?>

    <!-- Includi lo script per l'accesso al db e ottieni gli eventi -->
    <?php 
        include_once "php/db.php"; 
        mainListing();
    ?>
    

    <!-- Includi il footer -->
    <?php include_once "pages/utils/footer.html"; ?>

</body>

</html>
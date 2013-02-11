<?
require 'include/config.php';
require 'include/js.utils.php';
JsUtils::$projectname = "_html_template";
JsUtils::$sitepath = "./";
JsUtils::$buildpath = "assets/js/build/";
JsUtils::setDevMode($devmode);
?>
<!doctype html>
<html class="no-js" lang="en" ng-app="app" lang="en" id="ng-app" class="ng-app:app">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title></title>
    <meta name="description" content="">

    <!-- sharing meta -->
    <meta property="og:title" content="Project Title"/>
    <meta property="og:description" content="Project description"/>
    <!-- share image  50min, max 130x110 pixels -->
    <meta property="og:image" content="./project-logo.jpg"/>
    <!-- end sharing meta -->

    <meta name="viewport" content="width=1024">
    <link rel="stylesheet" href="assets/css/site.css">

    <!--[if lt IE 9]>
    <script src="js/libs/modernizr-2.5.3.min.js"></script>
    <![endif]-->

</head>
<body ng-controller="AppController">
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a
    different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a>
    to experience this site.</p><![endif]-->
<header>

</header>
<div role="main">
    Template
</div>
<footer>

</footer>


<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular-resource.min.js"></script>


<?=getJs('plugins', JsUtils::$useCompiled); ?>
<?=getJs('utils', JsUtils::$useCompiled); ?>
<?=getJs('app', JsUtils::$useCompiled); ?>

<script>
    var _gaq = [
        ['_setAccount', 'UA-XXXXX-X'],
        ['_trackPageview']
    ];
    (function (d, t) {
        var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
        g.src = ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g, s)
    }(document, 'script'));
</script>
</body>
</html>
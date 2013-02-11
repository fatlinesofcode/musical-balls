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
    musical balls #1

    <script type="application/processing">
        // The statements in the setup() function
        // execute once when the program begins
        void setup()
        {
        size(200, 200);  // Size should be the first statement
        stroke(255);     // Set line drawing color to white
        frameRate(30);
        }

        float y = 100;

        // The statements in draw() are executed until the
        // program is stopped. Each statement is executed in
        // sequence and after the last line is read, the first
        // line is executed again.
        void draw()
        {
        background(0);   // Set the background to black
        y = y - 1;
        if (y < 0) { y = height; }
        line(0, y, width, y);
        }
    </script><canvas width="200" height="200"></canvas>

</div>
<footer>

</footer>


<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular-resource.min.js"></script>

<script src="assets/js/libs/processing.js"></script>



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
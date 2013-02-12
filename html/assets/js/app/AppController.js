app.controller('AppController', ['$scope', '$timeout', 'soundService', function AppController($scope, $timeout, soundService) {
    /* structure hack for intellij structrue panel */
    var self = this;
    if (true)self = $scope;
    /* end */

    self.running = false;
    var stage,canvas;

    var balls = [];

    self.initialize = function () {
        toggleListeners(true);
        self.initCanvas()
        log("9","AppController","initialize", "");
    };


    var toggleListeners = function (enable) {
        // remove listeners

        if (!enable)return;
        // add listeners.

        self.$on('$destroy', onDestroy)
    };
    var onDestroy = function (enable) {
        toggleListeners(false);
    };
    self.refresh = function() {
        $timeout(function(){
        });
    }
    self.start = function() {
        self.running = true;
        log("25","AppController","s", "");
        self.initCanvas();
        self.refresh()
    }
    self.initCanvas = function() {
        canvas = $("#ball-stage").get(0);
         stage = new createjs.Stage(canvas);


        var colors = ["#FFFFE0", "#BDFCC9", "#FFC0CB",  "#DDA0DD", "#87CEEB", "#40E0D0", "#00CCCC"];
        var shape;
        for (var i=0; i<20; i++) {
            shape = new createjs.Shape();
            var r = Math.random()*colors.length |0
            shape.graphics.beginFill(colors[r]);
            //shape.graphics.beginFill(colors[0]);
            shape.graphics.drawCircle(0, 0, 10+(r*4))
            shape.x = Math.random()*canvas.width;
            shape.y = Math.random()*canvas.height;
            shape.vx = 2+(Math.random()*10-5);
            shape.vy = 2+(Math.random()*10-5);
         //   shape.snapToPixel = true;

            stage.addChild(shape);
            balls.push(shape);
        }

        createjs.Ticker.addListener(tick);
        createjs.Ticker.setFPS(50);
    }
    var tick = function() {
        var w = canvas.width;
        var h = canvas.height;
        var l = balls.length;
        // iterate through all the children and move them according to their velocity:
        for (var i=0; i<l; i++) {
            var shape = stage.getChildAt(i);
            shape.x = (shape.x+shape.vx+w)%w;
            shape.y = (shape.y+shape.vy+h)%h;
        }

        // draw the updates to stage:
        stage.update();
    }


    self.initialize();
    return self;
}]);
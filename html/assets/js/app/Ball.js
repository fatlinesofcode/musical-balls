
(function() {
    var Ball = function(graphics) {
        this.initialize(graphics);
    }
    var self = Ball.prototype = new createjs.Shape();
    self.vx=0;
    self.vy=0;
    self.diameter=0;
    self.width=0;
    self.height=0;
    self.height=0;

    self.move = function() {

        self.vy += gravity;
        self.x += vx;
        self.y += vy;
        if (self.x + diameter/2 > width) {
            self.x = width - diameter/2;
            self.vx += -0.9;
        }
        else if (self.x - diameter/2 < 0) {
            self.x = diameter/2;
            self.vx *= -0.9;
        }

        if (self.y + diameter/2 > height) {
            self.y = height - diameter/2;
            self.vy *= -0.9;
        }
        else if (self.y - diameter/2 < 0) {
            self.y = diameter/2;
            self.vy *= -0.9;

        }

    }

    window.Ball = Ball;
}());

function Ball2() {
    /* structure hack for intellij structrue panel */
    var self = this;

    var x, y;

    var diameter;

    var vx = 0;

    var vy = 0;

    var id;

    var width, height

    var others = [];

    self.initialize = function () {

        toggleListeners(true);
    };

    var toggleListeners = function (enable) {
        // remove listeners

        if (!enable)return;
        // add listeners.

    };

    self.move = function() {

        vy += gravity;
        x += vx;
        y += vy;
        if (x + diameter/2 > width) {
            x = width - diameter/2;
            vx += -0.9;
        }
        else if (x - diameter/2 < 0) {
            x = diameter/2;
            vx *= -0.9;
        }

        if (y + diameter/2 > height) {
            y = height - diameter/2;
            vy *= -0.9;
        }
        else if (y - diameter/2 < 0) {
            y = diameter/2;
            vy *= -0.9;

        }

    }
    self.collide = function () {

        for (var i = id + 1; i < numBalls; i++) {
            var dx = others[i].x - x;
            var dy = others[i].y - y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var minDist = others[i].diameter / 2 + diameter / 2;
            if (distance < minDist) {
                var angle = Math.atan2(dy, dx);
                var targetX = x + Math.cos(angle) * minDist;
                var targetY = y + Math.sin(angle) * minDist;
                var ax = (targetX - others[i].x) * spring;
                var ay = (targetY - others[i].y) * spring;
                vx -= ax;
                vy -= ay;
                others[i].vx += ax;
                others[i].vy += ay;
            }
        }

    }

    self.initialize();
    return self;
}
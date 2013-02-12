app.controller('AppController', ['$scope', '$timeout', 'soundService', function AppController($scope, $timeout, soundService) {
    /* structure hack for intellij structrue panel */
    var self = this;
    if (true)self = $scope;
    /* end */

    self.running = false;
    var stage, canvas;
    var numBalls = 10;

    var colors = ["#FFFFE0", "#BDFCC9", "#FFC0CB", "#DDA0DD", "#87CEEB", "#40E0D0", "#00CCCC"];
    var bounce = -0.75;
    var balls = [];
    var _gravityY = 0.0;
    var _gravityX = 0.0;
    var FPS = 30;

    self.initialize = function () {
        toggleListeners(true);
        log("9", "AppController", "initialize", "");
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
    self.refresh = function () {
        $timeout(function () {
        });
    }
    self.start = function () {
        soundService.playSound(1)
        self.running = true;
        log("25", "AppController", "s", "");
        self.initCanvas();
        self.refresh()
        window.addEventListener( "devicemotion", onDeviceMotion, false );
    }
    self.initCanvas = function () {
        canvas = $("#ball-stage").get(0);
        stage = new createjs.Stage(canvas);
        var shape;
        for (var i = 0; i < numBalls; i++) {
            shape = new Ball();
            shape.id = i;
            var r = Math.random() * colors.length | 0;
            shape.color = colors[r];
            shape.graphics.beginFill(shape.color);
            //shape.graphics.beginFill(colors[0]);
            shape.radius = 10 + (r * 4);
            shape.mass = shape.radius;
          //  shape.diameter = shape.radius *2;
            shape.graphics.drawCircle(0, 0, shape.radius)
            shape.x = Math.random() * canvas.width;
            shape.y = Math.random() * canvas.height;
            shape.vx = rand(1,3)
            shape.vy = rand(1,3)
            //   shape.snapToPixel = true;
            stage.addChild(shape);
            balls.push(shape);
        }

        createjs.Ticker.addListener(tick);
        createjs.Ticker.setFPS(FPS);
    }
    var tick = function () {
        /*
        for (var i = 0; i < numOfBalls; i++) {
            self.collide(balls[i]);
            self.move(balls[i]);
        }
        */

        balls.forEach(move);
        for (var ballA, i = 0, len = numBalls - 1; i < len; i++) {
            ballA = balls[i];
            for (var ballB, j = i + 1; j < numBalls; j++) {
                ballB = balls[j];
                checkCollision(ballA, ballB);
            }
        }

        stage.update();
    }



    var rotate = function  (x, y, sin, cos, reverse) {
        return {
            x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
            y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
        };
    }

    var checkCollision = function  (ball0, ball1) {
        var dx = ball1.x - ball0.x,
                dy = ball1.y - ball0.y,
                dist = Math.sqrt(dx * dx + dy * dy);
        //collision handling code here
        if (dist < ball0.radius + ball1.radius) {
            //calculate angle, sine, and cosine
            var angle = Math.atan2(dy, dx),
                    sin = Math.sin(angle),
                    cos = Math.cos(angle),
            //rotate ball0's position
                    pos0 = {x: 0, y: 0}, //point
            //rotate ball1's position
                    pos1 = rotate(dx, dy, sin, cos, true),
            //rotate ball0's velocity
                    vel0 = rotate(ball0.vx, ball0.vy, sin, cos, true),
            //rotate ball1's velocity
                    vel1 = rotate(ball1.vx, ball1.vy, sin, cos, true),
            //collision reaction
                    vxTotal = vel0.x - vel1.x;
            vel0.x = ((ball0.mass - ball1.mass) * vel0.x + 2 * ball1.mass * vel1.x) /
                    (ball0.mass + ball1.mass);
            vel1.x = vxTotal + vel0.x;
            //update position - to avoid objects becoming stuck together
            var absV = Math.abs(vel0.x) + Math.abs(vel1.x),
                    overlap = (ball0.radius + ball1.radius) - Math.abs(pos0.x - pos1.x);
            pos0.x += vel0.x / absV * overlap;
            pos1.x += vel1.x / absV * overlap;
            //rotate positions back
            var pos0F = rotate(pos0.x, pos0.y, sin, cos, false),
                    pos1F = rotate(pos1.x, pos1.y, sin, cos, false);
            //adjust positions to actual screen positions
            ball1.x = ball0.x + pos1F.x;
            ball1.y = ball0.y + pos1F.y;
            ball0.x = ball0.x + pos0F.x;
            ball0.y = ball0.y + pos0F.y;
            //rotate velocities back
            var vel0F = rotate(vel0.x, vel0.y, sin, cos, false),
                    vel1F = rotate(vel1.x, vel1.y, sin, cos, false);
            ball0.vx = vel0F.x;
            ball0.vy = vel0F.y;
            ball1.vx = vel1F.x;
            ball1.vy = vel1F.y;
            var color1 = ball0.color;
            var color2 = ball1.color;
            ball0.color = color2;
            ball0.graphics.clear();
            ball0.graphics.beginFill(color2);
            ball0.graphics.drawCircle(0, 0, ball0.radius)

            ball1.color = color1;
            ball1.graphics.clear();
            ball1.graphics.beginFill(color1);
            ball1.graphics.drawCircle(0, 0, ball1.radius)

            soundService.playSound(parseInt(rand(1,8)))
        }
    }


    var checkWalls = function  (ball) {
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.vx *= bounce;
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx *= bounce;
        }
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.vy *= bounce;
        } else if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy *= bounce;
        }
    }

    var move = function  (ball) {
        ball.vy += _gravityY;
        ball.vx += _gravityX;
        ball.x += ball.vx;
        ball.y += ball.vy;
        checkWalls(ball);
    }

    var rand = function (min, max) {
        return Math.random() * (max - min) + min;
        return (Math.random() * max) + min;
    }

    var onDeviceMotion = function ( event )
    {

        var eventDetails;
        try {
            var accel = event.accelerationIncludingGravity;
            eventDetails = "accel: { x: " + accel.x +
                    " &nbsp;&nbsp;y: " + accel.y +
                    " &nbsp;&nbsp;z: " + accel.z ;
            _gravityY = ((accel.x+8)*-1)*0.01
            _gravityX = (accel.y*-1)*0.01;
        }
        catch (e)
        {
            eventDetails = e.toString();
        }

        $('#details').html( eventDetails );
    }

    self.initialize();
    return self;
}]);
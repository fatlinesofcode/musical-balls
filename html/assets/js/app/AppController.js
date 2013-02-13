app.controller('AppController', ['$scope', '$timeout', 'soundService', function AppController($scope, $timeout, soundService) {
    /* structure hack for intellij structrue panel */
    var self = this;
    if (true)self = $scope;
    /* end */

    self.running = false;
    self.initialized = false;
    self.soundService = soundService;
    var stage, canvas;

    var colors = ["#FFFFE0", "#BDFCC9", "#FFC0CB", "#DDA0DD", "#87CEEB", "#40E0D0", "#00CCCC"];
    var bounce = -0.75;
    var balls = [];
    var _gravityY = 0.01;
    var _gravityX = 0.0;
    var FPS = 30;
    var infoText, detailsText;
    var KEYCODE_UP = 38;		//usefull keycode
    var KEYCODE_LEFT = 37;		//usefull keycode
    var KEYCODE_RIGHT = 39;		//usefull keycode
    var KEYCODE_DOWN = 40;		//usefull keycode

    self.initialize = function () {
        toggleListeners(true);
        soundService.controller = self;
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
        $("#title").hide()
        log("25", "AppController", "s", "");
        self.initCanvas();
        self.refresh()
        window.addEventListener( "devicemotion", onDeviceMotion, false );
        $(document).bind('keydown', onKeyboardPress)
    }
    self.initCanvas = function () {
        log("47","AppController","initCanvas" );

        canvas = $("#ball-stage").get(0);
        stage = new createjs.Stage(canvas);

        infoText = new createjs.Text("Click or touch to add balls", "14px Arial", "#FFF");
        infoText.lineWidth = "500";
        infoText.textAlign = "center";
        infoText.border = 1;
        infoText.y = 300;
        infoText.mouseEnabled = false;

        detailsText = new createjs.Text("Details:", "10px Arial", "#FFF");
        detailsText.x = 10;
        detailsText.y = 2;
        detailsText.mouseEnabled = false;

        //txt.outline = true;
        stage.addChild(detailsText);
        stage.addChild(infoText);

        stage.addEventListener("stagemousedown", onStagePress);
        stage.addEventListener("stagemouseup", onStageRelease);
        window.addEventListener('resize', onStageResize, false);
        onStageResize();
        createjs.Touch.enable(stage);
        createjs.Ticker.addListener(tick);
        createjs.Ticker.setFPS(FPS);

        self.initialized = true;
    }
    var onStageResize = function () {
        stage.canvas.width = $(window).width()
        stage.canvas.height = $(window).height()
        infoText.x = ($(window).width()/2) - 0;
        log("64","onStageResize","stage.canvas.width", canvas.width );
    }
    var onStagePress = function(e) {
        log("56","onStagePress","e", e);
        if(balls.length==0){
            infoText.text = "Tilt your device or use your keyboard to change gravity."
         //   infoText.x = ($(window).width()/2) - 180;
        }
        addBall(e.stageX, e.stageY, e.pointerID)
    }
    var onStageRelease = function(e) {

        log("62","onStageRelease","onStageRelease", e);
        for (var i = 0; i < numBalls(); i++) {
            var b = balls[i];

            if(b.pointerID == e.pointerID){
                b.pointerID = NaN;
                log("66","onStageRelease","b", b.pointerID);
            }

        }
    }
    var addBall = function(x, y, pointerID) {
        if(!self.running){
            soundService.playSound(100)
            $timeout(function(){
                self.running = true;
            });

        }
        var shape = new Ball();
        shape.id = balls.length;
        shape.pointerID = pointerID
        var r = Math.random() * colors.length | 0;
        shape.color = colors[r];
        shape.graphics.beginFill(shape.color);
        //shape.graphics.beginFill(colors[0]);
        shape.radius = 10 + (r * 4);
        shape.mass = shape.radius;
        //  shape.diameter = shape.radius *2;
        shape.graphics.drawCircle(0, 0, shape.radius)
        shape.x = x || (Math.random() * canvas.width);
        shape.y = y || (Math.random() * canvas.height);
        shape.vx = rand(-3,3)
        shape.vy = rand(-3,3)
        //shape.mouseEnabled = false;
        //   shape.snapToPixel = true;
        stage.addChild(shape);
        balls.push(shape);
    }
    var numBalls = function(){
        return balls.length;
    }
    var tick = function () {
        /*
        for (var i = 0; i < numOfBalls; i++) {
            self.collide(balls[i]);
            self.move(balls[i]);
        }
        */

        balls.forEach(move);
        for (var ballA, i = 0, len = numBalls() - 1; i < len; i++) {
            ballA = balls[i];
            for (var ballB, j = i + 1; j < numBalls(); j++) {
                ballB = balls[j];
                checkCollision(ballA, ballB);
            }
        }
        detailsText.text = "Gravity: x"+(~~(_gravityX*100)/100)+" : y"+(~~(_gravityY*100)/100)

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
           // ball1.x = ball0.x + pos1F.x;
            setBallX(ball1, ball0.x + pos1F.x)
            //ball1.y = ball0.y + pos1F.y;
            setBallY(ball1, ball0.y + pos1F.y)
           // ball0.x = ball0.x + pos0F.x;
            setBallX(ball0, ball0.x + pos0F.x)
           // ball0.y = ball0.y + pos0F.y;
            setBallY(ball0, ball0.y + pos0F.y)
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

            //soundService.playSound(parseInt(rand(1,8)))
            soundService.playNextNote();
        }
    }


    var checkWalls = function  (ball) {
        if (ball.x + ball.radius > canvas.width) {
          //  ball.x = canvas.width - ball.radius;
            setBallX(ball, canvas.width - ball.radius)
            ball.vx *= bounce;
        } else if (ball.x - ball.radius < 0) {
           // ball.x = ball.radius;
            setBallX(ball, ball.radius)
            ball.vx *= bounce;
        }
        if (ball.y + ball.radius > canvas.height) {
          //  ball.y = canvas.height - ball.radius;
            setBallY(ball, canvas.height - ball.radius)
            ball.vy *= bounce;
        } else if (ball.y - ball.radius < 0) {
            //ball.y = ball.radius;
            setBallY(ball, ball.radius)
            ball.vy *= bounce;
        }
    }

    var move = function  (ball) {
        ball.vy += _gravityY;
        ball.vx += _gravityX;
        //updatePosition(ball, ball.x+ball.vx,ball.y+ball.vy)
        setBallX(ball, ball.x+ball.vx)
        setBallY(ball, ball.y+ball.vy)
        /*
        if( isNaN(ball.pointerID)){
            ball.x += ball.vx;
            ball.y += ball.vy;
            updatePosition(ball, ball.x+ball.vx,ball.y+ball.vy)
        }*/
        checkWalls(ball);
    }
    var setBallX = function(ball,x) {
        if( isNaN(ball.pointerID)){
            ball.x =x
        }
    }
    var setBallY = function(ball,y) {
        if( isNaN(ball.pointerID)){
            ball.y =y
        }
    }


    var rand = function (min, max) {
        return Math.random() * (max - min) + min;
        return (Math.random() * max) + min;
    }

    var onKeyboardPress = function ( e ){



        var code = (e.keyCode ? e.keyCode : e.which);
        log("290","onKeyboardPress","onKeyboardPress", code);
        var amt = 0.01;
        switch(code){
        case KEYCODE_UP:
                _gravityY -= amt
            break;
        case KEYCODE_DOWN:
            _gravityY += amt
            break;
        case KEYCODE_LEFT:
            _gravityX -= amt
            break;
        case KEYCODE_RIGHT:
            _gravityX += amt
            break;
            default:
            break;
        }
    }
    var onDeviceMotion = function ( event )
    {

        var eventDetails;
        try {
            var accel = event.accelerationIncludingGravity;
            eventDetails = "accel: { x: " + ~~(accel.x) +
                    " y: " + ~~(accel.y) +
                    " z: " + ~~(accel.z) +
                    " o: " + window.orientation;

            var o = window.orientation;

            switch(o){
            case 0:
                _gravityX = ((accel.x))*0.01
                _gravityY = (accel.y+9)*-0.01;
                break;
            case 180:
                _gravityX = ((accel.x))*-0.01
                _gravityY = (accel.y+9)*0.01;
                break;

            case -90:
                _gravityY = ((accel.x-9)*1)*0.01
                _gravityX = (accel.y*1)*0.01;
                break;

            case 90:
                _gravityY = ((accel.x+8)*-1)*0.01
                _gravityX = (accel.y*-1)*0.01;
                break;
            }


        }
        catch (e)
        {
            eventDetails = e.toString();
        }

       // detailsText.text = eventDetails;
    }

    self.initialize();
    return self;
}]);
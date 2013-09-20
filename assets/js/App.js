/**
 * Created by // frontside.com.au
 *
 * User: phil
 * Date: 14/02/13
 * Time: 3:54 PM
 *
 * Excuse the sloppy code. This was thrown together in a few hours.
 */

$(document).ready(function () {
    $.ajaxSetup({
        cache: true
    });
    var url1 = "http://code.createjs.com/easeljs-0.6.0.min.js";
    var url2 = "http://code.createjs.com/soundjs-0.4.0.min.js";
    $.getScript(url1, function () {
        $.getScript(url2, function () {
            new App(new soundService())
        })
    })
});
function App(soundService) {
    /* structure hack for intellij structrue panel */
    var self = this;

    self.running = false;
    self.initialized = false;
    var stageClicked = false;
    var stage, canvas;

    var colors = ["#FFFFE0", "#BDFCC9", "#FFC0CB", "#DDA0DD", "#87CEEB", "#40E0D0", "#00CCCC"];
    var bounce = -0.75;
    var balls = [];
    var _gravityY = 0.00;
    var _gravityX = 0.0;
    var FPS = 30;
    var infoText, detailsText;
    var KEYCODE_UP = 38;		//usefull keycode
    var KEYCODE_LEFT = 37;		//usefull keycode
    var KEYCODE_RIGHT = 39;		//usefull keycode
    var KEYCODE_DOWN = 40;		//usefull keycode
    var ballsInitalized = false;
    var iOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/);

    self.initialize = function () {
        toggleListeners(true);
        self.initCanvas();
        soundService.controller = self;
        log("9", "AppController", "initialize", "");
    };


    var toggleListeners = function (enable) {
        if (!enable)return;

    };

    self.refresh = function () {

    }
    self.start = function () {
        self.initGame()
        self.refresh()
        window.addEventListener("devicemotion", onDeviceMotion, false);
        stage.addEventListener("stagemousedown", onStagePress);
        stage.addEventListener("stagemouseup", onStageRelease);
        $(document).bind('keydown', onKeyboardPress)
    }
    self.initCanvas = function () {
        canvas = $("#ball-stage").get(0);
        stage = new createjs.Stage(canvas);

        infoText = new createjs.Text("Loading...", "14px Arial", "#FFF");
        infoText.lineWidth = "500";
        infoText.textAlign = "center";
        infoText.border = 1;
        infoText.y = $(window).height() / 2;
        infoText.mouseEnabled = false;

        detailsText = new createjs.Text("", "10px Arial", "#FFF");
        detailsText.x = 10;
        detailsText.y = 2;
        detailsText.mouseEnabled = false;

        stage.addChild(detailsText);
        stage.addChild(infoText);


        window.addEventListener('resize', onStageResize, false);
        onStageResize();
        createjs.Touch.enable(stage);
        createjs.Ticker.addListener(tick);
        createjs.Ticker.setFPS(FPS);


        self.initialized = true;
    }
    self.initGame = function () {
        if (!iOS) {
            initBalls($(window).width() / 2, $(window).height() / 2);
        } else {
            infoText.text = "Touch to start."
        }
    }
    var onStageResize = function () {
        stage.canvas.width = $(window).width()
        stage.canvas.height = $(window).height()
        infoText.x = ($(window).width() / 2) - 0;
    }

    var onStagePress = function (e) {
        if (!stageClicked) {
            stageClicked = true;
            infoText.text = "Tilt your device or use your keyboard to change gravity."
        }
        if (!ballsInitalized) {
            initBalls(e.stageX, e.stageY);
            infoText.text = "Click or touch to add more balls"
        } else {
            infoText.text = "Tilt your device or use your keyboard to change gravity."
            addBall(e.stageX, e.stageY, e.pointerID)
        }
    }
    var initBalls = function (stageX, stageY) {
        ballsInitalized = true;
        var tx = 0;
        var ty = 0;
        for (var i = 0; i < 7; i++) {
            tx = rand(-300, 300);
            ty = rand(-200, 200);
            addBall(stageX + tx, stageY + ty, NaN)
        }
        infoText.text = "Click or touch to add more balls."
    }
    var onStageRelease = function (e) {
        for (var i = 0; i < numBalls(); i++) {
            var b = balls[i];

            if (b.pointerID == e.pointerID) {
                b.pointerID = NaN;
                log("66", "onStageRelease", "b", b.pointerID);
            }

        }
    }
    var addBall = function (x, y, pointerID) {
        if (!self.running) {
            soundService.playSound(100)
            //   $timeout(function(){
            self.running = true;
            //   });

        }
        var shape = new createjs.Shape();
        shape.id = balls.length;
        shape.pointerID = pointerID
        var r = Math.random() * colors.length | 0;
        shape.color = colors[r];
        shape.graphics.beginFill(shape.color);
        shape.radius = 10 + (r * 4);
        shape.mass = shape.radius;
        shape.graphics.drawCircle(0, 0, shape.radius)
        shape.x = x || (Math.random() * canvas.width);
        shape.y = y || (Math.random() * canvas.height);
        shape.vx = rand(-3, 3)
        shape.vy = rand(-3, 3)
        stage.addChild(shape);
        balls.push(shape);
    }
    var numBalls = function () {
        return balls.length;
    }
    var tick = function () {
        balls.forEach(move);
        for (var ballA, i = 0, len = numBalls() - 1; i < len; i++) {
            ballA = balls[i];
            for (var ballB, j = i + 1; j < numBalls(); j++) {
                ballB = balls[j];
                checkCollision(ballA, ballB);
            }
        }
        detailsText.text = "Gravity: x" + (~~(_gravityX * 100) / 100) + " : y" + (~~(_gravityY * 100) / 100)

        stage.update();
    }


    var rotate = function (x, y, sin, cos, reverse) {
        return {
            x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
            y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
        };
    }

    var checkCollision = function (ball0, ball1) {
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


    var checkWalls = function (ball) {
        if (ball.x + ball.radius > canvas.width) {
            //  ball.x = canvas.width - ball.radius;
            setBallX(ball, canvas.width - ball.radius)
            ball.vx *= bounce;
        } else
            if (ball.x - ball.radius < 0) {
                // ball.x = ball.radius;
                setBallX(ball, ball.radius)
                ball.vx *= bounce;
            }
        if (ball.y + ball.radius > canvas.height) {
            //  ball.y = canvas.height - ball.radius;
            setBallY(ball, canvas.height - ball.radius)
            ball.vy *= bounce;
        } else
            if (ball.y - ball.radius < 0) {
                //ball.y = ball.radius;
                setBallY(ball, ball.radius)
                ball.vy *= bounce;
            }
    }

    var move = function (ball) {
        ball.vy += _gravityY;
        ball.vx += _gravityX;
        setBallX(ball, ball.x + ball.vx)
        setBallY(ball, ball.y + ball.vy)
        checkWalls(ball);
    }
    var setBallX = function (ball, x) {
        if (isNaN(ball.pointerID)) {
            ball.x = x
        }
    }
    var setBallY = function (ball, y) {
        if (isNaN(ball.pointerID)) {
            ball.y = y
        }
    }


    var rand = function (min, max) {
        return Math.random() * (max - min) + min;
        return (Math.random() * max) + min;
    }

    var onKeyboardPress = function (e) {


        var code = (e.keyCode ? e.keyCode : e.which);
        var amt = 0.01;
        switch (code) {
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
    var onDeviceMotion = function (event) {

        var eventDetails;
        try {
            var accel = event.accelerationIncludingGravity;
            eventDetails = "accel: { x: " + ~~(accel.x) +
                    " y: " + ~~(accel.y) +
                    " z: " + ~~(accel.z) +
                    " o: " + window.orientation;

            var o = window.orientation;

            switch (o) {
            case 0:
                _gravityX = ((accel.x)) * 0.01
                _gravityY = (accel.y + 9) * -0.01;
                break;
            case 180:
                _gravityX = ((accel.x)) * -0.01
                _gravityY = (accel.y + 9) * 0.01;
                break;

            case -90:
                _gravityY = ((accel.x - 9) * 1) * 0.01
                _gravityX = (accel.y * 1) * 0.01;
                break;

            case 90:
                _gravityY = ((accel.x + 8) * -1) * 0.01
                _gravityX = (accel.y * -1) * 0.01;
                break;
            }


        }
        catch (e) {
            eventDetails = e.toString();
        }

    }

    self.initialize();
    return self;
}


function soundService() {
    /* structure hack for intellij structrue panel */
    var self = this;

    var preload;
    var _numLoaded = 0;
    var _noteIndex = 0;
    self.controller = null;
    self.loadAmount = 0;
    self.soundsPath = 'http://srv.re/musical-balls/assets/mp3/';

    self.sounds = [
        {sound: 'C', id: 1},
        {sound: 'D', id: 2},
        {sound: 'E', id: 3},
        {sound: 'F', id: 4},
        {sound: 'G', id: 5},
        {sound: 'A', id: 6},
        {sound: 'B', id: 7},
        {sound: 'C_', id: 8},
        {sound: 'blank', id: 100}
    ];
    self.sounds1 = [
        {sound: 'Game-Shot', id: 1}
    ];

    var londonBridge = 'g,a,g,f' +
            ',e,f,g' +
            ',d,e,f' +
            ',e,f,g' +
            'g,a,g,f' +
            'e,f,g,d,g,e,c';


    self.notes = [5, 6, 5, 4,
        3, 4, 5,
        2, 3, 4,
        3, 4, 5,
        5, 6, 5, 4,
        3, 4, 5, 2, 5, 3, 1
    ]


    self.initialize = function () {
        self.initSound()
    };


    self.initSound = function () {

        var manifest = [ ];

        for (var i = 0; i < self.sounds.length; i++) {
            var mp3 = self.sounds[i].sound + ".mp3";
            var ogg = self.sounds[i].sound + ".ogg";
            var id = self.sounds[i].id//"0"+(i+1);
            manifest.push({src: self.soundsPath + mp3 + "|" + self.soundsPath + ogg, id: id, data: id});
        }

        createjs.Sound.addEventListener("loadComplete", createjs.proxy(soundLoaded, this)); // add an event listener for when load is completed
        createjs.Sound.registerManifest(manifest);
        console.log("sound");

    }

    var soundLoaded = function (event) {
        _numLoaded++;
        self.loadAmount = ~~((_numLoaded / self.sounds.length) * 100) + "%"

        if (_numLoaded != self.sounds.length)return;

        $("#bt-start").css({display: 'block'})
        setTimeout(function () {
            self.controller.start();
        }, 100);

    }


    self.stop = function () {
        if (preload != null) { preload.close(); }
        createjs.Sound.stop();
    }


    self.playSound = function (id) {
        //  var instance = createjs.Sound.play(id, createjs.Sound.INTERRUPT_LATE);//, 0, 0, false, 1);
        var instance = createjs.Sound.play(id, createjs.Sound.INTERRUPT_NONE);//, 0, 0, false, 1);
        if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) { return; }
        instance.onComplete = function (instance) {
        }

    }
    self.playNextNote = function () {
        self.playSound(self.notes[_noteIndex])
        _noteIndex++;
        if (_noteIndex >= self.notes.length) {
            _noteIndex = 0;
        }
    }

    self.initialize();
    return self;
}

window.log = function f() {
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) {
        var args = arguments, newarr;
        args.callee = args.callee.caller;
        newarr = [].slice.call(args);

        if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);
    }
};
(function (a) {
    function b() {}

    for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop());) {a[d] = a[d] || b;}
})
        
(function () {
    try {
        console.log();
        return window.console;
    } catch (a) {return (window.console = {});}
}());


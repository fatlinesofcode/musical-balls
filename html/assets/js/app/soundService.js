app.factory('soundService', ['$timeout', function ($timeout) {
    /* structure hack for intellij structrue panel */
    service = null;
    var self = service;
    if (true)self = {};
    /* end */
    var _resource;
    var preload;
    self.controller=null;
    self.loadAmount = 0;
    self.soundsPath = 'assets/mp3/';

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
    self.initialize = function () {
        log("11", "soundService", "initialize", "");
        self.initSound()
    };

    var _numLoaded=0;

    self.resource = function () {
        return _resource;
    };


    self.initSound = function () {
        if (window.top != window) {
            document.getElementById("header").style.display = "none";
        }

        if (!createjs.Sound.initializeDefaultPlugins()) {
            document.getElementById("error").style.display = "block";
            document.getElementById("content").style.display = "none";
            return;
        }

        var manifest = [


        ];

        for (var i = 0; i < self.sounds.length; i++) {
            var mp3 = self.sounds[i].sound + ".mp3";
            var ogg = self.sounds[i].sound + ".ogg";
            var id = self.sounds[i].id//"0"+(i+1);
            manifest.push({src: self.soundsPath + mp3 + "|" + self.soundsPath + ogg, id: id, data: id});
        }
        /*
         preload.onComplete = self.onSoundsLoaded;
         preload.loadManifest(manifest, true);
         */
        createjs.Sound.addEventListener("loadComplete", createjs.proxy(soundLoaded, this)); // add an event listener for when load is completed
        createjs.Sound.registerManifest(manifest);
        console.log("sound");

    }

    var soundLoaded = function (event) {
        _numLoaded++;
        $timeout(function(){
            self.loadAmount = ((_numLoaded / self.sounds.length) * 100) + "%"
        });

        if(_numLoaded != self.sounds.length)return;

        console.log("29", "soundLoaded", "soundLoaded", _numLoaded, self.sounds.length);
        $("#bt-start").css({display: 'block'})
        setTimeout(function(){
            self.controller.start();
        },100);

      //  $("#bt-start").bind('mouseup', start)

    }
    /*
    self.start = function (e) {
        console.log(InputEvent.pageX(e))
        $("#bt-start").css({display: 'none'})
        $("#ball-stage").css({display: 'block'})
        // playSound(1)
        addBall(new Point(parseInt(InputEvent.pageX(e)), parseInt(InputEvent.pageY(e))))
    }*/

    self.stop = function () {
        if (preload != null) { preload.close(); }
        createjs.Sound.stop();
    }


    self.playSound = function (id) {
        var instance = createjs.Sound.play(id, createjs.Sound.INTERRUPT_LATE);//, 0, 0, false, 1);
        if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) { return; }
        instance.onComplete = function (instance) {
        }

    }

    self.initialize()
    return self;

}]);
var preload;

function initSound() {
    if (window.top != window) {
        document.getElementById("header").style.display = "none";
    }

    if (!createjs.Sound.initializeDefaultPlugins()) {
        document.getElementById("error").style.display = "block";
        document.getElementById("content").style.display = "none";
        return;
    }

   // document.getElementById("loader").className = "loader";
    var assetsPath = "assets/mp3/";
    var manifest = [
        {src:assetsPath+"C_.mp3|"+assetsPath+"C_.ogg", id:1}
        //{src:assetsPath+"Game-Spawn.mp3|"+assetsPath+"Game-Spawn.ogg", id:2},

    ];

    createjs.Sound.addEventListener("loadComplete", createjs.proxy(soundLoaded, this)); // add an event listener for when load is completed
    createjs.Sound.registerManifest(manifest);
    console.log("sound");

}

function soundLoaded(event) {
    console.log("29","soundLoaded","soundLoaded", "");
    playSound(1)
}

function stop() {
    if (preload != null) { preload.close(); }
    createjs.Sound.stop();
}

function playSound(id) {
    //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
    var instance = createjs.Sound.play(id, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 1);
    if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) { return; }
    instance.onComplete = function(instance) {
    }

}
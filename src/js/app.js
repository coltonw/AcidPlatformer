(function( acidgame, $, undefined ) {

    var assets;
    var stage;
    var w, h;
    var sky, wendi, ground, hill, hill2;
    var runningRate, isInWarp, isStationary, groundHeight, lowerWendi;
    var stationaryPosition, isPassed;

    acidgame.init = function() {
        /*if (window.top != window) {
            document.getElementById("header").style.display = "none";
        }

        document.getElementById("loader").className = "loader";*/

        var canvas = document.getElementById("testCanvas")
        stage = new createjs.Stage(canvas);

        runningRate = 2.5;
        isInWarp = false;
        isStationary = false;
        stationaryPosition = 300;
        isPassed = false;
        groundHeight = 79;
        lowerWendi = 7;

        spriteSheet ={
            "animations": {
                "run": [0, 9, "run", 2],
                "jump": {
                    frames: [0,1,2,12,12,12,12,12],
                    frequency: 2
                }
            },
            "images": ["img/wendi/wendiWalk.png","img/wendi/wendiJump.png"],
            "frames": {"height": 125, "width": 125}
        };

        var ss = new createjs.SpriteSheet(spriteSheet);
        wendi = new createjs.BitmapAnimation(ss);

        // Set up looping
        ss.getAnimation("run").next = "run";
        ss.getAnimation("jump").next = "run";
        wendi.gotoAndPlay("run");

        // grab canvas width and height for later calculations:
        w = canvas.width;
        h = canvas.height;

        // Position the Wendi sprite
        wendi.x = -200;
        wendi.y = h-125-groundHeight+lowerWendi;
        wendi.scaleX = wendi.scaleY = 1.0;

        assets = [];

        manifest = [
            {src:"img/wendi/wendiWalk.png", id:"wendi"},
            {src:"img/wendi/wendiJump.png", id:"wendiJump"},
            {src:"img/sky.png", id:"sky"},
            {src:"img/ground.png", id:"ground"},
            {src:"img/parallaxHill1.png", id:"hill"},
            {src:"img/parallaxHill2.png", id:"hill2"}
        ];

        loader = new createjs.LoadQueue(false);
        loader.onFileLoad = handleFileLoad;
        loader.onComplete = handleComplete;
        loader.loadManifest(manifest);
        stage.autoClear = false;
    };

    function handleFileLoad(event) {
        assets.push(event.item);
    }

    function handleComplete() {
        for(var i=0;i<assets.length;i++) {
            var item = assets[i];
            var id = item.id;
            var result = loader.getResult(id);

            if (item.type == createjs.LoadQueue.IMAGE) {
                var bmp = new createjs.Bitmap(result);
            }

            switch (id) {
                case "sky":
                    sky = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,w,h));
                    break;
                case "ground":
                    ground = new createjs.Shape();
                    var g = ground.graphics;
                    g.beginBitmapFill(result);
                    g.drawRect(0, 0, w+330, groundHeight);
                    ground.y = h-groundHeight;
                    break;
                case "hill":
                    hill = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,282,59));
                    hill.x = Math.random() * w;
                    hill.scaleX = hill.scaleY = 3;
                    hill.y = 144;
                    break;
                case "hill2":
                    hill2 = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,212,50));
                    hill2.x = Math.random() * w;
                    hill2.scaleX = hill2.scaleY = 3;
                    hill2.y = 171;
                    break;
            }
        }

        document.getElementById("loader").className = "";

        if (wendi == null) {
            //console.log("Can not play. Wendi sprite was not loaded.");
            return;
        }

        stage.addChild(sky, ground, hill, hill2, wendi);
        stage.addEventListener("stagemousedown", handleJumpStart);

        createjs.Ticker.setFPS(40);
        createjs.Ticker.addEventListener("tick", tick);
    }

    function handleJumpStart() {
        wendi.gotoAndPlay("jump");
    }

    function tick() {
        var outside = w + 20;
        var position = wendi.x+runningRate;
        wendi.x = (position >= outside) ? -200 : position;

        ground.x = (ground.x-15) % 330;
        hill.x = (hill.x - 0.8);
        if (hill.x + 838 <= 0) { hill.x = outside; }
        hill2.x = (hill2.x - 1.2);
        if (hill2.x + 633 <= 0) { hill2.x = outside; }

        stage.update();
    }
}(window.acidgame = window.acidgame || {}, jQuery));
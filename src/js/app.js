(function( acidgame, $, undefined ) {

    var assets;
    var stage;
    var w, h;
    var sky, grant, ground, hill, hill2;
    var runningRate, isInWarp, isStationary;
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

        spriteSheet ={"animations": {"run": [0, 25], "jump": [26, 63]}, "images": ["img/runningGrant.png"], "frames": {"regX": 0, "height": 292.5, "count": 64, "regY": 0, "width": 165.75}};

        var ss = new createjs.SpriteSheet(spriteSheet);
        grant = new createjs.BitmapAnimation(ss);

        // Set up looping
        ss.getAnimation("run").next = "run";
        ss.getAnimation("jump").next = "run";
        grant.gotoAndPlay("run");

        // Position the Grant sprite
        grant.x = -200;
        grant.y = 90;
        grant.scaleX = grant.scaleY = 0.8;

        // grab canvas width and height for later calculations:
        w = canvas.width;
        h = canvas.height;

        assets = [];

        manifest = [
            {src:"img/runningGrant.png", id:"grant"},
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
                    g.drawRect(0, 0, w+330, 79);
                    ground.y = h-79;
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

        if (grant == null) {
            //console.log("Can not play. Grant sprite was not loaded.");
            return;
        }

        stage.addChild(sky, ground, hill, hill2, grant);
        stage.addEventListener("stagemousedown", handleJumpStart);

        createjs.Ticker.setFPS(40);
        createjs.Ticker.addEventListener("tick", tick);
    }

    function handleJumpStart() {
        grant.gotoAndPlay("jump");
    }

    function tick() {
        var outside = w + 20;
        var position = grant.x+runningRate;
        grant.x = (position >= outside) ? -200 : position;

        ground.x = (ground.x-15) % 330;
        hill.x = (hill.x - 0.8);
        if (hill.x + 838 <= 0) { hill.x = outside; }
        hill2.x = (hill2.x - 1.2);
        if (hill2.x + 633 <= 0) { hill2.x = outside; }

        stage.update();
    }
}(window.acidgame = window.acidgame || {}, jQuery));
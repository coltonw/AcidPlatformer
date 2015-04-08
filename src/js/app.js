(function( acidgame, $, undefined ) {

    var assets;
    var stage;
    var w, h;
    var sky, wendi, wendiPhysics, ground, hill, hill2, hillHeight, hill2Height;
    var fps, isStationary, groundHeight, pixelsPerBlock;

    acidgame.init = function() {
        var canvas = document.getElementById("gameCanvas");

        canvas.width = $(window).width();
        canvas.height = $(window).height();

        stage = new createjs.Stage(canvas);

        fps = 40;
        isStationary = false;
        groundHeight = 79;
        pixelsPerBlock = 40;

        // grab canvas width and height for later calculations:
        w = canvas.width;
        h = canvas.height;

        $(window).on('resize', resizeCanvas);

        assets = [];

        manifest = [
            {src:"img/wendi/wendiWalk.png", id:"wendi"},
            {src:"img/wendi/wendiJump.png", id:"wendiJump"},
            {src:"img/wendi/wendiStand.png", id:"wendiStand"},
            {src:"img/sky.png", id:"sky"},
            {src:"img/ground.png", id:"ground"},
            {src:"img/parallaxHill1.png", id:"hill"},
            {src:"img/parallaxHill2.png", id:"hill2"}
        ];

        loader = new createjs.LoadQueue(false);
        loader.on('fileload', handleFileLoad);
        loader.on('complete', handleComplete);
        loader.loadManifest(manifest);
        stage.autoClear = false;
    };

    function handleFileLoad(event) {
        assets.push(event.item);
    }

    function resizeCanvas(event) {
        var canvas = document.getElementById("gameCanvas");
        canvas.width = $(window).width();
        canvas.height = $(window).height();
        w = canvas.width;
        h = canvas.height;
        acidgame.physics.setCanvasDimensions(w, h);
        redrawBackground();
    }

    function handleComplete() {
        var ss = new createjs.SpriteSheet({
            "animations": {
                "run": [0, 9, "run", 0.5],
                "jump": {
                    frames: [0, 1, 2],
                    next: "airborne",
                    frequency: 2
                },
                "airborne": 12,
                "stand": 13
            },
            "images": [loader.getResult('wendi'), loader.getResult('wendiJump'), loader.getResult('wendiStand')],
            "frames": {"height": 125, "width": 125}
        });
        createjs.SpriteSheetUtils.addFlippedFrames(ss, true);
        wendi = new createjs.Sprite(ss);

        // Set up character starting animation
        wendi.gotoAndPlay("stand");

        acidgame.physics.init(wendi, groundHeight, w, h, pixelsPerBlock, fps);

        wendiPhysics = acidgame.physics.getCharacter();

        acidgame.controls.init(wendiPhysics, fps);

        for(var i=0;i<assets.length;i++) {
            var item = assets[i];
            var id = item.id;
            var result = loader.getResult(id);

            switch (id) {
                case "sky":
                    sky = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,w,400));
                    sky.scaleY = Math.max(h/400, 1);
                    break;
                case "ground":
                    ground = new createjs.Shape();
                    var g = ground.graphics;
                    g.beginBitmapFill(result);
                    g.drawRect(0, 0, w+330, groundHeight);
                    ground.y = h-groundHeight;
                    break;
                case "hill":
                    hillHeight = 59;
                    hill = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,282,hillHeight));
                    hill.x = Math.random() * w;
                    hill.scaleX = hill.scaleY = 3;
                    hill.y = h-groundHeight-hillHeight*hill.scaleY;
                    break;
                case "hill2":
                    hill2Height = 50;
                    hill2 = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,212,hill2Height));
                    hill2.x = Math.random() * w;
                    hill2.scaleX = hill2.scaleY = 3;
                    hill2.y = h-groundHeight-hill2Height*hill2.scaleY;
                    break;
            }
        }

        document.getElementById("loader").className = "";

        stage.addChild(sky, ground, hill, hill2, wendi);

        createjs.Ticker.setFPS(fps);
        createjs.Ticker.addEventListener("tick", tick);
    }

    function redrawBackground() {
        for(var i=0;i<assets.length;i++) {
            var item = assets[i];
            var id = item.id;
            var result = loader.getResult(id);

            switch (id) {
                case "sky":
                    sky.graphics.clear();
                    sky.graphics.beginBitmapFill(result).drawRect(0,0,w,400);
                    sky.scaleY = Math.max(h/400, 1);
                    break;
                case "ground":
                    var g = ground.graphics;
                    g.clear();
                    g.beginBitmapFill(result);
                    g.drawRect(0, 0, w+330, groundHeight);
                    ground.y = h-groundHeight;
                    break;
                case "hill":
                    hill.y = h-groundHeight-hillHeight*hill.scaleY;
                    break;
                case "hill2":
                    hill2.y = h-groundHeight-hill2Height*hill2.scaleY;
                    break;
            }
        }
    }

    function tick() {
        var outside = w + 20;
        wendiPhysics.rectangle.x = (wendiPhysics.rectangle.x >= outside / pixelsPerBlock) ? -5 : wendiPhysics.rectangle.x;
        wendiPhysics.rectangle.x = (wendiPhysics.rectangle.x < -5) ? outside / pixelsPerBlock : wendiPhysics.rectangle.x;

        acidgame.physics.run();

        acidgame.controls.runCharacter();

        stage.update();
    }
}(window.acidgame = window.acidgame || {}, jQuery));
(function( acidgame, $, undefined ) {

    acidgame.controls = acidgame.controls || {};

    var character,
        groundAcceleration = 48, // blocks per second per second
        airAcceleration = 36, // blocks per second per second
        maxRunSpeed = 12, // blocks per second

        maxRunPerFrame,

        currentAnimationKey = 'stand',
        previousAnimation = '',
        direction = '', // can be empty string or _h
        stopping = true,
        keyDown = {
            up: false,
            right: false,
            left: false
        },

        //TODO: Calculate jump based on these constants
        minJumpHeight = 2.1, // blocks
        maxJumpHeight = 8.1, // blocks
        maxJumpTime = 2,  // seconds
        gravity = -40,  // TODO: calculate this!!!
        initialJumpVelocity = 20; // TODO: calculate this!!!

    acidgame.controls.init = function(theCharacter, fps) {
        character = theCharacter;

        maxRunPerFrame = maxRunSpeed / fps;

        character.onGroundCollision = handleJumpStop;
        $('body').on('keydown', function(event) {
            if (event.which === 38 || event.which === 87) { // up arrow and 'w' key
                event.preventDefault();
                keyDown.up = true;
                handleJumpStart();
            }
            else if (event.which === 39 ||  event.which === 68) { // right arrow and 'd' key
                event.preventDefault();
                direction = '';
                keyDown.right = true;
                handleRunStart();
            }
            else if (event.which === 37 ||  event.which === 65) { // left arrow and 'a' key
                event.preventDefault();
                direction = '_h';
                keyDown.left = true;
                handleRunStart(-1);
            }
        });

        $('body').on('keyup', function(event) {
            if (event.which === 38 || event.which === 87) { // up arrow and 'w' key
                event.preventDefault();
                keyDown.up = false;
                // TODO: different heights of jumps
            }
            else if (event.which === 39 ||  event.which === 68) { // right arrow and 'd' key
                event.preventDefault();
                keyDown.right = false;
                checkRunStop();
            }
            else if (event.which === 37 ||  event.which === 65) { // left arrow and 'a' key
                event.preventDefault();
                keyDown.left = false;
                checkRunStop();
            }
        });
    }

    acidgame.controls.runCharacter = function() {
        var xVelocity = character.velocity[0];
        if (xVelocity * character.directionMultiplier - maxRunPerFrame >= 0) {
            acidgame.physics.setXVelocity(character, maxRunSpeed * character.directionMultiplier);
            acidgame.physics.setXAcceleration(character, 0);
        }
        if (!character.isAirborne && stopping) {
            xAcceleration = character.acceleration[0];
            if ((xAcceleration ? xAcceleration < 0 ? -1 : 1 : 0) === (xVelocity ? xVelocity < 0 ? -1 : 1 : 0)) {  // Check if signs are equal
                acidgame.physics.setVelocity(character, 0, 0);
                acidgame.physics.setAcceleration(character, 0, 0);
                currentAnimationKey = 'stand';
                playCurrentAnimation();
            }
        }
    }

    function handleJumpStart() {
        if (!character.isAirborne) {
            acidgame.physics.setYVelocity(character, initialJumpVelocity);
            acidgame.physics.setAcceleration(character, 0, gravity);
            acidgame.physics.setAirborne(character, true);
            playAnimation('jump' + direction);
        }
    }

    /**
     * Use -1 for the dirMultiplier to move left
     */
    function handleRunStart(dirMultiplier) {
        character.directionMultiplier = dirMultiplier || 1;
        stopping = false;
        var xVelocity = character.velocity[0];
        if (xVelocity * character.directionMultiplier - maxRunPerFrame < 0) {
            currentAnimationKey = 'run';
            if (!character.isAirborne) {
                acidgame.physics.setAcceleration(character, groundAcceleration * character.directionMultiplier, 0);
                playCurrentAnimation();
            } else {
                acidgame.physics.setXAcceleration(character, airAcceleration * character.directionMultiplier);
                playAnimation('airborne' + direction);
            }
        }
    }

    function playAnimation(anim) {
        character.sprite.gotoAndPlay(anim);
        previousAnimation = anim;
    }

    function playCurrentAnimation() {
        var newAnimation = currentAnimationKey + direction;
        if (newAnimation !== previousAnimation) {
            character.sprite.gotoAndPlay(newAnimation);
        }
        previousAnimation = newAnimation;
    }

    function handleJumpStop() {
        checkRunStop();
        playCurrentAnimation();
    }

    function checkRunStop() {
        var xVelocity = character.velocity[0], deceleration;
        if (!keyDown.right && !keyDown.left) {
            stopping = true;
            if (!character.isAirborne) {
                deceleration = xVelocity ? xVelocity < 0 ? groundAcceleration : -groundAcceleration : 0;
                acidgame.physics.setAcceleration(character, deceleration, 0);
            }
        }
        else {
            // TODO: handle if was holding other arrow down when you let go.
        }
    }
}(window.acidgame = window.acidgame || {}, jQuery));
(function(acidgame, $, undefined) {

  /**
   * Physics engine will handle distances in blocks and times in seconds (rather than pixels and frames)  This will allow easy adjustment later.
   */

  var pixelsPerBlock = 40, framesPerSecond = 40;

  acidgame.physics = acidgame.physics || {};

  var character, physicsObjects = [], groundHeight, canvasWidth, canvasHeight;

  acidgame.physics.init = function(characterSprite, ground, width, height, pxlsPerBlck, fps) {
    groundHeight = ground;
    canvasWidth = width;
    canvasHeight = height;
    pixelsPerBlock = pxlsPerBlck;
    framesPerSecond = fps;
    character = acidgame.physics.addRectangleObject(characterSprite, 'character', 1, 0);
    acidgame.physics.setVelocity(character, 0, 0);
    acidgame.physics.setAcceleration(character, 0, 0);
    character.directionMultiplier = 1;
  };

  acidgame.physics.setCanvasDimensions = function(width, height) {
    canvasWidth = width;
    canvasHeight = height;
  };

  acidgame.physics.addRectangleObject = function(sprite, hitboxName, x, y) {
    x = x || 0;
    y = y || 0;
    var width = ((hitboxName) ? acidgame.hitbox.getWidth(hitboxName) : sprite.width) / pixelsPerBlock;
    var height = ((hitboxName) ? acidgame.hitbox.getHeight(hitboxName) : sprite.height) / pixelsPerBlock;
    var physicsObject = {
      sprite: sprite,
      hitbox: hitboxName,
      rectangle: new createjs.Rectangle(x, y, width, height)
    };
    if (hitboxName) {
      physicsObject.node = acidgame.xSortQueue.add(physicsObject);
    }
    acidgame.physics.setSprite(physicsObject);
    return physicsObject;
  };

  acidgame.physics.run = function() {
    var current = acidgame.xSortQueue.getHead(), iter, rightX, reSortQueue = [], i;
    while (current !== null) {
      // Check ground collision
      if (current.val.isAirborne && current.val.rectangle.y < 0) {
        current.val.isAirborne = false;
        current.val.rectangle.y = 0;
        current.val.acceleration[1] = 0;
        current.val.velocity[1] = 0;
        if (current.val.onGroundCollision) {
          current.val.onGroundCollision(); // perhpas make some sort of event handler if more of these are added.
        }
      }

      // Check other collisions
      iter = current.next;
      rightX = current.val.rectangle.x + current.val.rectangle.width;
      while (iter !== null && iter.val.rectangle.x < rightX) {
        // TODO: Add in velocity vectors to prevent fast moving objects going through each other
        if (current.val.rectangle.y < iter.val.rectangle.y + iter.val.rectangle.height &&
            current.val.rectangle.y + current.val.rectangle.height > iter.val.rectangle.y) {
          // TODO: account for multiple objects colliding with the same object
          collide(current.val, iter.val);
        }
        iter = iter.next;
      }
      doPhysics(current.val, reSortQueue);
      current = current.next;
    }

    // Add back in all the nodes that moved
    for (i = 0; i < reSortQueue.length; i++) {
      acidgame.xSortQueue.reAdd(reSortQueue[i], reSortQueue[i].prev);
    }
  };

  acidgame.physics.getCharacter = function() {
    return character;
  };

  function collide(obj1, obj2) {
    // TODO
  }

  function doPhysics(physicsObject, reSortQueue) {
    if (physicsObject.velocity) {
      if (physicsObject.acceleration) {
        vec2.add(physicsObject.velocity, physicsObject.velocity, physicsObject.acceleration);
      }
      physicsObject.rectangle.x = physicsObject.rectangle.x + physicsObject.velocity[0];
      physicsObject.rectangle.y = physicsObject.rectangle.y + physicsObject.velocity[1];
      if (physicsObject.velocity[0] !== 0) {
        // TODO: prevent repeating physics on this node (queue reSorts for afterwards?)
        acidgame.xSortQueue.remove(physicsObject.node);
        reSortQueue = reSortQueue || [];
        reSortQueue.push(physicsObject.node);
      }
    }
    acidgame.physics.setSprite(physicsObject);
  }

  acidgame.physics.setVelocity = function(physicsObject, x, y) {
    physicsObject.velocity = vec2.fromValues(x / framesPerSecond, y / framesPerSecond);
  };

  acidgame.physics.setXVelocity = function(physicsObject, x) {
    physicsObject.velocity[0] = x / framesPerSecond;
  };

  acidgame.physics.setYVelocity = function(physicsObject, y) {
    physicsObject.velocity[1] = y / framesPerSecond;
  };

  acidgame.physics.setAcceleration = function(physicsObject, x, y) {
    physicsObject.acceleration = vec2.fromValues(x / framesPerSecond / framesPerSecond, y / framesPerSecond / framesPerSecond);
  };

  acidgame.physics.setXAcceleration = function(physicsObject, x) {
    physicsObject.acceleration[0] = x / framesPerSecond / framesPerSecond;
  };

  acidgame.physics.setYAcceleration = function(physicsObject, y) {
    physicsObject.acceleration[1] = y / framesPerSecond / framesPerSecond;
  };

  acidgame.physics.setAirborne = function(physicsObject, air) {
    physicsObject.isAirborne = air;
  };

  acidgame.physics.setSprite = function(physicsObject) {
    physicsObject.sprite.x = physicsObject.rectangle.x * pixelsPerBlock + ((physicsObject.directionMultiplier && physicsObject.directionMultiplier < 0) ? physicsObject.sprite.getBounds().width : 0);
    physicsObject.sprite.y = canvasHeight - groundHeight - physicsObject.rectangle.y * pixelsPerBlock - physicsObject.rectangle.height * pixelsPerBlock;

    if (physicsObject.hitbox) {
      acidgame.hitbox.adjust(physicsObject.hitbox, physicsObject.sprite);
    }
  };

}(window.acidgame = window.acidgame || {}, jQuery));

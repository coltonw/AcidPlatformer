(function(acidgame, $, undefined) {

  /**
   * Hitboxes all laid out in pixels
   */

  acidgame.hitbox = acidgame.hitbox || {};

  var hitboxes = {
    character: {
      adjust:{
        x: -20,
        y: -25
      },
      width: 85,
      height: 93
    }
  };

  acidgame.hitbox.getWidth = function(hitbox) {
    if (hitboxes[hitbox]) {
      return hitboxes[hitbox].width;
    }
    return null;
  };

  acidgame.hitbox.getHeight = function(hitbox) {
    if (hitboxes[hitbox]) {
      return hitboxes[hitbox].height;
    }
    return null;
  };

  acidgame.hitbox.adjust = function(hitbox, sprite) {
    if (hitboxes[hitbox]) {
      sprite.x = sprite.x + hitboxes[hitbox].adjust.x;
      sprite.y = sprite.y + hitboxes[hitbox].adjust.y;
    }
  };

}(window.acidgame = window.acidgame || {}, jQuery));

(function(acidgame, $, undefined) {

  acidgame.xSortQueue = acidgame.xSortQueue || {};

  var head = null;
  acidgame.xSortQueue.add = function(val, iter) {
    var next;
    if (head === null) {
      head = {
        val: val,
        next: null,
        prev: null
      };
      return head;
    }
    else {
      iter = iter || head;
      while (iter.next !== null && val.rectangle.x > iter.next.val.rectangle.x) {
        iter = iter.next;
      }
      next = iter.next;
      iter.next = {
        val: val.rectangle,
        next: next,
        prev: iter
      };
      if (next !== null) {
        next.prev = iter.next;
      }
      return iter.next;
    }
  };

  acidgame.xSortQueue.reSort = function(target) {
    var iter;
    if (target.next !== null && target.val.rectangle.x > target.next.val.rectangle.x) {
      if (target.prev === null) {
        head = target.next;
      }
      else {
        target.prev.next = target.next;
      }
      target.next.prev = target.prev;
      iter = target.next;
      while (iter.next !== null && target.val.rectangle.x > iter.next.val.rectangle.x) {
        iter = iter.next;
      }
      target.next = iter.next;
      iter.next = target;
      target.prev = iter;
      if (target.next !== null) {
        target.next.prev = target;
      }
    }
    else if (target.prev !== null && target.val.rectangle.x < target.prev.val.rectangle.x) {
      if (target.next !== null) {
        target.next.prev = target.prev;
      }
      target.prev.next = target.next;
      iter = target.prev;
      while (iter.prev !== null && iter.prev.val.rectangle.x > target.val.rectangle.x) {
        iter = iter.prev;
      }
      target.prev = iter.prev;
      iter.prev = target;
      target.next = iter;
      if (target.prev === null) {
        head = target;
      }
      else {
        target.prev.next = target;
      }
    }
  };

  acidgame.xSortQueue.remove = function(target) {
    if (target.prev === null) {
      head = target.next;
    }
    else {
      target.prev.next = target.next;
    }
    if (target.next !== null) {
      target.next.prev = target.prev;
    }
  };

  acidgame.xSortQueue.reAdd = function(target, iter) {
    if (head === null) {
      head = target;
      target.next = null;
      target.prev = null;
    }
    else {
      iter = iter || head;
      target.next = iter.next;
      target.prev = iter;
      if (target.next !== null && target.val.rectangle.x > target.next.val.rectangle.x) {
        iter = target.next;
        while (iter.next !== null && target.val.rectangle.x > iter.next.val.rectangle.x) {
          iter = iter.next;
        }
        target.next = iter.next;
        iter.next = target;
        target.prev = iter;
        if (target.next !== null) {
          target.next.prev = target;
        }
      }
      else if (target.prev !== null && target.val.rectangle.x < target.prev.val.rectangle.x) {
        iter = target.prev;
        while (iter.prev !== null && iter.prev.val.rectangle.x > target.val.rectangle.x) {
          iter = iter.prev;
        }
        target.prev = iter.prev;
        iter.prev = target;
        target.next = iter;
        if (target.prev === null) {
          head = target;
        }
        else {
          target.prev.next = target;
        }
      }
      else {
        if (target.next !== null) {
          target.next.prev = target;
        }
        if (target.prev !== null) {
          target.prev.next = target;
        }
      }
    }
  };

  acidgame.xSortQueue.getHead = function() {
    return head;
  };

}(window.acidgame = window.acidgame || {}, jQuery));

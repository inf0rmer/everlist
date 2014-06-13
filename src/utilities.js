// Utilities
var now = Date.now || function() { return new Date().getTime(); };

var debounce = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = now() - timestamp;
    if (last < wait) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };
};

var ctor = function(){};

var bind = function(func, context) {
  var args, bound, nativeBind = Function.prototype.bind, slice = Array.prototype.slice;

  if (nativeBind && func.bind === nativeBind) {
    return nativeBind.apply(func, slice.call(arguments, 1));
  }

  if (typeof func !== 'function') {
    throw new TypeError();
  }

  args = slice.call(arguments, 2);
  return bound = function() {
    if (!(this instanceof bound)) {
      return func.apply(context, args.concat(slice.call(arguments)));
    }

    ctor.prototype = func.prototype;
    var self = new ctor();
    ctor.prototype = null;
    var result = func.apply(self, args.concat(slice.call(arguments)));
    if (Object(result) === result) {
      return result;
    }
    return self;
  };
};

var isArray = Array.isArray || function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

module.exports = {
  debounce: debounce,
  bind: bind,
  isArray: isArray
};

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

// Main object
var Everlist = (function() {
  var defaults, wrapInnerContent;

  defaults = {
    padding: 0,
    interval: 350
  };

  wrapInnerContent = function($el) {
    if (!$el.find('.everlist-inner-').length) {
      $el.contents().wrapAll("<div class='everlist-inner' />");
    }
  };

  function Everlist($el, options) {
    this.$el = $($el);
    this.options = $.extend(defaults, options);
    this.initialized = true;
  }

  Everlist.prototype.startMonitoring = function() {
    var debouncedMonitor = debounce(this.monitor, this.options.timeout);
    this.$el.on('scroll.everlist', bind(this.monitor, this));
  };

  Everlist.prototype.monitor = function() {
    var elHeight, totalHeight, $inner;

    wrapInnerContent(this.$el);

    $inner = this.$el.find(".everlist-inner").first();

    elHeight = $inner.outerHeight();
    totalHeight = this.$el.height() + this.$el.scrollTop();

    if (!this.loading && totalHeight + this.options.padding >= elHeight) {
      this._load();
    }
  };

  Everlist.prototype._load = function() {};

  return Everlist;
}());

// jQuery plugin
$.fn.everlist = function(options) {
  this.each(function() {
    var $this, data;

    $this = $(this);
    data = $this.data('everlist') || {};

    // Instantiate
    if (!data.initialized) {
      $this.data('everlist', (data = new Everlist($this, options)));
    }
  });
};

module.exports = Everlist;

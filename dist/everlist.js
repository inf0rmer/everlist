!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.everlist=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var utilities = _dereq_('./utilities');

var Datasource = (function() {
  function Datasource(items, options) {
    if (items && !utilities.isArray(items)) {
      throw new Error('"items" should be an array');
    }

    this.items = (items) ? Array.prototype.slice.call(items, 0) : [];
    this.options = options || {};
  }

  Datasource.prototype.numberOfItems = function() {
    return this.items.length;
  };

  Datasource.prototype.itemAtIndex = function(index) {
    return this.items[index];
  };

  return Datasource;
}());

module.exports = Datasource;

},{"./utilities":3}],2:[function(_dereq_,module,exports){
var utilities = _dereq_('./utilities');
var Datasource = _dereq_('./datasource');

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

    if (!(this.options.datasource instanceof Datasource)) {
      this.options.datasource = new Datasource();
    }

    this.initialized = true;
  }

  Everlist.prototype.startMonitoring = function() {
    var debouncedMonitor = utilities.debounce(this.monitor, this.options.timeout);
    this.$el.on('scroll.everlist', utilities.bind(this.monitor, this));
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

  // Expose submodules
  Everlist.Datasource = Datasource;

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

},{"./datasource":1,"./utilities":3}],3:[function(_dereq_,module,exports){
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

},{}]},{},[2])
(2)
});
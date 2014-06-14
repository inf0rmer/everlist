!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.everlist=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var utilities = _dereq_('./utilities');
var Item = _dereq_('./item');

var Datasource = (function() {
  function Datasource(items, options) {
    if (items && !utilities.isArray(items)) {
      throw new Error('"items" should be an array');
    }

    this.items = [];

    if (items) {
      items.forEach(utilities.bind(this.addObject, this));
    }

    this.options = options || {};
  }

  Datasource.prototype.addObject = function(obj) {
    var item = new Item(obj);
    this.items.push(item);
  };

  Datasource.prototype.numberOfItems = function() {
    return this.items.length;
  };

  Datasource.prototype.itemAtIndex = function(index) {
    return this.items[index];
  };

  Datasource.prototype.load = function(done) {
    if (done && typeof done === 'function') {
      done();
    }
  };

  return Datasource;
}());

module.exports = Datasource;

},{"./item":3,"./utilities":5}],2:[function(_dereq_,module,exports){
var utilities = _dereq_('./utilities');
var Datasource = _dereq_('./datasource');
var Renderer = _dereq_('./renderer');

// Main object
var Everlist = (function() {
  var defaults,
    wrapInnerContent,
    getUnrenderedItems,
    markAsRendered,
    hasUnrenderedItems;

  defaults = {
    padding: 0,
    interval: 350,
    renderOnInit: false
  };

  wrapInnerContent = function($el) {
    if (!$el.find('.everlist-inner-').length) {
      $el.contents().wrapAll("<div class='everlist-inner' />");
    }
  };

  getUnrenderedItems = function(items) {
    return items.filter(function(item) {
      return (!item.rendered);
    });
  };

  markAsRendered = function(items) {
    items.forEach(function(item) {
      item.rendered = true;
    });
  };

  hasUnrenderedItems = function(items) {
    return items.some(function(item) {
      return (!item.rendered);
    });
  };

  function Everlist($el, options) {
    this.$el = $($el);
    this.options = $.extend(defaults, options);

    if (!(this.options.datasource instanceof Datasource)) {
      this.options.datasource = new Datasource();
    }

    if (!(this.options.renderer instanceof Renderer)) {
      this.options.renderer = new Renderer();
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

  Everlist.prototype._load = function() {
    if (hasUnrenderedItems(this.options.datasource.items)) {
      this.renderNeeded();
    } else {
      this.options.datasource.load(function() {});
    }
  };

  Everlist.prototype.renderNeeded = function() {
    var toRender, html;

    toRender = getUnrenderedItems(this.options.datasource.items)
                .slice(0, 10);

    markAsRendered(toRender);

    html = this.options.renderer.renderBatch(toRender.map(function(item) {
      return item.data;
    }));

    this.$el.append(html);
  };

  // Expose submodules
  Everlist.Datasource = Datasource;
  Everlist.Renderer = Renderer;

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

    if (typeof options === 'string') {
      data[options]();
    }
  });
};

module.exports = Everlist;

},{"./datasource":1,"./renderer":4,"./utilities":5}],3:[function(_dereq_,module,exports){
var Item = (function() {
  function Item(data) {
    this.rendered = false;
    this.data = data;
  }

  return Item;
}());

module.exports = Item;

},{}],4:[function(_dereq_,module,exports){
var utilities = _dereq_('./utilities');

var Renderer = (function() {

  function Renderer(template) {
    this.template = utilities.template(template || "<li><%= item %></li>");
  }

  Renderer.prototype.render = function(object) {
    return this.template({item: object});
  };

  Renderer.prototype.renderBatch = function(objects) {
    return utilities.reduce(objects, utilities.bind(function(memo, object) {
      memo += this.render(object);
      return memo;
    }, this), "");
  };

  return Renderer;
}());

module.exports = Renderer;

},{"./utilities":5}],5:[function(_dereq_,module,exports){
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

var slice = Array.prototype.slice;

var bind = function(func, context) {
  var args, bound, nativeBind = Function.prototype.bind;

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

var nativeReduce = Array.prototype.reduce;
var reduce = function( object, callback /*, initialValue*/ ) {
  if (nativeReduce) {
    return nativeReduce.apply(object, slice.call(arguments, 1));
  }

  if ( null === object || 'undefined' === typeof object ) {
    throw new TypeError(
       'reduce called on null or undefined' );
  }
  if ( 'function' !== typeof callback ) {
    throw new TypeError( callback + ' is not a function' );
  }
  var t = Object( object ), len = t.length >>> 0, k = 0, value;
  if ( arguments.length >= 2 ) {
    value = arguments[1];
  } else {
    while ( k < len && !(k in t)) {
      k++;
    }
    if ( k >= len ) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    value = t[ k++ ];
  }
  for ( ; k < len ; k++ ) {
    if ( k in t ) {
       value = callback( value, t[k], k, t );
    }
  }
  return value;
};

var template = (function() {
  var settings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
  };

  var noMatch = /.^/;

  var escapes = {
      '\\': '\\',
      "'": "'",
      'r': '\r',
      'n': '\n',
      't': '\t',
      'u2028': '\u2028',
      'u2029': '\u2029'
  };

  for (var p in escapes) {
      escapes[escapes[p]] = p;
  }

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  return function (text, data, objectName) {
      settings.variable = objectName;

      var source = "__p+='" + text
        .replace(escaper, function (match) {
          return '\\' + escapes[match];
        })
        .replace(settings.escape || noMatch, function (match, code) {
          return "'+\n_.escape(" + unescape(code) + ")+\n'";
        })
        .replace(settings.interpolate || noMatch, function (match, code) {
          return "'+\n(" + unescape(code) + ")+\n'";
        })
        .replace(settings.evaluate || noMatch, function (match, code) {
          return "';\n" + unescape(code) + "\n;__p+='";
        }) + "';\n";

      // If a variable is not specified, place data values in local scope.
      if (!settings.variable) {
        source = 'with(obj||{}){\n' + source + '}\n';
      }

      source = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + source + "return __p;\n";

      /* jshint ignore:start */
      var render = new Function(settings.variable || 'obj', source);

      if (data) {
        return render(data);
      }

      var template = function (data) {
        return render.call(this, data);
      };
      /* jshint ignore:end */

      // Provide the compiled function source as a convenience for build time
      // precompilation.
      template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

      return template;
  };

}());

module.exports = {
  debounce: debounce,
  bind: bind,
  isArray: isArray,
  template: template,
  reduce: reduce
};

},{}]},{},[2])
(2)
});
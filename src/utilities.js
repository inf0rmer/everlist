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

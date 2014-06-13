var utilities = require('./utilities');

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

var Everlist = (function() {
  function Everlist() {
    this.initialized = true;
  }

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

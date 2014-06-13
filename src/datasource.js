var utilities = require('./utilities');

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
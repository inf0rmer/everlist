var utilities = require('./utilities');
var Item = require('./item');

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

var utilities = require('./utilities');

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

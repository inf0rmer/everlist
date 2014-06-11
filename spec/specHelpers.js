jasmine.Matchers.prototype.toBeInstanceOf = function(klass) {
  return (this.actual instanceof klass);
};

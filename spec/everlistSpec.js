(function() {
  define(['everlist'], function(everlist) {

    describe('Everlist Main Module', function() {
      it('exports a function', function() {
        expect(everlist).toEqual(jasmine.any(Function));
      });
    });

  });
}());

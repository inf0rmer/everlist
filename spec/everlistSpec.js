(function() {
  define(['everlist'], function(Everlist) {

    describe('Everlist Main Module', function() {
      it('exports a function', function() {
        expect(Everlist).toEqual(jasmine.any(Function));
      });

      describe('When initializing', function() {
        it('sets its "initialized" property to true', function() {
          var everlist = new Everlist();

          expect(everlist.initialized).toBeTruthy();
        });
      });
    });

    describe('jQuery plugin', function() {
      beforeEach(function() {
        $('body').append('<div id="specimen"></div>');
      });

      afterEach(function() {
        $('#specimen').remove();
      });

      it('registers itself as a jQuery plugin', function() {
        expect($.fn.everlist).toBeDefined();
      });

      describe('When initializing', function() {
        it('stores the Everlist instance using $.data', function() {
          $('#specimen').everlist();

          expect($('#specimen').data('everlist')).toBeInstanceOf(Everlist);
        });
      });
    });
  });
}());

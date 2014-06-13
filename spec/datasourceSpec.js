(function(){
  define(['everlist'], function(Everlist) {
    var Datasource = Everlist.Datasource;

    describe('Datasource', function() {
      beforeEach(function(){
        this.ds = new Datasource();
      });

      it('Exposes an "items" array', function() {
        expect(this.ds.items).toEqual(jasmine.any(Array));
      });

      it('Exposes an "options" object', function(){
        expect(this.ds.options).toEqual(jasmine.any(Object));
      });

      describe('When initializing', function() {
        describe('#items', function() {
          it('Bootstraps the "items" array with data', function() {
            var ds = new Datasource(["one", "two", "three"]);
            expect(ds.items).toEqual(["one", "two", "three"]);
          });

          it('Only accepts Arrays when bootstrapping "items"', function() {
            var e = new Error('"items" should be an array');
            expect(function() {
              new Datasource("one");
            }).toThrow(e);
          });
        });

        describe('#options', function() {
          it('Bootstraps the "options" object', function() {
            var ds = new Datasource(null, {page: 0});
            expect(ds.options).toEqual({page: 0});
          });
        });
      });

      describe('#numberOfItems', function() {
        var stub = ["one", "two", "three"];
        beforeEach(function() {
          this.ds = new Datasource(stub);
        });

        it('returns the number of items in the datasource', function() {
          expect(this.ds.numberOfItems()).toEqual(stub.length);
        });
      });

      describe('#itemAtIndex', function() {
        var stub = ["one", "two", "three"];
        beforeEach(function() {
          this.ds = new Datasource(stub);
        });

        it('returns the item at the given index', function() {
          expect(this.ds.itemAtIndex(1)).toEqual(stub[1]);
        });
      });
    });
  });
}());

(function(){
  define(['everlist'], function(Everlist) {
    var Renderer = Everlist.Renderer;

    describe('Renderer', function() {
      beforeEach(function(){
        this.renderer = new Renderer();
      });

      it('has a default template function', function() {
        var html = this.renderer.template({item: "one"});

        expect(html).toEqual("<li>one</li>");
      });

      describe('When initializing', function() {
        it('allows setting a different template', function() {
          var renderer = new Renderer("<div><%=item%></div>");
          var html = renderer.template({item: "one"});

          expect(html).toEqual("<div>one</div>");
        });
      });

      describe('#render', function() {
        it('renders the template for a given object', function() {
          var html = this.renderer.render("one");
          expect(html).toEqual("<li>one</li>");
        });
      });

      describe('#renderBatch', function() {
        it('renders all objects in an array into a single string', function() {
          var html = this.renderer.renderBatch(["one", "two", "three"]);
          expect(html).toEqual("<li>one</li><li>two</li><li>three</li>");
        });
      });
    });
  });
}());

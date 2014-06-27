(function() {
  define(['everlist'], function(Everlist) {

    beforeEach(function() {
      $('body').append('<div id="specimen"><ul></ul></div>');
    });

    afterEach(function() {
      $('#specimen').remove();
    });

    describe('Everlist Main Module', function() {
      it('exports a function', function() {
        expect(Everlist).toEqual(jasmine.any(Function));
      });

      describe('When initializing', function() {
        it('sets its "initialized" property to true', function() {
          var everlist = new Everlist();

          expect(everlist.initialized).toBeTruthy();
        });

        it('sets the "$el" property to a jQuery object using a DOM element', function(){
          var everlist = new Everlist(document.getElementById('specimen'));
          expect(everlist.$el.attr('id')).toEqual('specimen');
        });

        it('sets the "$el" property to a jQuery object using a selector string', function(){
          var everlist = new Everlist('#specimen');
          expect(everlist.$el.attr('id')).toEqual('specimen');
        });

        it('composes its "options" property using a defaults hash and an argument', function() {
          var everlist = new Everlist('#specimen', {padding: 50});
          expect(everlist.options).toEqual({
            padding: 50,
            interval: 350,
            datasource: jasmine.any(Everlist.Datasource),
            renderer: jasmine.any(Everlist.Renderer),
            renderOnInit: false,
            renderAtMost: 10
          });
        });

        describe('When "renderOnInit" is set to "true"', function() {
          beforeEach(function() {
            this.renderSpy = spyOn(Everlist.prototype, 'renderNeeded');
            this.everlist = new Everlist('#specimen', {
              renderOnInit: true
            });
          });

          it('calls #renderNeeded after initializing', function() {
            expect(this.renderSpy).toHaveBeenCalled();
          });
        });

        describe('When the dataSource is empty', function() {
          beforeEach(function() {
            this.loadSpy = spyOn(Everlist.prototype, '_load');
            this.everlist = new Everlist('#specimen');
          });

          it('calls #_load after initializing', function() {
            expect(this.loadSpy).toHaveBeenCalled();
          });
        });
      });

      describe('#monitor', function() {
        beforeEach(function(){
          this.everlist = new Everlist('#specimen', {padding: 50});
          spyOn(this.everlist.options.datasource, 'load');
        });

        it('wraps the element in an inner container', function() {
          this.everlist.monitor();
          expect(this.everlist.$el.find('.everlist-inner').length).toEqual(1);
        });

        describe('When not loading already', function() {
          beforeEach(function() {
            this.everlist.loading = false;
            spyOn($.fn, 'outerHeight').and.returnValue(100);
            spyOn($.fn, 'height').and.returnValue(60);
            spyOn($.fn, 'scrollTop').and.returnValue(10);
          });

          it('calls #_load when the list is scrolled to the end minus its padding option', function() {
            var loadSpy = spyOn(this.everlist, '_load');

            this.everlist.monitor();
            expect(loadSpy).toHaveBeenCalled();
          });
        });

        describe('When already loading', function() {
          beforeEach(function() {
            this.everlist.loading = true;
            spyOn($.fn, 'outerHeight').and.returnValue(100);
            spyOn($.fn, 'height').and.returnValue(60);
            spyOn($.fn, 'scrollTop').and.returnValue(10);
          });

          it('does not call #_load', function() {
            var loadSpy = spyOn(this.everlist, '_load');

            this.everlist.monitor();
            expect(loadSpy).not.toHaveBeenCalled();
          });
        });
      });

      describe('#_load', function() {
        beforeEach(function(){
          this.everlist = new Everlist('#specimen', {padding: 50});
        });

        describe('When there are no items that need rendering', function() {
          beforeEach(function() {
            this.everlist.options.datasource = new Everlist.Datasource([]);
          });

          it('calls the #load method on the datasource', function() {
            var loadSpy = spyOn(this.everlist.options.datasource, 'load');

            this.everlist._load();
            expect(loadSpy).toHaveBeenCalledWith(jasmine.any(Function));
          });
        });

        describe('When there are items that need rendering', function() {
          beforeEach(function() {
            this.everlist.options.datasource = new Everlist.Datasource([1, 2, 3, 4, 5]);
          });

          it('calls the #renderNeededMethod', function() {
            var renderSpy = spyOn(this.everlist, 'renderNeeded');

            this.everlist._load();
            expect(renderSpy).toHaveBeenCalled();
          });
        });
      });

      describe('#startMonitoring', function() {
        beforeEach(function(){
          this.everlist = new Everlist('#specimen', {padding: 50});
        });

        it('calls #monitor when "$el" is scrolled', function() {
          var monitorSpy = spyOn(this.everlist, 'monitor');

          this.everlist.startMonitoring();

          $('#specimen').trigger('scroll');
          expect(monitorSpy).toHaveBeenCalled();
        });

        it('limits the number of sequential calls to #monitor', function(done) {
          var monitorSpy = spyOn(this.everlist, 'monitor');
          var self = this;

          this.everlist.startMonitoring();

          this.everlist.$el.trigger('scroll');
          this.everlist.$el.trigger('scroll');

          setTimeout(function() {
            self.everlist.$el.trigger('scroll');
            expect(monitorSpy.calls.count()).toEqual(3);
            done();
          }, this.everlist.options.timeout);
        });
      });
    });

    describe('#renderNeeded', function() {
      beforeEach(function(){
        this.everlist = new Everlist('#specimen', {
          datasource: new Everlist.Datasource([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
        });

        this.renderSpy = spyOn(this.everlist.options.renderer, 'renderBatch');
      });

      it('Gets "options.renderAtMost" unrendered items', function() {
        this.everlist.renderNeeded();
        expect(this.renderSpy.calls.argsFor(0)[0].length).toEqual(this.everlist.options.renderAtMost);
      });

      it('Unwraps the items before rendering', function() {
        this.everlist.renderNeeded();
        expect(this.renderSpy.calls.argsFor(0)[0]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      it('Marks the items about to be rendered as rendered', function() {
        var items = this.everlist.options.datasource.items.slice(0, 10);
        this.everlist.renderNeeded();

        expect(items.every(function(item) {
          return (item.rendered);
        })).toBeTruthy();
      });

      it('Triggers a jQuery event when items are rendered', function(done) {
        $(this.everlist).on('rendered', done);
        this.everlist.renderNeeded();
      });
    });

    describe('#destroy', function() {
      beforeEach(function(){
        this.everlist = new Everlist('#specimen');
      });

      it('Removes the scroll event', function() {
        var monitorSpy = spyOn(this.everlist, 'monitor');

        this.everlist.startMonitoring();

        this.everlist.destroy();

        $('#specimen').trigger('scroll');
        expect(monitorSpy).not.toHaveBeenCalled();
      });

      describe('When the list is populated', function() {
        beforeEach(function() {
          this.everlist.$el.find('.everlist-inner').append('<li></li>');
        });

        it('Unwraps the list', function() {
          this.everlist.destroy();

          expect(this.everlist.$el.find('.everlist-inner').length).toBe(0);
          expect(this.everlist.$el.children().length).toBe(1);
        });
      });

      describe('When the list is not populated', function() {
        it('Unwraps the list', function() {
          this.everlist.destroy();

          expect(this.everlist.$el.find('.everlist-inner').length).toBe(0);
        });
      });
    });

    describe('Datasource', function() {
      describe('When initializing', function() {
        it('instantiates a simple datasource if one is not provided', function() {
          var everlist = new Everlist();
          expect((everlist.options.datasource instanceof Everlist.Datasource)).toBeTruthy();
        });
      });
    });

    describe('Renderer', function() {
      describe('When initializing', function() {
        it('instantiates a simple renderer if one is not provided', function() {
          var everlist = new Everlist();
          expect((everlist.options.renderer instanceof Everlist.Renderer)).toBeTruthy();
        });
      });
    });

    describe('jQuery plugin', function() {
      it('registers itself as a jQuery plugin', function() {
        expect($.fn.everlist).toBeDefined();
      });

      describe('When initializing', function() {
        it('stores the Everlist instance using $.data', function() {
          $('#specimen').everlist();

          expect($('#specimen').data('everlist')).toBeDefined();
        });

        it('points the "$el" property to the jQuery element invoking the plugin', function(){
          $('#specimen').everlist();
          expect($('#specimen').data('everlist').$el.attr('id')).toEqual('specimen');
        });
      });

      it('executes a method in Everlist if called with a string argument', function() {
        var renderSpy = spyOn(Everlist.prototype, 'renderNeeded');

        $('#specimen').everlist('renderNeeded');
        expect(renderSpy).toHaveBeenCalled();
      });
    });
  });
}());

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
          expect(everlist.options).toEqual({padding: 50, interval: 350, datasource: jasmine.any(Everlist.Datasource)});
        });
      });

      describe('#monitor', function() {
        beforeEach(function(){
          this.everlist = new Everlist('#specimen', {padding: 50});
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

    describe('Datasource', function() {
      describe('When initializing', function() {
        it('instantiates a simple datasource if one is not provided', function() {
          var everlist = new Everlist();
          expect((everlist.options.datasource instanceof Everlist.Datasource)).toBeTruthy();
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
    });
  });
}());

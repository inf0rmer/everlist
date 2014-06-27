define([
  '../../dist/everlist',
  './itemGenerator'
], function(Everlist, itemGenerator) {

  function getRandomLimit() {
    return Math.round(Math.random() * (500 - 20) + 20);
  }

  $(function() {
    // Seed with initial data
    var offset = 0, limit = 50;

    // Configure a datasource
    var source = new Everlist.Datasource();
    source.load = function(done) {
      // Randomize limit
      limit = getRandomLimit();
      itemGenerator(offset, limit, function(err, data) {
        offset += limit;
        source.addObjects(data);
        done();
      });
    }

    // Configure a renderer
    var template = "<li class='everlist-item'><h1><%= item.name %></h1><p class='muted'><%= item.description %></p></li>";
    var renderer = new Everlist.Renderer(template);

    // Setup everlist
    $('#list').everlist({
      renderOnInit: true,
      datasource: source,
      renderer: renderer,
      renderAtMost: 50
    });

    // Statistics
    function updateStats(evt, $items) {
      var everlist = $('#list').data('everlist');
      $('[data-info="ds-total"]').text(everlist.options.datasource.items.length);

      var current = parseInt($('[data-info="dom-total"]').text(), 10) || 0;
      $('[data-info="dom-total"]').text(current + $items.length);
    }

    // Update stats on everlist's custom "rendered" event
    $($('#list').data('everlist')).on('rendered', updateStats);

    updateStats(null, $('#list .everlist-item'));
  });
});

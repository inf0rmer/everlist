define([], function(){
  function getFakeData(offset, limit, callback) {
    var data = [];
    for (var i=0; i<limit; i++) {
      var id = offset + i;
      data.push({
        id: id,
        name: "Name " + id,
        description: "Description " + id
      });
    }
    setTimeout(function() {
      callback(null, data);
    }, 250);
  };

  return getFakeData;
});

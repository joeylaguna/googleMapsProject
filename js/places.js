var map;
var service;
var infowindow;

function initialize() {
  console.log('here');
  var pyrmont = new google.maps.LatLng(38.5718873,-121.4819011);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
  });

  var request = {
    location: pyrmont,
    radius: '500',
    query: 'restaurant'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function createMarker(place) {

    new google.maps.Marker({
        position: place.geometry.location,
        map: map
    });
}

function callback(results, status) {
  console.log(results);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

initialize();
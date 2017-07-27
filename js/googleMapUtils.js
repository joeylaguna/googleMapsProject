var map;
var service;
var pyrmont = new google.maps.LatLng(38.5718873,-121.4819011);
var infoWindow = new google.maps.InfoWindow();
var markers = [];
var places = [];

const initializeMap = () => {
  //Get user location through browser
  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 12
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      map.setCenter(pos);
    });
  }
  service = new google.maps.places.PlacesService(map);
}

const callback = (results, status) => {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    document.querySelector('.loader').classList.add('none');
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(place);
    }
    sortByRating(places);
  }
  document.querySelector('.loader').classList.add('none');
  document.querySelector('.searchResults').classList.remove('none');
}

const addMarker = (place) => {
  let marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map
  });
  marker.addListener('click', () => {
    infoWindow.setContent(place.name);
    infoWindow.open(map, marker);
  });

  marker.addListener('mouseover', () => {
    let targetElement = document.querySelector(`[data='${place.id}']`);
    targetElement.classList.add('activeHover');
    targetElement.classList.add('fadeIn');
  });

  marker.addListener('mouseout', () => {
    let targetElement = document.querySelector(`[data='${place.id}']`);
    targetElement.classList.remove('activeHover');
  });
  markers.push(marker);
  places.push(place);
}

const setMapOnAll = (map) => {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

const clearMarkers = () => {
  setMapOnAll(map);
}

const deleteMarkers = () => {
  clearMarkers();
  markers = [];
  places = [];
}

const createMarker = (place) => {
  addMarker(place);
}

const handleSearch = (searchField, searchForm) => {
  deleteMarkers();
  clearTable();
  document.querySelector('.tableHead').classList.remove('none');
  document.querySelector('.searchResults').classList.add('none');
  let query = searchField.value;
  let queryObj = {};
  queryObj['location'] = map.center;
  queryObj['radius'] = '500',
  queryObj['query'] = query;
  service.textSearch(queryObj, callback);

  //Reset search field
  searchForm.reset();
}
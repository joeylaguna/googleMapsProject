var map;
var service;
var pyrmont = new google.maps.LatLng(38.5718873,-121.4819011);
var infoWindow = new google.maps.InfoWindow();

function initializeMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
  });
  service = new google.maps.places.PlacesService(map);
}


function createMarker(place) {
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
    targetElement.setAttribute('style', 'background: red;');
  });

  marker.addListener('mouseout', () => {
    let targetElement = document.querySelector(`[data='${place.id}']`);
    targetElement.removeAttribute('style');
  })
}

const buildList = (place) => {
  
  let placeName = document.createElement('p');
  let placeRating = document.createElement('p');
  let placeAddress = document.createElement('p');

  placeName.innerHTML = place.name;
  placeRating.innerHTML = place.rating;
  placeAddress.innerHTML = place.formatted_address;

  let listing = document.createElement('div');
  listing.setAttribute('data', place.id)
  listing.appendChild(placeName);
  listing.appendChild(placeAddress);
  listing.appendChild(placeRating);
  document.querySelector('.searchResults').appendChild(listing);
}

function callback(results, status) {
  //console.log(results);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(place);
      buildList(place);
    }
  }
}

const handleSearch = (searchField, searchForm) => {
  let query = searchField.value;
  let queryObj = {};
  queryObj['location'] = pyrmont;
  queryObj['radius'] = '500',
  queryObj['query'] = query;
  service.textSearch(queryObj, callback);

  //Reset search field
  searchForm.reset();
}


window.onload = () => {
  initializeMap();

  //Add event listener to input field
  let searchForm = document.querySelector('.searchArea');
  let searchField = document.querySelector('.searchField');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearch(searchField, searchForm);
  });
}
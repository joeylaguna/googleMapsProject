var map;
var service;
var pyrmont = new google.maps.LatLng(38.5718873,-121.4819011);
var infoWindow = new google.maps.InfoWindow();
var markers = [];
var places = [];
var ratingSorted = false;
var nameSorted = false;

function initializeMap() {
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

const toggleRatingIcon = (type) => {

  if (type === 'rating') {
    let icon = document.querySelector('.rating');
    ratingSorted ? icon.innerHTML = 'arrow_drop_down' : icon.innerHTML = 'arrow_drop_up';
  }

  if (type === 'name') {
    let icon = document.querySelector('.name');
    ratingSorted ? icon.innerHTML = 'arrow_drop_down' : icon.innerHTML = 'arrow_drop_up';
  }

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

function createMarker(place) {
  addMarker(place);
}

const clearTable = () => {
  let table = document.querySelector('.highlight tbody');
  while(table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

const buildList = (place) => {
  let table = document.querySelector('.highlight tbody');
  let listing = document.createElement('tr');
  let placeName = document.createElement('td');
  let placeAddress = document.createElement('td');
  let placeRating = document.createElement('td');
  let placeOpen = document.createElement('td');

  placeName.innerHTML = place.name;
  placeAddress.innerHTML = place.formatted_address;
  placeRating.innerHTML = place.rating;

  place.rating ? placeRating.innerHTML = place.rating : placeRating.innerHTML = 'N/A';

  if (place.opening_hours) {
    if (place.opening_hours.open_now) {
      placeOpen.innerHTML = 'Open'
    } else {
      placeOpen.innerHTML = 'Closed'
    }
  } else {
    placeOpen.innerHTML = 'N/A'
  }

  listing.appendChild(placeName);
  listing.appendChild(placeAddress);
  listing.appendChild(placeRating);
  listing.appendChild(placeOpen);

  listing.setAttribute('data' , place.id);

  table.appendChild(listing);
}

function callback(results, status) {
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

const sortByRating = () => {
  places = mergeSort(places, 'rating', ratingSorted);
  clearTable();
  for (let i = 0; i < places.length; i++) {
    buildList(places[i]);
  }
  document.querySelector('.tableHead').classList.remove('none');
  document.querySelector('.searchResults').classList.remove('none');
  ratingSorted = !ratingSorted;
  toggleRatingIcon('rating');
}

const sortByName = () => {
  places = mergeSort(places, 'name', ratingSorted);
  clearTable();
  for (let i = 0; i < places.length; i++) {
    buildList(places[i]);
  }
  document.querySelector('.tableHead').classList.remove('none');
  document.querySelector('.searchResults').classList.remove('none');
  ratingSorted = !ratingSorted;

  toggleRatingIcon('name');
}

window.onload = () => {
  initializeMap();

  //Add event listener to input field
  let searchForm = document.querySelector('.searchArea');
  let searchField = document.querySelector('.searchField');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('.loader').classList.remove('none');
    handleSearch(searchField, searchForm);
  });

  //Add sorting to table headers
  let headers = document.querySelectorAll('.sort');
  headers[0].addEventListener('click', sortByName);
  headers[2].addEventListener('click', sortByRating);
}
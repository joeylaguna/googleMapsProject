var map;
var service;
var pyrmont = new google.maps.LatLng(38.5718873,-121.4819011);
var infoWindow = new google.maps.InfoWindow();
var markers = [];
var places = [];
var ratingSorted = false;

function initializeMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 12
  });
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

const merge = (left, right) => {
  let results = [];

  while (left.length && right.length) {
    if (ratingSorted) {
      if (left[0].rating < right[0].rating) {
        results.push(left.shift());
      } else {
        results.push(right.shift());
      }  
    } else {
      if (left[0].rating > right[0].rating) {
        results.push(left.shift());
      } else {
        results.push(right.shift());
      }
    }
    
  }

  while (left.length) {
    results.push(left.shift());
  }

  while (right.length) {
    results.push(right.shift());
  }
  return results;
}

const mergeSort = (arr) => {
  if (arr.length < 2) {
    return arr;
  }

  let middle = parseInt(arr.length / 2);
  let left = arr.slice(0, middle);
  let right = arr.slice(middle, arr.length);

  return merge(mergeSort(left), mergeSort(right));
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

const buildUIList = () => {
  let ul = document.createElement('ul');
  ul.setAttribute('class', 'collection');
  document.querySelector('.searchResults').appendChild(ul);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    document.querySelector('.loader').classList.add('none');
    console.log('here');
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(place);
      
      buildList(place);
    }
  }
  document.querySelector('.loader').classList.add('none');
  document.querySelector('.searchResults').classList.remove('none');
}

const handleSearch = (searchField, searchForm) => {
  deleteMarkers();
  clearTable();
  let query = searchField.value;
  let queryObj = {};
  queryObj['location'] = pyrmont;
  queryObj['radius'] = '500',
  queryObj['query'] = query;
  service.textSearch(queryObj, callback);

  //Reset search field
  searchForm.reset();
}

const sortByRating = () => {
  places = mergeSort(places);
  console.log(places);
  clearTable();
  for (let i = 0; i < places.length; i++) {
    buildList(places[i]);
  }
  ratingSorted = !ratingSorted;
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
  headers[2].addEventListener('click', sortByRating);
}
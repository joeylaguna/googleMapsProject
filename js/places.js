var map;
var service;
var pyrmont = new google.maps.LatLng(38.5718873,-121.4819011);
var infoWindow = new google.maps.InfoWindow();

function initializeMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 12
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
    targetElement.classList.add('active');
    targetElement.classList.add('fadeIn');
  });

  marker.addListener('mouseout', () => {
    let targetElement = document.querySelector(`[data='${place.id}']`);
    targetElement.classList.remove('active');
  })
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
    document.querySelector('.loader').classList.remove('none');
    handleSearch(searchField, searchForm);
  });
}
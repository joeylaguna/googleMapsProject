var ratingSorted = false;
var nameSorted = false;

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
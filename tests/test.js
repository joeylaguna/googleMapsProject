var assert = chai.assert;
var expect = chai.expect;
describe('Google Maps', function() {
  describe('Google Maps Setup', function() {
    it('should create an instance of Google Map', function() {
      let newMap = new google.maps.LatLng(38.5718873,-121.4819011);
      expect(newMap).to.be.an('object');
    });
  });
});

describe('Sorting', function() {
  let unsortedPlaces = [
    {
      name: 'Apples',
      formatted_address: '321 Main St',
      rating: 3.7
    },
    {
      name: 'Oranges',
      formatted_address: '123 Main St',
      rating: 2.0
    },
    {
      name: 'Angry Orchard',
      formatted_address: '123 Main St',
      rating: 3.9
    },
    {
      name: 'Pizza',
      formatted_address: '586 1st St',
      rating: 1.2
    }
  ];
  describe('Sort by name', function() {
    it('should sort an array of places by name in ascending order', function() {
      unsortedPlaces = mergeSort(unsortedPlaces, 'name', true);
      expect(unsortedPlaces[0].name).to.equal('Angry Orchard') && expect(unsortedPlaces[1].name).to.equal('Apples') && expect(unsortedPlaces[2].name).to.equal('Oranges') && expect(unsortedPlaces[3].name).to.equal('Pizza');
    });
    it('should sort an array of places by name in descending order', function() {
      unsortedPlaces = mergeSort(unsortedPlaces, 'name', false);
      expect(unsortedPlaces[0].name).to.equal('Pizza') && expect(unsortedPlaces[1].name).to.equal('Oranges') && expect(unsortedPlaces[2].name).to.equal('Apples') && expect(unsortedPlaces[3].name).to.equal('Angry Orchard');
    });
  });

  describe('Sort by rating', function() {
    it('should sort an array of places by rating in ascending order', function() {
      unsortedPlaces = mergeSort(unsortedPlaces, 'rating', true);
      expect(unsortedPlaces[0].rating).to.equal(1.2) && expect(unsortedPlaces[1].rating).to.equal(2.0) && expect(unsortedPlaces[2].rating).to.equal(3.7) && expect(unsortedPlaces[3].rating).to.equal(3.9);
    });
    it('should sort an array of places by rating in descending order', function() {
      unsortedPlaces = mergeSort(unsortedPlaces, 'rating', false);
      expect(unsortedPlaces[0].rating).to.equal(3.9) && expect(unsortedPlaces[1].rating).to.equal(3.7) && expect(unsortedPlaces[2].rating).to.equal(2.0) && expect(unsortedPlaces[3].rating).to.equal(1.2);
    });
  });
});


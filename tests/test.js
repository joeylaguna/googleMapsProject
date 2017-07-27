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


var chai = require('chai');
var expect = chai.expect;

it('returns true', (done) => {
    expect(1).to.equal(1);
    done();
});

it('returns false', (done) => {
  expect(1).to.not.equal(2);
  done();
})
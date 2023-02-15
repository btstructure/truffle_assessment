const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app');

describe('GET /items', function() {
  it('should return a list of medical bills', function(done) {
    request(app)
      .get('/items')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});

describe('POST /items', () => {
  it('should create a new medical bill and return the new list of bills', (done) => {
    const newItem = {
      patient_name: 'Patrick Star',
      address: '456 Main St, NY, NY 12345',
      hospital: 'St. Johns Hospital',
      date: 'March 12, 2021',
      bill_amount: 2000,
    };

    request(app)
      .post('/items')
      .send(newItem)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const createdItem = res.body[res.body.length - 1];
        expect(createdItem.patient_name).to.equal(newItem.patient_name);
        expect(createdItem.address).to.equal(newItem.address);
        expect(createdItem.hospital).to.equal(newItem.hospital);
        expect(createdItem.date).to.equal(newItem.date);
        expect(createdItem.bill_amount).to.equal(newItem.bill_amount);
        done();
      });
  });

  it('should return a 400 error for an invalid bill', (done) => {
    const invalidItem = {
      patient_name: 'Patrick Star',
      address: '456 Main St, NY, NY 12345',
      hospital: 'St. Johns Hospital',
      date: 'March 12, 2021',
      bill_amount: -2000,
    };

    request(app)
      .post('/items')
      .send(invalidItem)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal('"bill_amount" must be greater than or equal to 0');
        done();
      });
  });
});
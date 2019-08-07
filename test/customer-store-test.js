const chai = require('chai');
const sinon = require('sinon').createSandbox();
const { Datastore, Query } = require('@google-cloud/datastore');
const CustomerStore = require('../src/store');
var expect = require('chai').expect;
const should = chai.should();
describe('Test Store', () => {
  before(() => {
    const customer = {
      id: 10,
      age: 35,
      name: 'sushanttest',
      country: 'sweden',
      profile: 'blahblah'
    };
    const query = new Query();
    sinon.stub(Datastore.prototype, 'createQuery').returns(query);
    sinon.stub(Query.prototype, 'limit').returns(query);
    sinon.stub(Query.prototype, 'start').returns(query);
    sinon.stub(Query.prototype, 'filter').returns(query);
    sinon.stub(Datastore.prototype, 'runQuery').callsFake((q, callback) => {
      callback(null, [customer], {});
    });
  });
  it('should return single customer based on id from db', done => {
    CustomerStore.get(10, (err, cust) => {
      should.equal(err, null);
      expect(cust)
        .to.have.property('id')
        .that.equals(10);
      expect(cust).to.have.property('id');
      expect(cust).not.to.have.property('profile');
      setImmediate(done);
    });
  });
  it('should return list of customers from db', done => {
    CustomerStore.getall([], 10, 'sometoken', (err, rows, token) => {
      should.equal(err, null);
      expect(rows).to.be.an('array');
      expect(rows)
        .to.have.property(0)
        .that.includes.all.keys(['id', 'age', 'country', 'name']);
      expect(rows)
        .to.have.property(0)
        .that.not.includes.all.keys(['profile']);
      setImmediate(done);
    });
  });
});

process.env.NODE_ENV = 'test';
var CustomerStore = require('../src/store');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon').createSandbox();
chai.use(chaiHttp);
chai.should();
let app;
describe('Test APIs', () => {
  const customer = { id: 10, name: 'sushanttest', country: 'Sweden' };
  before(() => {
    sinon.stub(CustomerStore, 'uploaddata').callsFake((data, callback) => {
      callback(null);
    });
    sinon
      .stub(CustomerStore, 'getall')
      .callsFake((data1, data2, data3, callback) => {
        if (data1.length > 0) {
          if (data1[0].field === 'country' && data1[0].value === 'Sweden') {
            callback(null, [customer], 'sometoken');
          }
          if (data1[0].field === 'country' && data1[0].value === 'Norway') {
            callback(null, [], 'sometoken');
          }
        } else {
          callback(null, [customer], 'sometoken');
        }
      });
    sinon.stub(CustomerStore, 'get').callsFake((data1, callback) => {
      if (parseInt(data1, 10) === 1) {
        callback(null, customer);
      } else if (data1 === '2') {
        callback('404', null);
      } else if (data1 === '3') {
        callback('some error', null);
      }
    });
    app = require('../src/app');
  });

  it('should return list of customers', done => {
    chai
      .request(app)
      .get('/customers')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('customers');
        res.body.should.have.property('pageToken');
        done();
      });
  });
  it('should return filtered customers', done => {
    chai
      .request(app)
      .get('/customers?country=Sweden')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('customers');
        done();
      });
  });
  it('should return empty array after filteration', done => {
    chai
      .request(app)
      .get('/customers?country=Norway')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('customers')
          .to.be.an('array')
          .that.eql([]);
        done();
      });
  });
  it('should return customer based on id', done => {
    chai
      .request(app)
      .get('/customers/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id').equal(10);
        done();
      });
  });
  it('should return 404 for non exist ids', done => {
    chai
      .request(app)
      .get('/customers/2')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it('should return 505 for other errors', done => {
    chai
      .request(app)
      .get('/customers/3')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
  it('should return 400 for non numerical ids', done => {
    chai
      .request(app)
      .get('/customers/abcd')
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});

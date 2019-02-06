const chai = require(`chai`);
const chaiHTTP = require(`chai-http`);
const should = chai.should();

const app = require(`../app`);

chai.use(chaiHTTP);

it(`Getting "/" should return a 200 status code and text/html content.`, (done) => {
  chai.request(app)
    .get(`/`)
    .end((err, result) => {
      should.not.exist(err);
      result.statusCode.should.equal(200);
      result.type.should.equal(`text/html`);
      done();
    });
});

it(`Getting "/permits/" should return object with array of results.`, (done) => {
  chai.request(app)
    .get(`/permits/`)
    .end((err, result) => {
      should.not.exist(err);
      result.statusCode.should.equal(200);
      result.type.should.equal(`application/json`);
      result.body.should.have.property(`permits`);
      result.body.permits.should.be.a(`array`);
      done();
    });
});

it(`Getting "/permits/(any non-integer string)" should return a 404.`, (done) => {
  chai.request(app)
    .get(`/permits/dva`)
    .end((err, result) => {
      should.not.exist(err);
      result.statusCode.should.equal(404);
      result.type.should.equal(`application/json`);
      result.body.should.have.property(`error`);
      result.body.error.should.be.a(`string`);
      result.body.error.should.equal(`No permit application exists with that ID.`);
    });

  chai.request(app)
    .get(`/permits/www`)
    .end((err, result) => {
      should.not.exist(err);
      result.statusCode.should.equal(404);
      result.type.should.equal(`application/json`);
      result.body.should.have.property(`error`);
      result.body.error.should.be.a(`string`);
      result.body.error.should.equal(`No permit application exists with that ID.`);
    });

  chai.request(app)
    .get(`/permits/112w`)
    .end((err, result) => {
      should.not.exist(err);
      result.statusCode.should.equal(404);
      result.type.should.equal(`application/json`);
      result.body.should.have.property(`error`);
      result.body.error.should.be.a(`string`);
      result.body.error.should.equal(`No permit application exists with that ID.`);
      done();
    });

});
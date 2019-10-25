// Import the dependencies for testing
const chai = require('chai');
// const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require('../index');


// chai.use(chaiHttp);
// chai.should();

describe("Students", () => {
  describe("GET /", () => {
    // Test to get all students record
    it("should return 404", (done) => {
      request(app)
        .get('/not-found')
        // .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });
});
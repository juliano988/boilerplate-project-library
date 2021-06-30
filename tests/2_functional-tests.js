/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let sampleId;

suite('Functional Tests', function () {

  suite('Routing tests', function () {

    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'test1' })
          .end(function (err, res) {
            sampleId = res.body._id;

            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.equal(Object.keys(res.body).length, 2, 'response object should has only 2 properties');
            assert.property(res.body, '_id', 'response should has _id property');
            assert.property(res.body, 'title', 'response should has title property');
            assert.propertyVal(res.body, 'title', 'test1', 'response title property val should be test1');
            done();
          })
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title', 'response should be a text with: missing required field title')
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/' + sampleId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.equal(Object.keys(res.body).length, 4, 'response object should has only 4 properties');
            assert.property(res.body, '_id', 'response should has _id property');
            assert.propertyVal(res.body, '_id', sampleId, 'response _id property val should be ' + sampleId);
            assert.property(res.body, 'title', 'response should has title property');
            assert.propertyVal(res.body, 'title', 'test1', 'response title property val should be test1');
            assert.property(res.body, 'comments', 'response should has title property');
            assert.isArray(res.body.comments, 'response property comments should be an array')
            assert.equal(res.body.comments.length, 0, 'response property comments length should be 0');
            assert.property(res.body, 'commentcount', 'response should has commentcount property');
            assert.equal(res.body.commentcount, 0, 'response property commentcount should be 0');
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get('/api/books/fsdfdf51sdf12sd54')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'response should be a text with: no book exists')
            done();
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post('/api/books/' + sampleId)
          .send({ comment: 'test1' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.equal(Object.keys(res.body).length, 4, 'response object should has only 4 properties');
            assert.property(res.body, '_id', 'response should has _id property');
            assert.propertyVal(res.body, '_id', sampleId, 'response _id property val should be ' + sampleId);
            assert.property(res.body, 'title', 'response should has title property');
            assert.propertyVal(res.body, 'title', 'test1', 'response title property val should be test1');
            assert.property(res.body, 'comments', 'response should has title property');
            assert.isArray(res.body.comments, 'response property comments should be an array')
            assert.equal(res.body.comments.length, 1, 'response property comments length should be 1');
            assert.equal(res.body.comments[0], 'test1', 'response property comments index 0 should be test1');
            assert.property(res.body, 'commentcount', 'response should has commentcount property');
            assert.equal(res.body.commentcount, 1, 'response property commentcount should be 1');
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post('/api/books/' + sampleId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment', 'response should be a text with: missing required field comment')
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books/gfv54d41gd65r1g56')
          .send({ comment: 'test1' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'response should be a text with: no book exists');
            done();
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete('/api/books/' + sampleId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful', 'response should be a text with: delete successful');
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/' + sampleId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'response should be a text with: no book exists');
            done();
          })
      });

    });

  });

});

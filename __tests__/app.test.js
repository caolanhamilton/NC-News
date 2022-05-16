process.env.NODE_ENV = 'test';
const seed = require("../db/seeds/seed.js")
const testData = require("../db/data/test-data/index.js")
const db = require("../db/connection.js")
const app = require("../app.js")
const request = require("supertest");
const { response } = require("../app.js");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe('GET /api/topics', () => {
    test('200: Returns array of topic objects ', () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body}) => {
        const arrayOfTopicsObjs = body.topics
        expect(arrayOfTopicsObjs).toHaveLength(3);
        expect(arrayOfTopicsObjs).toBeInstanceOf(Array)
        arrayOfTopicsObjs.forEach((topicObj) => {
            expect(topicObj).toMatchObject({
                description: expect.any(String),
                slug: expect.any(String)
            })
        })
      })
    });
    test('404: End-point not found ', () => {
      return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({body}) => {
        expect(body).toEqual({ msg: "Path not found" });
      });
    });
});

describe('GET /api/articles/:article_id', () => {
    test('200: Returns an article object', () => {
    return request(app)
    .get(`/api/articles/1`)
    .expect(200)
    .then(({body}) => {
        const articleObjWithSearchedID = body.articleObj
        expect(articleObjWithSearchedID).toBeInstanceOf(Object)
        expect(articleObjWithSearchedID).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            votes: expect.any(Number)
        })
      })
    });
    test('404: Resource does not exist with that ID', () => {
      return request(app)
      .get("/api/articles/99999999")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Resource not found with this ID")
      });
    });
    test('400: Bad request, invalid ID type ', () => {
        return request(app)
        .get("/api/articles/notanid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid data type");
        });
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('200: Returns updated article, with vote incremented by positive integer', () => {
        const voteUpdateObj = { inc_votes : 7 }
        return request(app)
        .patch('/api/articles/1')
        .send(voteUpdateObj)
        .expect(200)
        .then(({ body }) => {
          expect(body.articleWithUpdatedVotes).toBeInstanceOf(Object)
          expect(body.articleWithUpdatedVotes).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 107
          })
        })
    });
    test('200: Returns updated article, with vote decremented by negative integer', () => {
      const voteUpdateObj = { inc_votes : -10 }
      return request(app)
      .patch('/api/articles/2')
      .send(voteUpdateObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.articleWithUpdatedVotes).toBeInstanceOf(Object)
        expect(body.articleWithUpdatedVotes).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: -10
        })
      })
  });
  test('400 Bad request: if request is missing required body or is malformed', () => {
    const voteUpdateObj = {}
    return request(app)
      .patch('/api/articles/2')
      .send(voteUpdateObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required values in body");
      });
  });
  test('400 Bad request: if request body objects vote value is of wrong type', () => {
    const voteUpdateObj = { inc_votes : "not a number" }
    return request(app)
      .patch('/api/articles/2')
      .send(voteUpdateObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type");
      });
  });
});
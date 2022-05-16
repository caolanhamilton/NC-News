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
          expect(body.msg).toBe("Invalid ID type");
        });
    });
});


const seed = require("../db/seeds/seed.js")
const testData = require("../db/data/test-data/index.js")
const db = require("../db/connection.js")
const app = require("../app.js")
const request = require("supertest")

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
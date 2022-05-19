process.env.NODE_ENV = 'test';
const seed = require("../db/seeds/seed.js")
const testData = require("../db/data/test-data/index.js")
const db = require("../db/connection.js")
const app = require("../app.js")
const request = require("supertest");
const sorted = require("jest-sorted");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe('GET /api/topics', () => {
    test('200: Returns array of topic objects', () => {
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
            article_id: 1,
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            votes: 100
        })
      })
    });
    test('200: Returns comment count for article as property of object', () => {
      return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({body}) => {
          const articleObjWithSearchedID = body.articleObj
          expect(articleObjWithSearchedID.comment_count).toEqual(11)
        })
      });
    test('200: Returns 0 for comment_count property if article ID is valid and exists but there are not comments for that article', () => {
      return request(app)
      .get(`/api/articles/2`)
      .expect(200)
      .then(({body}) => {
        const articleObjWithSearchedID = body.articleObj
        expect(articleObjWithSearchedID.comment_count).toEqual(0)
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
    test('400: Bad request, invalid ID type', () => {
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
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
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
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
          created_at: '2020-10-16T05:03:00.000Z',
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

describe('GET /api/users', () => {
  test('200: Returns an array of username objects ', () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body}) => {
        const arrayOfUsernames = body.usernames
        expect(arrayOfUsernames).toHaveLength(4);
        expect(arrayOfUsernames).toBeInstanceOf(Array)
        arrayOfUsernames.forEach((username) => {
            expect(username).toMatchObject({
                username: expect.any(String),
            })
        })
      })
  });
});

describe('GET /api/articles', () => {
  test('200: Returns array of article objects defaulting to be sorted by date', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body}) => {
      const arrayOfArticleObjects = body.articles
      expect(arrayOfArticleObjects).toHaveLength(12)
      expect(arrayOfArticleObjects).toBeInstanceOf(Array)
      expect(arrayOfArticleObjects).toBeSortedBy("created_at", { descending: true })
      arrayOfArticleObjects.forEach(article => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number)
        })
      })
    })
  });
  test('200: Returns article sorted by any valid column in either ascending', () => {
    return request(app)
    .get('/api/articles/?sort_by=votes&order=asc')
    .expect(200)
    .then(({body}) => {
      const arrayOfArticleObjects = body.articles
      expect(arrayOfArticleObjects).toHaveLength(12)
      expect(arrayOfArticleObjects).toBeInstanceOf(Array)
      expect(arrayOfArticleObjects).toBeSortedBy("votes", { descending: false })
      arrayOfArticleObjects.forEach(article => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number)
        })
      })
    })
  });
  test('200: Returns article sorted by any valid column in either descending', () => {
    return request(app)
    .get('/api/articles/?sort_by=votes&order=asc')
    .expect(200)
    .then(({body}) => {
      const arrayOfArticleObjects = body.articles
      expect(arrayOfArticleObjects).toHaveLength(12)
      expect(arrayOfArticleObjects).toBeInstanceOf(Array)
      expect(arrayOfArticleObjects).toBeSortedBy("votes", { descending: false })
      arrayOfArticleObjects.forEach(article => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number)
        })
      })
    })
  });
  test('200: Returns articles only with queried topic', () => {
    return request(app)
    .get('/api/articles/?topic=mitch')
    .expect(200)
    .then(({body}) => {
      const arrayOfArticleObjects = body.articles
      expect(arrayOfArticleObjects).toHaveLength(11)
      expect(arrayOfArticleObjects).toBeInstanceOf(Array)
      expect(arrayOfArticleObjects).toBeSortedBy("created_at", { descending: true })
      arrayOfArticleObjects.forEach(article => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: 'mitch',
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test('200: Returns empty array when there are no articles for a valid topic', () => {
    return request(app)
    .get('/api/articles/?topic=paper')
    .expect(200)
    .then(({body}) => {
      const arrayOfArticleObjects = body.articles
      expect(arrayOfArticleObjects).toHaveLength(0)
      expect(arrayOfArticleObjects).toBeInstanceOf(Array)
      expect(arrayOfArticleObjects).toEqual([])
    })
  });
  test('400: Return bad request when passed an order value thats not asc or desc', () => {
    return request(app)
    .get('/api/articles/?order=cat')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toEqual('Invalid order query')
    })
  })
  test('400: Return bad request when passed a sort query that is not a valid column', () => {
    return request(app)
    .get('/api/articles/?sort_by=catsarecool')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toEqual('Invalid sort by query')
    })
  }) 
  test('404: Return topic not found when passed a valid topic but topic does not exists in topics table', () => {
    return request(app)
    .get('/api/articles/?topic=mathsisfun')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toEqual('No article with topic found')
    })
  })
  test('400: Return bad request when passed a topic filter query that is not a valid type', () => {
    return request(app)
    .get('/api/articles/?topic=1')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toEqual('Invalid topic query')
    })
  })
});

describe('GET /api/articles/:article_id/comments', () => {
  test('200: Returns array of comment objects', () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body}) => {
      const commentsArray = body.comments
      expect(commentsArray).toHaveLength(11)
      expect(commentsArray).toBeInstanceOf(Array)
      commentsArray.forEach(comment => {
          expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String)
        })
      })
    })
  });

  test('200: Returns empty array when article exists with given ID but has no comments', () => {
    return request(app)
    .get("/api/articles/2/comments")
    .then(({body}) => {
      const commentsArray = body.comments
      expect(commentsArray).toEqual([])
    })
  })
  test('404: Resource does not exist with that ID', () => {
    return request(app)
      .get("/api/articles/99999999/comments")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Resource not found with this ID")
      });
  });
  test('400: Bad request, invalid ID type', () => {
    return request(app)
        .get("/api/articles/notanid/comments")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Invalid data type");
        });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('201: Created new comment successfully', () => {

    const commentToSend = {
      username: "icellusedkars",
      body: "test comment body"
    }

    return request(app)
      .post("/api/articles/2/comments")
      .send(commentToSend)
      .expect(201)
      .then((response) => {
        const createdComment = response.body.newComment

        expect(createdComment).toBeInstanceOf(Object)
        expect(createdComment).toEqual({
          article_id: 2,
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "icellusedkars",
          body: "test comment body"
        })
    })
  });
  test('400: Bad request empty or malformed body', () => {
    const commentToSend = {
      body: "sample body"
    }

    return request(app)
      .post("/api/articles/3/comments")
      .send(commentToSend)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request")
      });
  });
  test('400 Bad request incorrect body value type', () => {
    const commentToSend = {
      username: 0,
      body: 7
    }

    return request(app)
      .post("/api/articles/3/comments")
      .send(commentToSend)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request")
      });
  });
  test('400: Bad request incorrect username value in body', () => {
    const commentToSend = {
      username: "caolan",
      body: "sample body"
    }

    return request(app)
      .post("/api/articles/3/comments")
      .send(commentToSend)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request")
      });
  });
  test('400 Bad request incorrect body value type', () => {
    const commentToSend = {
      username: 0,
      body: 7
    }

    return request(app)
      .post("/api/articles/3/comments")
      .send(commentToSend)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request")
      });
  });
  test('404 Resource not found with that ID', () => {
    const commentToSend = {
      username: "icellusedkars",
      body: "test comment body"
    }

    return request(app)
      .post("/api/articles/99999999/comments")
      .send(commentToSend)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Resource not found with this ID")
      });
  })
  test('400: Bad request, invalid ID type', () => {
    const commentToSend = {
      username: "icellusedkars",
      body: "test comment body"
    }

    return request(app)
      .post("/api/articles/notanid/comments")
      .send(commentToSend)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Invalid data type")
      });
  })

});
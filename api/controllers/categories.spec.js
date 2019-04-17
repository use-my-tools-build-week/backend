const request = require('supertest');
const knexCleaner = require('knex-cleaner');

const db = require('../../config/db_config');
const server = require('../server');

beforeEach(() => knexCleaner.clean(db));

describe('categoriesController', () => {
  const setup = async () => {
    const validUser = {
      username: 'test_user',
      password: 'test_password',
      email: 'testemail@testemail.ai'
    };

    const { body: createdUser } = await request(server)
      .post('/api/register')
      .send(validUser);

    const validCategory = {
      name: 'test_name',
      user_id: createdUser.id
    };

    return { user: createdUser, validCategory };
  };

  describe('POST /api/categories', () => {
    it('should respond with 401 if not logged in', async () => {
      const { validCategory } = await setup();
      const { status } = await request(server)
        .post('/api/categories')
        .send({ ...validCategory, categoryname: 'Something Else' });

      expect(status).toBe(401);
    });

    it('should respond with 201 and category on valid input', async () => {
      const {
        validCategory,
        user: { token }
      } = await setup();

      const { body: createdCategory, status } = await request(server)
        .post('/api/categories')
        .set('Authorization', token)
        .send(validCategory);

      expect(status).toBe(201);
      expect(createdCategory).toEqual(expect.objectContaining(validCategory));
    });

    it('should respond with 422 on invalid input', async () => {
      const {
        user: { token }
      } = await setup();

      const response = await request(server)
        .post('/api/categories')
        .set('Authorization', token)
        .send({ invalid: 'input' });

      expect(response.status).toBe(422);
    });

    it('should respond with 422 if username or email not unique', async () => {
      const {
        user: { token },
        validCategory
      } = await setup();

      await request(server)
        .post('/api/categories')
        .set('Authorization', token)
        .send(validCategory);

      const response = await request(server)
        .post('/api/categories')
        .set('Authorization', token)
        .send(validCategory);

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should respond with 200 and category when category found', async () => {
      const {
        user: { token },
        validCategory
      } = await setup();

      const { body: createdCategory } = await request(server)
        .post('/api/categories')
        .set('Authorization', token)
        .send(validCategory);

      const { body, status } = await request(server)
        .get(`/api/categories/${createdCategory.id}`)
        .set('Authorization', token);

      expect(status).toBe(200);
      expect(createdCategory).toEqual(body);
    });

    it('should respond with 422 when no category found', async () => {
      const {
        user: { token }
      } = await setup();

      const { status } = await request(server)
        .get('/api/categories/anIDthatdoesntExist')
        .set('Authorization', token);

      expect(status).toBe(422);
    });

    it('should limit and paginate results, sorting by distance', async () => {
      const {
        user: { token, ...user },
        validCategory
      } = await setup();

      const { body: createdCategory } = await request(server)
        .post('/api/categories')
        .set('Authorization', token)
        .send(validCategory);

      const validTool = {
        name: 'test_name',
        user_id: user.id,
        category_id: createdCategory.id
      };

      const createdTools = [];
      for (let i = 0; i < 4; i++) {
        const res = await request(server)
          .post('/api/tools')
          .set('Authorization', token)
          .send({...validTool, name: `tool${i}`});

        createdTools.push(res.body);
      }
      createdTools.sort((a, b) => a.distance - b.distance);


      const { body: category } = await request(server)
        .get(`/api/categories/${createdCategory.id}?limit=2&page=2`)
        .set('Authorization', token);

      expect(category.tools.results).toHaveLength(2);

      expect(category.tools.results).toEqual([
        createdTools[2],
        createdTools[3]
      ]);
    });
  });

  describe('GET /api/categories', () => {
    it('should respond with status 200 and empty array if no results', async () => {
      const {
        user: { token }
      } = await setup();

      const { status, body: categories } = await request(server)
        .get('/api/categories')
        .set('Authorization', token);

      expect(status).toBe(200);
      expect(categories).toEqual([]);
    });

    it('should limit results by name if given a search parameter', async () => {
      const {
        user: { token },
        validCategory
      } = await setup();

      await request(server)
        .post('/api/categories')
        .set('Authorization', token)
        .send(validCategory);

      const {
        body: { tools: omit, ...targetCategory }
      } = await request(server)
        .post('/api/categories')
        .set('Authorization', token)
        .send({ ...validCategory, name: 'other_name' });

      const { body: categories } = await request(server)
        .get(`/api/categories?search=other_name`)
        .set('Authorization', token);

      expect(categories).toEqual([targetCategory]);
    });
  });
});

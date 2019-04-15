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

  describe('GET /api/categories', () => {
    it('should respond with status 200 and empty array if no results', async () => {
      const { status, body: categories } = await request(server).get(
        '/api/categories'
      );

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

      const { body: targetCategory } = await request(server)
        .post('/api/categories')
        .set('Authorization', token)
        .send({ ...validCategory, name: 'other_name' });

      const { body: categories } = await request(server).get(
        `/api/categories?search=other_name`
      );

      expect(categories).toEqual([targetCategory]);
    });
  });
});

const request = require('supertest');
const knexCleaner = require('knex-cleaner');

const db = require('../../config/db_config');
const server = require('../server');

beforeEach(() => knexCleaner.clean(db));

describe('conditionsController', () => {
  const setup = async () => {
    const validUser = {
      username: 'test_user',
      password: 'test_password',
      email: 'testemail@testemail.ai'
    };

    const { body: createdUser } = await request(server)
      .post('/api/register')
      .send(validUser);

    const validCondition = {
      name: 'test_name',
      user_id: createdUser.id
    };

    return { user: createdUser, validCondition };
  };

  describe('POST /api/conditions', () => {
    it('should respond with 401 if not logged in', async () => {
      const { validCondition } = await setup();
      const { status } = await request(server)
        .post('/api/conditions')
        .send({ ...validCondition, conditionname: 'Something Else' });

      expect(status).toBe(401);
    });

    it('should respond with 201 and condition on valid input', async () => {
      const {
        validCondition,
        user: { token }
      } = await setup();

      const { body: createdCondition, status } = await request(server)
        .post('/api/conditions')
        .set('Authorization', token)
        .send(validCondition);

      expect(status).toBe(201);
      expect(createdCondition).toEqual(expect.objectContaining(validCondition));
    });

    it('should respond with 422 on invalid input', async () => {
      const {
        user: { token }
      } = await setup();

      const response = await request(server)
        .post('/api/conditions')
        .set('Authorization', token)
        .send({ invalid: 'input' });

      expect(response.status).toBe(422);
    });

    it('should respond with 422 if username or email not unique', async () => {
      const {
        user: { token },
        validCondition
      } = await setup();

      await request(server)
        .post('/api/conditions')
        .set('Authorization', token)
        .send(validCondition);

      const response = await request(server)
        .post('/api/conditions')
        .set('Authorization', token)
        .send(validCondition);

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/conditions', () => {
    it('should respond with status 200 and empty array if no results', async () => {
      const { status, body: conditions } = await request(server).get(
        '/api/conditions'
      );

      expect(status).toBe(200);
      expect(conditions).toEqual([]);
    });

    it('should limit results by name if given a search parameter', async () => {
      const {
        user: { token },
        validCondition
      } = await setup();

      await request(server)
        .post('/api/conditions')
        .set('Authorization', token)
        .send(validCondition);

      const { body: targetCondition } = await request(server)
        .post('/api/conditions')
        .set('Authorization', token)
        .send({ ...validCondition, name: 'other_name' });

      const { body: conditions } = await request(server).get(
        `/api/conditions?search=other_name`
      );

      expect(conditions).toEqual([targetCondition]);
    });
  });
});


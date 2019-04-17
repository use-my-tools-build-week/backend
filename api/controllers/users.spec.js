const request = require('supertest');
const knexCleaner = require('knex-cleaner');

const db = require('../../config/db_config');
const server = require('../server');

beforeEach(() => knexCleaner.clean(db));

describe('usersController', () => {
  const validUser = {
    username: 'test_user',
    password: 'test_password',
    email: 'test_email@testemail.ai'
  };

  describe('GET /api/users', () => {
    it('should respond with 200 and array even when no results', async () => {
      const { body, status } = await request(server).get('/api/users');

      expect(status).toBe(200);
      expect(body.results).toEqual([]);
    });

    it('should limit and paginate results', async () => {
      const createdUsers = [];

      for (let i = 0; i < 4; i++) {
        const res = await request(server)
          .post('/api/register')
          .send({
            ...validUser,
            username: `test_user${i}`,
            email: `test_user${i}@email.com`
          });

        createdUsers.push(res.body);
      }

      expect(createdUsers).toHaveLength(4);

      const { body: users } = await request(server).get(
        `/api/users?limit=2&page=2`
      );

      expect(users.results.map(u => u.id)).toEqual([
        createdUsers[2].id,
        createdUsers[3].id
      ]);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should respond with 200 and user when user found', async () => {
      const {
        status: createStatus,
        body: { token, ...createdUser }
      } = await request(server)
        .post('/api/register')
        .send(validUser);

      expect(createStatus).toBe(201);

      const { body, status } = await request(server).get(
        `/api/users/${createdUser.id}`
      );

      expect(status).toBe(200);
      expect(createdUser).toEqual(body);
    });

    it('should respond with 422 when no user found', async () => {
      const { status } = await request(server).get(
        '/api/users/anIDthatdoesntExist'
      );

      expect(status).toBe(422);
    });
  });

  describe('PUT /api/users/:id', () => {
    beforeEach(() =>
      request(server)
        .post('/api/register')
        .send(validUser)
    );

    const login = async () =>
      await request(server)
        .post('/api/login')
        .send(validUser);

    it('should respond with 401 if not logged in', async () => {
      const { status } = await request(server)
        .put('/api/users/anIDthatdoesntExist')
        .send({ ...validUser, username: 'Something Else' });

      expect(status).toBe(401);
    });

    it('should update user on valid input', async () => {
      const {
        body: { token }
      } = await login();

      const {
        body: {
          results: [knownUser]
        }
      } = await request(server).get('/api/users');

      const { body: updatedUser, status } = await request(server)
        .put(`/api/users/${knownUser.id}`)
        .set('Authorization', token)
        .send({ ...validUser, username: 'Something Else' });

      expect(status).toBe(200);
      expect(updatedUser.username).toBe('Something Else');
    });

    it('should respond with 422 when id does not match current user id', async () => {
      const {
        body: { token }
      } = await login();

      expect(token).toBeDefined();

      const {
        body: { id: notCurrentUserId }
      } = await request(server)
        .post('/api/register')
        .send(validUser);

      const { status } = await request(server)
        .put(`/api/users/${notCurrentUserId}`)
        .set('Authorization', token)
        .send({ username: 'Something Else' });

      expect(status).toBe(422);
    });
  });
});

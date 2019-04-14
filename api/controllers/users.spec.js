const request = require('supertest');
const knexCleaner = require('knex-cleaner');

const db = require('../../config/db_config');
const server = require('../server');

beforeEach(() => knexCleaner.clean(db));

describe('usersController', () => {
  const validUser = {
    username: 'test_user',
    password: 'test_password',
    email: 'test_email@test_email.ai'
  };

  describe('GET /api/users', () => {
    it('should respond with 200 and array even when no results', async () => {
      const { body, status } = await request(server).get('/api/users');

      expect(status).toBe(200);
      expect(body).toEqual([]);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should respond with 200 and user when user found', async () => {
      const {
        body: { token, ...createdUser }
      } = await request(server)
        .post('/api/register')
        .send(validUser);

      const { body, status } = await request(server).get(
        `/api/users/${createdUser.id}`
      );

      expect(status).toBe(200);
      expect(createdUser).toEqual(body);
    });

    it('should respond with 404 when no user found', async () => {
      const { status } = await request(server).get(
        '/api/users/anIDthatdoesntExist'
      );

      expect(status).toBe(404);
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
        body: [knownUser]
      } = await request(server).get('/api/users');

      const { body: updatedUser, status } = await request(server)
        .put(`/api/users/${knownUser.id}`)
        .set('Authorization', token)
        .send({ ...validUser, username: 'Something Else' });

      expect(status).toBe(200);
      expect(updatedUser.username).toBe('Something Else');
    });

    it('should respond with 401 when id does not match current user id', async () => {
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

      expect(status).toBe(401);
    });
  });
});

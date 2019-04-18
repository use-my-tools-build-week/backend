const request = require('supertest');
const knexCleaner = require('knex-cleaner');
const db = require('../../config/db_config');

const server = require('../server');

beforeEach(() => knexCleaner.clean(db));

describe('favoritesController', () => {
  const setup = async () => {
    const { body: user } = await request(server)
      .post('/api/register')
      .send({
        username: 'test_user',
        password: 'test_password',
        email: 'test_email@testemail.ai'
      });

    const { body: loaner } = await request(server)
      .post('/api/register')
      .send({
        username: 'tool_owner',
        password: 'test_password',
        email: 'tool_owner@testemail.ai'
      });

    const { body: tool } = await request(server)
      .post('/api/tools')
      .set('Authorization', loaner.token)
      .send({
        name: 'test_tool',
        user_id: loaner.id
      });

    const validFavorite = {
      user_id: user.id,
      tool_id: tool.id
    };

    return { loaner, user, tool, validFavorite };
  };

  describe('POST /api/favorites', () => {
    it('should respond with 401 if not logged in', async () => {
      const { validFavorite } = await setup();
      const { status } = await request(server)
        .post('/api/favorites')
        .send({ validFavorite });

      expect(status).toBe(401);
    });

    it('should respond with 201 and user favorites on valid input', async () => {
      const {
        validFavorite,
        user: { token }
      } = await setup();

      const { body: userFavorites, status } = await request(server)
        .post('/api/favorites')
        .set('Authorization', token)
        .send(validFavorite);

      expect(status).toBe(201);
      expect(Array.isArray(userFavorites)).toBe(true);
    });

    it('should respond with 422 on invalid input', async () => {
      const {
        user: { token }
      } = await setup();

      const response = await request(server)
        .post('/api/favorites')
        .set('Authorization', token)
        .send({ invalid: 'input' });

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/favorites', () => {
    it('should respond with status 200 and array', async () => {
      const {
        user: { token }
      } = await setup();

      const { status, body: favorites } = await request(server)
        .get('/api/favorites')
        .set('Authorization', token);

      expect(status).toBe(200);
      expect(favorites).toEqual([]);
    });
  });

  describe('DELETE /api/favorites/:id', () => {
    it('should respond with 404 when user_id does not match current user id', async () => {
      const {
        user: { token },
        validFavorite
      } = await setup();

      const {
        body: [createdFavorite]
      } = await request(server)
        .post('/api/favorites')
        .set('Authorization', token)
        .send(validFavorite);

      const unauthorizedCreds = {
        username: 'test_user3',
        password: 'test_password',
        email: 'test_email3@testemail.ai'
      };

      const {
        body: { token: unauthorizedToken }
      } = await request(server)
        .post('/api/register')
        .send(unauthorizedCreds);

      const response = await request(server)
        .delete(`/api/favorites/${createdFavorite.id}`)
        .set('Authorization', unauthorizedToken);

      expect(response.status).toBe(404);
    });

    it('should respond with 200 and deleted favorite on success', async () => {
      const {
        user: { token },
        validFavorite
      } = await setup();

      const {
        body: [createdFavorite]
      } = await request(server)
        .post('/api/favorites')
        .set('Authorization', token)
        .send(validFavorite);

      const { status, body: deletedFavorite } = await request(server)
        .delete(`/api/favorites/${createdFavorite.id}`)
        .set('Authorization', token);

      expect(status).toBe(200);
      expect(createdFavorite).toEqual(expect.objectContaining(deletedFavorite));
    });
  });
});

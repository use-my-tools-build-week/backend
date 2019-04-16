const request = require('supertest');
const knexCleaner = require('knex-cleaner');
const db = require('../../config/db_config');

const server = require('../server');

beforeEach(() => knexCleaner.clean(db));

describe('reviewsController', () => {
  const setup = async () => {
    const validUser = {
      username: 'test_user',
      password: 'test_password',
      email: 'test_email@testemail.ai'
    };

    const { body: createdUser } = await request(server)
      .post('/api/register')
      .send(validUser);

    const { body: createdCategory } = await request(server)
      .post('/api/categories')
      .set('Authorization', createdUser.token)
      .send({
        name: 'test_name',
        user_id: createdUser.id
      });

    const { body: createdTool } = await request(server)
      .post('/api/tools')
      .set('Authorization', createdUser.token)
      .send({
        name: 'test_name',
        user_id: createdUser.id,
        category_id: createdCategory.id
      });

    const validReview = {
      message: 'Hey this is a message',
      score: 5,
      user_id: createdUser.id,
      tool_id: createdTool.id
    };

    return { user: createdUser, tool: createdTool, validReview };
  };

  describe('POST /api/reviews', () => {
    it('should respond with 401 if not logged in', async () => {
      const { validReview } = await setup();
      const { status } = await request(server)
        .post('/api/reviews')
        .send(validReview);

      expect(status).toBe(401);
    });

    it('should respond with 201 and review on valid input', async () => {
      const {
        validReview,
        user: { token }
      } = await setup();

      const { body: createdReview, status } = await request(server)
        .post('/api/reviews')
        .set('Authorization', token)
        .send(validReview);

      expect(status).toBe(201);
      expect(createdReview).toEqual(expect.objectContaining(validReview));
    });

    it('should respond with 422 on invalid input', async () => {
      const {
        user: { token }
      } = await setup();

      const response = await request(server)
        .post('/api/reviews')
        .set('Authorization', token)
        .send({ invalid: 'input' });

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/reviews/:id', () => {
    it('should respond with 200 and review when review found', async () => {
      const {
        user: { token },
        validReview
      } = await setup();

      const { body: createdReview } = await request(server)
        .post('/api/reviews')
        .set('Authorization', token)
        .send(validReview);

      const { body, status } = await request(server).get(
        `/api/reviews/${createdReview.id}`
      );

      expect(status).toBe(200);
      expect(createdReview).toEqual(body);
    });

    it('should respond with 422 when no review found', async () => {
      const { status } = await request(server).get(
        '/api/reviews/anIDthatdoesntExist'
      );

      expect(status).toBe(422);
    });
  });

  describe('PUT /api/reviews/:id', () => {
    it('should respond with 401 if not logged in', async () => {
      const { status } = await request(server)
        .put('/api/reviews/anIDthatdoesntExist')
        .send({ message: "Won't Get Here" });

      expect(status).toBe(401);
    });

    it('should update review on valid input', async () => {
      const {
        user: { token },
        validReview
      } = await setup();

      const { body: createdReview } = await request(server)
        .post('/api/reviews')
        .set('Authorization', token)
        .send(validReview);

      const { body: updatedReview, status } = await request(server)
        .put(`/api/reviews/${createdReview.id}`)
        .set('Authorization', token)
        .send({ ...validReview, message: 'Something Else' });

      expect(status).toBe(200);
      expect(updatedReview.message).toBe('Something Else');
    });

    it('should respond with 401 when user_id does not match current user id', async () => {
      const {
        user: { token },
        validReview
      } = await setup();

      const { body: createdReview } = await request(server)
        .post('/api/reviews')
        .set('Authorization', token)
        .send(validReview);

      const unauthorizedCreds = {
        username: 'test_user2',
        password: 'test_password',
        email: 'test_email2@testemail.ai'
      };

      const {
        body: { token: unauthorizedToken }
      } = await request(server)
        .post('/api/register')
        .send(unauthorizedCreds);

      const { status } = await request(server)
        .put(`/api/reviews/${createdReview.id}`)
        .set('Authorization', unauthorizedToken)
        .send({ message: 'Something Else' });

      expect(status).toBe(422);
    });
  });

  describe('DELETE /api/reviews/:id', () => {
    it('should respond with 401 when user_id does not match current user id', async () => {
      const {
        user: { token },
        validReview
      } = await setup();

      const { body: createdReview } = await request(server)
        .post('/api/reviews')
        .set('Authorization', token)
        .send(validReview);

      const unauthorizedCreds = {
        username: 'test_user2',
        password: 'test_password',
        email: 'test_email2@testemail.ai'
      };

      const {
        body: { token: unauthorizedToken }
      } = await request(server)
        .post('/api/register')
        .send(unauthorizedCreds);

      const { status } = await request(server)
        .delete(`/api/reviews/${createdReview.id}`)
        .set('Authorization', unauthorizedToken);

      expect(status).toBe(401);
    });

    it('should respond with 200 and deleted review on success', async () => {
      const {
        user: { token },
        validReview
      } = await setup();

      const { body: createdReview } = await request(server)
        .post('/api/reviews')
        .set('Authorization', token)
        .send(validReview);

      const { status, body: deletedReview } = await request(server)
        .delete(`/api/reviews/${createdReview.id}`)
        .set('Authorization', token);

      expect(status).toBe(200);
      expect(createdReview).toEqual(deletedReview);
    });
  });
});

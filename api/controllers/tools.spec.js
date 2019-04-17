const request = require('supertest');
const knexCleaner = require('knex-cleaner');
const db = require('../../config/db_config');

const server = require('../server');

beforeEach(() => knexCleaner.clean(db));

describe('toolsController', () => {
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

    const validTool = {
      name: 'test_name',
      user_id: createdUser.id,
      category_id: createdCategory.id
    };

    return { user: createdUser, category: createdCategory, validTool };
  };

  describe('POST /api/tools', () => {
    it('should respond with 401 if not logged in', async () => {
      const { validTool } = await setup();
      const { status } = await request(server)
        .post('/api/tools')
        .send({ ...validTool, name: 'Something Else' });

      expect(status).toBe(401);
    });

    it('should respond with 201 and tool on valid input', async () => {
      const {
        validTool,
        user: { token }
      } = await setup();

      const { body: createdTool, status } = await request(server)
        .post('/api/tools')
        .set('Authorization', token)
        .send(validTool);

      expect(status).toBe(201);
      expect(createdTool).toEqual(expect.objectContaining(validTool));
    });

    it('should respond with 422 on invalid input', async () => {
      const {
        user: { token }
      } = await setup();

      const response = await request(server)
        .post('/api/tools')
        .set('Authorization', token)
        .send({ invalid: 'input' });

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/tools', () => {
    it('should respond with status 200 and empty array if no results', async () => {
      const { status, body: tools } = await request(server).get('/api/tools');

      expect(status).toBe(200);
      expect(tools.results).toEqual([]);
    });

    it('should limit results by name if given a search parameter', async () => {
      const {
        user: { token },
        validTool
      } = await setup();

      await request(server)
        .post('/api/tools')
        .set('Authorization', token)
        .send(validTool);

      const { body: targetTool } = await request(server)
        .post('/api/tools')
        .set('Authorization', token)
        .send({ ...validTool, name: 'other_name' });

      const { body: tools } = await request(server).get(
        `/api/tools?search=other_name`
      );

      expect(tools.results).toEqual([targetTool]);
    });

    it('should limit and paginate results, sorting by distance', async () => {
      const {
        user: { token },
        validTool
      } = await setup();

      const createdTools = [];
      for (let i = 0; i < 4; i++) {
        const res = await request(server)
          .post('/api/tools')
          .set('Authorization', token)
          .send({...validTool, name: `tool${i}`});

        createdTools.push(res.body);
      }

      createdTools.sort((a,b) => a.distance - b.distance);

      expect(createdTools).toHaveLength(4);

      const { body: tools } = await request(server).get(
        `/api/tools?limit=2&page=2`
      );

      expect(tools.results).toEqual([createdTools[2], createdTools[3]]);
    });
  });

  describe('GET /api/tools/:id', () => {
    it('should respond with 200 and tool when tool found', async () => {
      const {
        user: { token },
        validTool
      } = await setup();

      const { body: createdTool } = await request(server)
        .post('/api/tools')
        .set('Authorization', token)
        .send(validTool);

      const { body, status } = await request(server).get(
        `/api/tools/${createdTool.id}`
      );

      expect(status).toBe(200);
      expect(createdTool).toEqual(body);
    });

    it('should respond with 422 when no tool found', async () => {
      const { status } = await request(server).get(
        '/api/tools/anIDthatdoesntExist'
      );

      expect(status).toBe(422);
    });
  });

  describe('PUT /api/tools/:id', () => {
    it('should respond with 401 if not logged in', async () => {
      const { status } = await request(server)
        .put('/api/tools/anIDthatdoesntExist')
        .send({ name: "Won't Get Here" });

      expect(status).toBe(401);
    });

    it('should update tool on valid input', async () => {
      const {
        user: { token },
        validTool
      } = await setup();

      const { body: createdTool } = await request(server)
        .post('/api/tools')
        .set('Authorization', token)
        .send(validTool);

      const { body: updatedTool, status } = await request(server)
        .put(`/api/tools/${createdTool.id}`)
        .set('Authorization', token)
        .send({ ...validTool, name: 'Something Else' });

      expect(status).toBe(200);
      expect(updatedTool.name).toBe('Something Else');
    });

    it('should respond with 401 when user_id does not match current user id', async () => {
      const {
        user: { token },
        validTool
      } = await setup();

      const { body: createdTool } = await request(server)
        .post('/api/tools')
        .set('Authorization', token)
        .send(validTool);

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
        .put(`/api/tools/${createdTool.id}`)
        .set('Authorization', unauthorizedToken)
        .send({ name: 'Something Else' });

      expect(status).toBe(401);
    });
  });

  describe('DELETE /api/tools/:id', () => {
    it('should respond with 401 when user_id does not match current user id', async () => {
      const {
        user: { token },
        validTool
      } = await setup();

      const { body: createdTool } = await request(server)
        .post('/api/tools')
        .set('Authorization', token)
        .send(validTool);

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
        .delete(`/api/tools/${createdTool.id}`)
        .set('Authorization', unauthorizedToken);

      expect(status).toBe(401);
    });

    it('should respond with 200 and deleted tool on success', async () => {
      const {
        user: { token },
        validTool
      } = await setup();

      const { body: createdTool } = await request(server)
        .post('/api/tools')
        .set('Authorization', token)
        .send(validTool);

      const { status, body: deletedTool } = await request(server)
        .delete(`/api/tools/${createdTool.id}`)
        .set('Authorization', token);

      expect(status).toBe(200);
      expect(createdTool).toEqual(deletedTool);
    });
  });
});

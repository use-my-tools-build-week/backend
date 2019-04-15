const request = require('supertest');
const jwt = require('jsonwebtoken');
const knexCleaner = require('knex-cleaner');

const db = require('../../config/db_config');
const server = require('../server');
const jwtKey = require('../../config/secrets').jwtSecret;

describe('authController', () => {
  beforeEach(async () => await knexCleaner.clean(db));

  const validUser = {
    password: 'test_password',
    email: 'testemail@testemail.ai'
  };

  describe('POST /register', () => {
    it('should respond with 201 and token on valid input', async () => {
      const response = await request(server)
        .post('/api/register')
        .send(validUser);

      const {
        body: { token },
        status
      } = response;

      expect(status).toBe(201);
      expect(token).toBeDefined();

      const decoded = await jwt.verify(token, jwtKey);
      expect(decoded.email).toBe(validUser.email);
    });

    it('should respond with 422 on invalid input', async () => {
      const response = await request(server)
        .post('/api/register')
        .send({ invalid: 'input' });

      expect(response.status).toBe(422);
    });

    it('should respond with 422 if email or email not unique', async () => {
      await request(server)
        .post('/api/register')
        .send(validUser);
      const response = await request(server)
        .post('/api/register')
        .send(validUser);

      expect(response.status).toBe(422);
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(server)
        .post('/api/register')
        .send(validUser);
    });

    it('should respond with 200 and token on successful login', async () => {
      const response = await request(server)
        .post('/api/login')
        .send({ email: validUser.email, password: validUser.password });

      const {
        body: { token },
        status
      } = response;

      expect(status).toBe(200);
      expect(token).toBeDefined();

      const decoded = await jwt.verify(token, jwtKey);
      expect(decoded.email).toBe(validUser.email);
    });

    it('should respond with 422 on bad credentials', async () => {
      const { status } = await request(server)
        .post('/api/login')
        .send({ email: 'bad', password: 'info' });

      expect(status).toBe(422);
    });
  });
});

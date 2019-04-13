const request = require('supertest');
const jwt = require('jsonwebtoken');
const db = require('../../config/db_config');

const server = require('../server');
const jwtKey = require('../../config/secrets').jwtSecret;

describe('authController', () => {
  beforeEach(() => db('users').truncate());

  const validUser = {
    username: 'test_user',
    password: 'test_password',
    email: 'test_email@test_email.ai'
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
      expect(decoded.username).toBe(validUser.username);
    });

    it('should respond with 401 on invalid input', async () => {
      const response = await request(server)
        .post('/api/register')
        .send({ invalid: 'input' });

      expect(response.status).toBe(401);
    });

    it('should respond with 409 if username or email not unique', async () => {
      await request(server)
        .post('/api/register')
        .send(validUser);
      const response = await request(server)
        .post('/api/register')
        .send(validUser);

      expect(response.status).toBe(409);
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(server)
        .post('/api/register')
        .send(validUser);
    });

    it('should respond with 200 and token on successful login', async () => {
      const {
        body: { token },
        status
      } = await request(server)
        .post('/api/login')
        .send({ username: validUser.username, password: validUser.password });

      expect(status).toBe(200);
      expect(token).toBeDefined();

      const decoded = await jwt.verify(token, jwtKey);
      expect(decoded.username).toBe(validUser.username);
    });

    it('should respond with 401 on bad credentials', async () => {
      const { status } = await request(server)
        .post('/api/login')
        .send({ username: 'bad', password: 'info' });

      expect(status).toBe(401);
    });
  });
});

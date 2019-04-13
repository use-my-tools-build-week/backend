const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../server');
const jwtKey = require('../../config/secrets').jwtSecret;

describe('POST /register', () => {
  const validUser = {
    username: 'test_user',
    password: 'test_password',
    email: 'test_email@test_email.ai'
  };

  it('should respond with 201 and token on valid input', async () => {
    const response = await request(server)
      .post('/register')
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
      .post('/register')
      .send({ invalid: 'input' });

    expect(response.status).toBe(401);
  });

  it('should respond with 409 if username or email not unique', async () => {
    await request(server).post('/register').send(validUser);
    const response = await request(server).post('/register').send(validUser);

    expect(response.status).toBe(409);
  });
});

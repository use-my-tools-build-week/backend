const request = require('supertest');
const knexCleaner = require('knex-cleaner');
const db = require('../../config/db_config');

const server = require('../server');

beforeEach(() => knexCleaner.clean(db));

describe('loanRequestsController', () => {
  const setup = async () => {
    const { body: loaner } = await request(server)
      .post('/api/register')
      .send({
        username: 'test_loaner',
        password: 'test_password',
        email: 'test_email@testemail.ai'
      });

    const { body: borrower } = await request(server)
      .post('/api/register')
      .send({
        username: 'test_borrower',
        password: 'test_password',
        email: 'test_email2@testemail.ai'
      });

    const { body: tool } = await request(server)
      .post('/api/tools')
      .set('Authorization', loaner.token)
      .send({
        name: 'test_name',
        user_id: loaner.id
      });

    const validLoanRequest = {
      message: 'test_message',
      user_id: borrower.id,
      loaner_id: loaner.id,
      tool_id: tool.id
    };

    return { loaner, borrower, validLoanRequest, tool };
  };

  describe('POST /api/loan_requests', () => {
    it('should respond with 401 if not logged in', async () => {
      const { validLoanRequest } = await setup();
      const { status } = await request(server)
        .post('/api/loan_requests')
        .send(validLoanRequest);

      expect(status).toBe(401);
    });

    it('should respond with 201 and loanRequest on valid input', async () => {
      const {
        validLoanRequest,
        borrower: { token }
      } = await setup();

      const { body: createdLoanRequest, status } = await request(server)
        .post('/api/loan_requests')
        .set('Authorization', token)
        .send(validLoanRequest);

      expect(status).toBe(201);
      expect(createdLoanRequest).toEqual(
        expect.objectContaining(validLoanRequest)
      );
    });

    it('should respond with 422 on invalid input', async () => {
      const {
        borrower: { token }
      } = await setup();

      const response = await request(server)
        .post('/api/loan_requests')
        .set('Authorization', token)
        .send({ invalid: 'input' });

      expect(response.status).toBe(422);
    });
  });

  describe('PUT /api/loan_requests', () => {
    it('should respond with 401 if not logged in', async () => {
      const {
        borrower: { token },
        validLoanRequest
      } = await setup();
      const { body: createdLoanRequest } = await request(server)
        .post('/api/loan_requests')
        .set('Authorization', token)
        .send(validLoanRequest);

      const { status } = await request(server)
        .put(`/api/loan_requests/${createdLoanRequest.id}`)
        .send(validLoanRequest);

      expect(status).toBe(401);
    });

    it('should respond with 200 and loanRequest on valid input', async () => {
      const {
        validLoanRequest,
        borrower: { token }
      } = await setup();

      const { body: createdLoanRequest } = await request(server)
        .post('/api/loan_requests')
        .set('Authorization', token)
        .send(validLoanRequest);

      const { body: updatedLoanRequest, status } = await request(server)
        .put(`/api/loan_requests/${createdLoanRequest.id}`)
        .set('Authorization', token)
        .send({ ...validLoanRequest, message: 'specific message'});

      expect(status).toBe(200);
      expect(updatedLoanRequest.message).toBe('specific message');
      expect(updatedLoanRequest.id).toBe(createdLoanRequest.id);
    });

    it('should respond with 422 when user_id does not match current user id', async () => {
      const {
        borrower: { token },
        validLoanRequest
      } = await setup();

      const { body: createdLoanRequest } = await request(server)
        .post('/api/loan_requests')
        .set('Authorization', token)
        .send(validLoanRequest);

      const unauthorizedCreds = {
        username: 'test_user2',
        password: 'test_password',
        email: 'test_email3@testemail.ai'
      };

      const {
        body: { token: unauthorizedToken }
      } = await request(server)
        .post('/api/register')
        .send(unauthorizedCreds);

      const { status } = await request(server)
        .put(`/api/loan_requests/${createdLoanRequest.id}`)
        .set('Authorization', unauthorizedToken);

      expect(status).toBe(422);
    });
  });

  describe('DELETE /api/loan_requests/:id', () => {
    it('should respond with 422 when user_id does not match current user id', async () => {
      const {
        borrower: { token },
        validLoanRequest
      } = await setup();

      const { body: createdLoanRequest } = await request(server)
        .post('/api/loan_requests')
        .set('Authorization', token)
        .send(validLoanRequest);

      const unauthorizedCreds = {
        username: 'test_user2',
        password: 'test_password',
        email: 'test_email3@testemail.ai'
      };

      const {
        body: { token: unauthorizedToken }
      } = await request(server)
        .post('/api/register')
        .send(unauthorizedCreds);

      const { status } = await request(server)
        .delete(`/api/loan_requests/${createdLoanRequest.id}`)
        .set('Authorization', unauthorizedToken);

      expect(status).toBe(422);
    });

    it('should respond with 200 and deleted loanRequest on success', async () => {
      const {
        borrower: { token },
        validLoanRequest
      } = await setup();

      const { body: createdLoanRequest } = await request(server)
        .post('/api/loan_requests')
        .set('Authorization', token)
        .send(validLoanRequest);

      const { status, body: deletedLoanRequest } = await request(server)
        .delete(`/api/loan_requests/${createdLoanRequest.id}`)
        .set('Authorization', token);

      expect(status).toBe(200);
      expect(createdLoanRequest).toEqual(deletedLoanRequest);
    });
  });
});

const { createRequest } = require('./request');
const { buildTaskPayload } = require('../fixtures/tasks');

const uniqueSuffix = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

const buildUserPayload = (overrides = {}) => {
  const base = {
    name: 'Usuario Teste',
    email: `usuario_${uniqueSuffix()}@example.com`,
    password: 'SenhaForte123',
    passwordConfirmation: 'SenhaForte123'
  };
  return { ...base, ...overrides };
};

const registerUser = async (api, overrides = {}) => {
  const payload = buildUserPayload(overrides);
  const res = await api.post('/api/v1/auth/register').send(payload);
  return { payload, res };
};

const loginUser = async (api, credentials) => {
  const res = await api.post('/api/v1/auth/login').send({ email: credentials.email, password: credentials.password });
  return res;
};

const authenticate = async () => {
  const api = createRequest();
  const { payload } = await registerUser(api);
  const loginRes = await loginUser(api, payload);
  return { api, token: loginRes.body.token, user: loginRes.body.user };
};

module.exports = { authenticate, buildUserPayload, buildTaskPayload };

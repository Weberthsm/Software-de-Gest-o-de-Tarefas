const bcrypt = require('bcryptjs');
const { createRequest } = require('../helpers/request');
const { resetDatabase, db } = require('../helpers/database');
const {
  buildUserPayload,
  missingFieldCases,
  passwordPolicyCases,
  mismatchedPasswordCase,
  invalidEmailCases
} = require('../fixtures/users');

describe('US01 - Cadastro de Usuário', () => {
  let api;

  beforeEach(() => {
    resetDatabase();
    api = createRequest();
  });

  it('cadastra usuário com dados válidos', async () => {
    const payload = buildUserPayload();
    const res = await api.post('/api/v1/auth/register').send(payload);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message', 'Usuário cadastrado com sucesso.');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.include({ name: payload.name, email: payload.email });
  });

  missingFieldCases.forEach(({ description, mutate, expectedMessage }) => {
    it(`rejeita cadastro ${description}`, async () => {
      const payload = buildUserPayload();
      mutate(payload);
      const res = await api.post('/api/v1/auth/register').send(payload);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', expectedMessage);
    });
  });

  passwordPolicyCases.forEach(({ description, override, expectedMessage }) => {
    it(`valida política de senha quando ${description}`, async () => {
      const payload = buildUserPayload(override);
      const res = await api.post('/api/v1/auth/register').send(payload);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', expectedMessage);
    });
  });

  it('rejeita confirmação de senha divergente', async () => {
    const payload = buildUserPayload(mismatchedPasswordCase.override);
    const res = await api.post('/api/v1/auth/register').send(payload);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', mismatchedPasswordCase.expectedMessage);
  });

  invalidEmailCases.forEach(({ description, override, expectedMessage }) => {
    it(`rejeita email inválido (${description})`, async () => {
      const payload = buildUserPayload(override);
      const res = await api.post('/api/v1/auth/register').send(payload);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', expectedMessage);
    });
  });

  it('rejeita cadastro com email já utilizado', async () => {
    const payload = buildUserPayload();
    const first = await api.post('/api/v1/auth/register').send(payload);
    expect(first.status).to.equal(201);

    const second = await api.post('/api/v1/auth/register').send(payload);
    expect(second.status).to.equal(409);
    expect(second.body).to.have.property('message', 'E-mail já cadastrado.');
  });

  it('armazenar senha criptografada', async () => {
    const payload = buildUserPayload();
    const res = await api.post('/api/v1/auth/register').send(payload);
    expect(res.status).to.equal(201);

    const stored = db.users.find((u) => u.email === payload.email);
    expect(stored).to.exist;
    expect(stored.passwordHash).to.exist;
    expect(stored.passwordHash).to.not.equal(payload.password);

    const matches = await bcrypt.compare(payload.password, stored.passwordHash);
    expect(matches).to.be.true;
  });
});

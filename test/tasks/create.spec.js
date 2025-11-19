const { resetDatabase, db } = require('../helpers/database');
const { authenticate } = require('../helpers/auth');
const { buildTaskPayload, invalidTitleCases, invalidDueDateCases } = require('../fixtures/tasks');

describe('US03 - Cadastro de Tarefas', () => {
  let api;
  let token;
  let user;

  beforeEach(async () => {
    resetDatabase();
    const auth = await authenticate();
    api = auth.api;
    token = auth.token;
    user = auth.user;
  });

  it('2 Permitir cadastro com título válido', async () => {
    const payload = buildTaskPayload();
    const res = await api.post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send(payload);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('task');
    expect(res.body.task).to.include({ title: payload.title, description: payload.description, dueDate: payload.dueDate, status: 'Pendente' });
  });

  it('3 Aceitar dados opcionais quando informados', async () => {
    const payload = buildTaskPayload();
    const res = await api.post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send(payload);
    expect(res.status).to.equal(201);
    expect(res.body.task.description).to.equal(payload.description);
    expect(res.body.task.dueDate).to.equal(payload.dueDate);
  });

  it('4 Permitir cadastro apenas com obrigatórios válidos', async () => {
    const payload = buildTaskPayload({ description: undefined, dueDate: undefined });
    const res = await api.post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send({ title: payload.title });
    expect(res.status).to.equal(201);
    expect(res.body.task).to.include({ title: payload.title, description: null, dueDate: null });
  });

  invalidTitleCases.forEach(({ description, payload, expectedMessage }) => {
    it(`1 Impedir cadastro ${description}`, async () => {
      const res = await api.post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send({ title: payload.title });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', expectedMessage);
    });
  });

  invalidDueDateCases.forEach(({ description, payload, expectedMessage }) => {
    it(`5 Rejeitar data prevista quando ${description}`, async () => {
      const res = await api.post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send(payload);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', expectedMessage);
    });
  });

  it('6 Associar tarefa ao usuário autenticado', async () => {
    const payload = buildTaskPayload();
    const res = await api.post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send(payload);
    expect(res.status).to.equal(201);
    const stored = db.tasks.find(t => t.id === res.body.task.id);
    expect(stored).to.exist;
    expect(stored.userId).to.equal(user.id);
  });
});

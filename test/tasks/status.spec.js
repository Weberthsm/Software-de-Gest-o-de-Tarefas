const { createRequest } = require('../helpers/request');
const { resetDatabase, db } = require('../helpers/database');
const { authenticate } = require('../helpers/auth');
const { buildTaskPayload, validStatuses, invalidStatus } = require('../fixtures/tasks');

describe('US06 - Marcar Tarefa como Concluída', () => {
  let api;
  let auth;
  let createdTask;

  beforeEach(async () => {
    resetDatabase();
    api = createRequest();
    auth = await authenticate();

    const payload = buildTaskPayload();
    const resCreate = await api
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${auth.token}`)
      .send(payload);

    createdTask = resCreate.body.task;
  });

  it('1 Restringir alteração de status ao criador', async () => {
    const other = await authenticate();

    const res = await api
      .patch(`/api/v1/tasks/${createdTask.id}/status`)
      .set('Authorization', `Bearer ${other.token}`)
      .send({ status: 'Concluída' });

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('message', 'Tarefa não encontrada.');
  });

  it('2 Registrar data/hora ao concluir', async () => {
    const res = await api
      .patch(`/api/v1/tasks/${createdTask.id}/status`)
      .set('Authorization', `Bearer ${auth.token}`)
      .send({ status: 'Concluída' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Status da tarefa atualizado com sucesso.');
    expect(res.body.task).to.include({ status: 'Concluída' });
    expect(res.body.task.completedAt).to.be.a('string');

    const stored = db.tasks.find((t) => t.id === createdTask.id);
    expect(stored.completedAt).to.equal(res.body.task.completedAt);
  });

  it('3 Alternar status entre Pendente e Concluída', async () => {
    const resDone = await api
      .patch(`/api/v1/tasks/${createdTask.id}/status`)
      .set('Authorization', `Bearer ${auth.token}`)
      .send({ status: 'Concluída' });

    expect(resDone.status).to.equal(200);
    expect(resDone.body.task).to.include({ status: 'Concluída' });

    const resBack = await api
      .patch(`/api/v1/tasks/${createdTask.id}/status`)
      .set('Authorization', `Bearer ${auth.token}`)
      .send({ status: 'Pendente' });

    expect(resBack.status).to.equal(200);
    expect(resBack.body.task).to.include({ status: 'Pendente' });
    expect(resBack.body.task.completedAt).to.equal(null);
  });

  it('Rejeitar status inválido', async () => {
    const res = await api
      .patch(`/api/v1/tasks/${createdTask.id}/status`)
      .set('Authorization', `Bearer ${auth.token}`)
      .send({ status: invalidStatus });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Status inválido.');
  });

  it('Rejeitar alteração sem autenticação', async () => {
    const res = await api
      .patch(`/api/v1/tasks/${createdTask.id}/status`)
      .send({ status: 'Concluída' });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message');
  });
});

const { v4: uuid } = require('uuid');
const taskModel = require('../models/taskModel');
const AppError = require('../utils/AppError');

const validateDueDate = (dueDate) => {
  if (!dueDate) {
    return;
  }

  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) {
    throw new AppError('Data de conclusão prevista inválida.', 400);
  }

  const now = new Date();
  if (parsed < new Date(now.toISOString().split('T')[0])) {
    throw new AppError('Data de conclusão prevista não pode ser anterior à data atual.', 400);
  }
};

const createTask = ({ userId, title, description, dueDate }) => {
  if (!title) {
    throw new AppError('Título da tarefa é obrigatório.', 400);
  }

  validateDueDate(dueDate);

  const task = {
    id: uuid(),
    userId,
    title,
    description: description || null,
    dueDate: dueDate || null,
    status: 'Pendente',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null
  };

  taskModel.createTask(task);
  return task;
};

const updateTask = ({ taskId, userId, title, description, dueDate }) => {
  const task = taskModel.findTaskById(taskId);

  if (!task || task.userId !== userId) {
    throw new AppError('Tarefa não encontrada.', 404);
  }

  if (!title) {
    throw new AppError('Título da tarefa não pode ficar em branco.', 400);
  }

  validateDueDate(dueDate);

  task.title = title;
  task.description = description || null;
  task.dueDate = dueDate || null;
  task.updatedAt = new Date().toISOString();

  taskModel.updateTask(task);
  return task;
};

const listTasks = ({ userId, status, search }) => {
  const tasks = taskModel.listTasksByUser(userId);

  return tasks
    .filter((task) => {
      if (status && task.status !== status) {
        return false;
      }
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

const toggleTaskStatus = ({ taskId, userId, status }) => {
  if (!['Pendente', 'Concluída'].includes(status)) {
    throw new AppError('Status inválido.', 400);
  }

  const task = taskModel.findTaskById(taskId);

  if (!task || task.userId !== userId) {
    throw new AppError('Tarefa não encontrada.', 404);
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();
  task.completedAt = status === 'Concluída' ? new Date().toISOString() : null;

  taskModel.updateTask(task);
  return task;
};

module.exports = {
  createTask,
  updateTask,
  listTasks,
  toggleTaskStatus
};

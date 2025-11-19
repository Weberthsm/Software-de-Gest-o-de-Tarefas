const taskService = require('../services/taskService');

const createTask = (req, res, next) => {
  try {
    const task = taskService.createTask({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate
    });

    return res.status(201).json({
      message: 'Tarefa criada com sucesso.',
      task
    });
  } catch (error) {
    return next(error);
  }
};

const updateTask = (req, res, next) => {
  try {
    const task = taskService.updateTask({
      taskId: req.params.id,
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate
    });

    return res.status(200).json({
      message: 'Tarefa atualizada com sucesso.',
      task
    });
  } catch (error) {
    return next(error);
  }
};

const listTasks = (req, res, next) => {
  try {
    const tasks = taskService.listTasks({
      userId: req.user.id,
      status: req.query.status,
      search: req.query.search
    });

    return res.status(200).json({ tasks });
  } catch (error) {
    return next(error);
  }
};

const toggleTaskStatus = (req, res, next) => {
  try {
    const task = taskService.toggleTaskStatus({
      taskId: req.params.id,
      userId: req.user.id,
      status: req.body.status
    });

    return res.status(200).json({
      message: 'Status da tarefa atualizado com sucesso.',
      task
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTask,
  updateTask,
  listTasks,
  toggleTaskStatus
};

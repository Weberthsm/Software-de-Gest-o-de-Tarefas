const db = require('../database/memory');

const createTask = (task) => {
  db.tasks.push(task);
  return task;
};

const updateTask = (task) => {
  const index = db.tasks.findIndex((storedTask) => storedTask.id === task.id);
  if (index >= 0) {
    db.tasks[index] = task;
  }
  return db.tasks[index];
};

const findTaskById = (id) => db.tasks.find((task) => task.id === id);

const listTasksByUser = (userId) => db.tasks.filter((task) => task.userId === userId);

module.exports = {
  createTask,
  updateTask,
  findTaskById,
  listTasksByUser
};

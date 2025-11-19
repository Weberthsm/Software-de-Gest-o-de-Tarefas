const db = require('../database/memory');

const createUser = (user) => {
  db.users.push(user);
  return user;
};

const findUserByEmail = (email) => db.users.find((user) => user.email === email);

const findUserById = (id) => db.users.find((user) => user.id === id);

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};

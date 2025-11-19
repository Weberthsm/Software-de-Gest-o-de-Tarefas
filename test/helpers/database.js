const db = require('../../src/database/memory');

const resetDatabase = () => {
  db.users.length = 0;
  db.tasks.length = 0;
};

module.exports = { db, resetDatabase };

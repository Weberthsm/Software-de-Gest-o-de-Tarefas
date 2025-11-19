const supertest = require('supertest');
const app = require('../../src/app');

const createRequest = () => {
  const base = process.env.BASE_URL && process.env.BASE_URL.trim();
  return base ? supertest(base) : supertest(app);
};

module.exports = { createRequest };

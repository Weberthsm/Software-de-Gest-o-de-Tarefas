const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const chai = require('chai');

const envPath = path.resolve(process.cwd(), '.env.test');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

process.env.NODE_ENV = 'test';
chai.config.includeStack = true;

global.expect = chai.expect;

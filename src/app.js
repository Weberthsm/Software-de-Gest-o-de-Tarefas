const express = require('express');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const swaggerRoutes = require('./routes/swaggerRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api-docs', swaggerRoutes);

app.use(errorHandler);

module.exports = app;

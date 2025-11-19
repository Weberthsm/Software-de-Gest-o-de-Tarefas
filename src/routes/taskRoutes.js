const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.get('/', taskController.listTasks);
router.patch('/:id/status', taskController.toggleTaskStatus);

module.exports = router;

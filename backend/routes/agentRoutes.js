const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', agentController.getAll);
router.get('/:id', agentController.getOne);
router.post('/', agentController.create);
router.put('/:id', agentController.update);
router.delete('/:id', agentController.delete);

module.exports = router;

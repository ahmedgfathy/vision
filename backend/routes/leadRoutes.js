const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', leadController.getAll);
router.get('/:id', leadController.getOne);
router.post('/', leadController.create);
router.put('/:id', leadController.update);
router.delete('/:id', leadController.delete);

module.exports = router;

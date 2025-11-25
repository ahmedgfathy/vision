const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', companyController.getAll);
router.get('/:id', companyController.getOne);
router.post('/', companyController.create);
router.put('/:id', companyController.update);
router.delete('/:id', companyController.delete);

module.exports = router;

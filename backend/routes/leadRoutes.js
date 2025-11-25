const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkModulePermission, filterResponseFields, validateFieldEdits } = require('../middleware/rbacMiddleware');

// All lead routes require authentication
router.use(authenticateToken);

// Lead CRUD routes with RBAC
router.get('/',
    checkModulePermission('leads', 'view'),
    filterResponseFields('leads'),
    leadController.getAll
);

router.get('/stats',
    checkModulePermission('leads', 'view'),
    leadController.getStats
);

router.get('/:id',
    checkModulePermission('leads', 'view'),
    filterResponseFields('leads'),
    leadController.getOne
);

router.post('/',
    checkModulePermission('leads', 'create'),
    validateFieldEdits('leads'),
    leadController.create
);

router.put('/:id',
    checkModulePermission('leads', 'edit'),
    validateFieldEdits('leads'),
    leadController.update
);

router.delete('/:id',
    checkModulePermission('leads', 'delete'),
    leadController.delete
);

module.exports = router;

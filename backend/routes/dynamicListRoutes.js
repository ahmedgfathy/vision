const express = require('express');
const router = express.Router();
const dynamicListController = require('../controllers/dynamicListController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/checkPermission');

// All routes require authentication
router.use(authenticateToken);

// Public routes (all authenticated users can view)
router.get('/categories', dynamicListController.getAllCategories);
router.get('/category/:category', dynamicListController.getByCategory);

// Admin-only routes for management
router.get('/',
    checkPermission('admin.dropdown.view'),
    dynamicListController.getAll
);

router.get('/:id',
    checkPermission('admin.dropdown.view'),
    dynamicListController.getOne
);

router.post('/',
    checkPermission('admin.dropdown.create'),
    dynamicListController.create
);

router.put('/:id',
    checkPermission('admin.dropdown.update'),
    dynamicListController.update
);

router.delete('/:id',
    checkPermission('admin.dropdown.delete'),
    dynamicListController.delete
);

router.patch('/:id/toggle-active',
    checkPermission('admin.dropdown.update'),
    dynamicListController.toggleActive
);

module.exports = router;

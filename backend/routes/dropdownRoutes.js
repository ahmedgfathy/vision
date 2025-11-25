const express = require('express');
const router = express.Router();
const dropdownController = require('../controllers/dropdownController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/checkPermission');

// All admin dropdown routes require authentication and admin permission
router.use(authenticateToken);

// Get list of all allowed dropdown tables
router.get('/tables',
    checkPermission('admin.dropdown.view'),
    dropdownController.getAllTables
);

// Get all items from a dropdown table
router.get('/:table',
    checkPermission('admin.dropdown.view'),
    dropdownController.getAll
);

// Get single item
router.get('/:table/:id',
    checkPermission('admin.dropdown.view'),
    dropdownController.getOne
);

// Create new item
router.post('/:table',
    checkPermission('admin.dropdown.create'),
    dropdownController.create
);

// Update item
router.put('/:table/:id',
    checkPermission('admin.dropdown.update'),
    dropdownController.update
);

// Toggle active status
router.patch('/:table/:id/toggle-active',
    checkPermission('admin.dropdown.update'),
    dropdownController.toggleActive
);

// Delete item
router.delete('/:table/:id',
    checkPermission('admin.dropdown.delete'),
    dropdownController.delete
);

module.exports = router;

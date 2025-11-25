const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/checkPermission');

// All routes require authentication
router.use(authenticateToken);

// Get current user's permissions
router.get('/my-permissions', ProfileController.getMyPermissions);

// Get available modules and fields
router.get('/modules-fields', ProfileController.getAvailableModulesAndFields);

// Profile management (admin only)
router.get('/', checkPermission('admin'), ProfileController.getAll);
router.get('/:id', checkPermission('admin'), ProfileController.getById);
router.post('/', checkPermission('admin'), ProfileController.create);
router.put('/:id', checkPermission('admin'), ProfileController.update);
router.delete('/:id', checkPermission('admin'), ProfileController.delete);

// Permission management (admin only)
router.post('/:id/modules', checkPermission('admin'), ProfileController.setModulePermissions);
router.post('/:id/fields', checkPermission('admin'), ProfileController.setFieldPermissions);

module.exports = router;

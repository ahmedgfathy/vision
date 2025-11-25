const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/checkPermission');
const { checkModulePermission, filterResponseFields, validateFieldEdits } = require('../middleware/rbacMiddleware');
const upload = require('../middleware/upload');

// All property routes require authentication
router.use(authenticateToken);

// Property CRUD routes with RBAC
router.get('/',
    checkModulePermission('properties', 'view'),
    filterResponseFields('properties'),
    propertyController.getAll
);

router.get('/:id',
    checkModulePermission('properties', 'view'),
    filterResponseFields('properties'),
    propertyController.getOne
);

router.post('/',
    checkModulePermission('properties', 'create'),
    validateFieldEdits('properties'),
    propertyController.create
);

router.put('/:id',
    checkModulePermission('properties', 'edit'),
    validateFieldEdits('properties'),
    propertyController.update
);

router.delete('/:id',
    checkModulePermission('properties', 'delete'),
    propertyController.delete
);

// Gallery routes
router.post('/:id/gallery',
    checkModulePermission('gallery', 'create'),
    upload.array('images', 20), // Max 20 images
    propertyController.uploadGallery
);

router.delete('/:id/gallery/:imageId',
    checkModulePermission('gallery', 'delete'),
    propertyController.deleteGalleryImage
);

router.patch('/:id/gallery/:imageId/set-primary',
    checkModulePermission('gallery', 'edit'),
    propertyController.setPrimaryImage
);

module.exports = router;

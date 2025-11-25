const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/checkPermission');
const upload = require('../middleware/upload');

// All property routes require authentication
router.use(authenticateToken);

// Property CRUD routes with RBAC
router.get('/',
    checkPermission('properties.view'),
    propertyController.getAll
);

router.get('/:id',
    checkPermission('properties.view'),
    propertyController.getOne
);

router.post('/',
    checkPermission('properties.create'),
    propertyController.create
);

router.put('/:id',
    checkPermission('properties.update'),
    propertyController.update
);

router.delete('/:id',
    checkPermission('properties.delete'),
    propertyController.delete
);

// Gallery routes
router.post('/:id/gallery',
    checkPermission('properties.update'),
    upload.array('images', 20), // Max 20 images
    propertyController.uploadGallery
);

router.delete('/:id/gallery/:imageId',
    checkPermission('properties.update'),
    propertyController.deleteGalleryImage
);

router.patch('/:id/gallery/:imageId/set-primary',
    checkPermission('properties.update'),
    propertyController.setPrimaryImage
);

module.exports = router;

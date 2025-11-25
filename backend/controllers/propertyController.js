const propertyService = require('../services/propertyService');

class PropertyController {
  async create(req, res) {
    try {
      const property = await propertyService.create(req.body, req.user.id);
      res.status(201).json(property);
    } catch (error) {
      console.error('Create property error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const properties = await propertyService.findAll(req.query);
      res.json(properties);
    } catch (error) {
      console.error('Get properties error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const property = await propertyService.findById(req.params.id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      res.json(property);
    } catch (error) {
      console.error('Get property error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const property = await propertyService.update(req.params.id, req.body, req.user.id);
      res.json(property);
    } catch (error) {
      console.error('Update property error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await propertyService.delete(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      console.error('Delete property error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async uploadGallery(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      const property = await propertyService.addGalleryImages(req.params.id, req.files, req.user.id);
      res.json(property);
    } catch (error) {
      console.error('Upload gallery error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async deleteGalleryImage(req, res) {
    try {
      const result = await propertyService.deleteGalleryImage(req.params.imageId, req.user.id);
      res.json(result);
    } catch (error) {
      console.error('Delete gallery image error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async setPrimaryImage(req, res) {
    try {
      const result = await propertyService.setPrimaryImage(req.params.id, req.params.imageId);
      res.json(result);
    } catch (error) {
      console.error('Set primary image error:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new PropertyController();

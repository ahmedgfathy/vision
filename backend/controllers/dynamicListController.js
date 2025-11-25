const dynamicListService = require('../services/dynamicListService');

class DynamicListController {
    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            const items = await dynamicListService.getByCategory(category);
            res.json(items);
        } catch (error) {
            console.error('Get by category error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await dynamicListService.getAllCategories();
            res.json(categories);
        } catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const items = await dynamicListService.findAll(req.query);
            res.json(items);
        } catch (error) {
            console.error('Get all error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const item = await dynamicListService.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json(item);
        } catch (error) {
            console.error('Get one error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async create(req, res) {
        try {
            const item = await dynamicListService.create(req.body, req.user.id);
            res.status(201).json(item);
        } catch (error) {
            console.error('Create error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const item = await dynamicListService.update(req.params.id, req.body, req.user.id);
            res.json(item);
        } catch (error) {
            console.error('Update error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const result = await dynamicListService.delete(req.params.id, req.user.id);
            res.json(result);
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async toggleActive(req, res) {
        try {
            const item = await dynamicListService.toggleActive(req.params.id, req.user.id);
            res.json(item);
        } catch (error) {
            console.error('Toggle active error:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new DynamicListController();

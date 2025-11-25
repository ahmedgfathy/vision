const dropdownService = require('../services/dropdownService');

class DropdownController {
    async getAllTables(req, res) {
        try {
            const tables = dropdownService.getAllowedTables();
            res.json(tables);
        } catch (error) {
            console.error('Get tables error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const { table } = req.params;
            const items = await dropdownService.findAll(table);
            res.json(items);
        } catch (error) {
            console.error('Get dropdown items error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const { table, id } = req.params;
            const item = await dropdownService.findById(table, id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json(item);
        } catch (error) {
            console.error('Get dropdown item error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { table } = req.params;
            const item = await dropdownService.create(table, req.body, req.user.id);
            res.status(201).json(item);
        } catch (error) {
            console.error('Create dropdown item error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { table, id } = req.params;
            const item = await dropdownService.update(table, id, req.body, req.user.id);
            res.json(item);
        } catch (error) {
            console.error('Update dropdown item error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { table, id } = req.params;
            const result = await dropdownService.delete(table, id, req.user.id);
            res.json(result);
        } catch (error) {
            console.error('Delete dropdown item error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async toggleActive(req, res) {
        try {
            const { table, id } = req.params;
            const item = await dropdownService.toggleActive(table, id, req.user.id);
            res.json(item);
        } catch (error) {
            console.error('Toggle active error:', error);
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new DropdownController();

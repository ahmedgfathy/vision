class BaseController {
    constructor(service) {
        this.service = service;
    }

    getAll = async (req, res) => {
        try {
            const items = await this.service.findAll();
            res.json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    getOne = async (req, res) => {
        try {
            const item = await this.service.findById(req.params.id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    create = async (req, res) => {
        try {
            const item = await this.service.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    update = async (req, res) => {
        try {
            const item = await this.service.update(req.params.id, req.body);
            res.json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    delete = async (req, res) => {
        try {
            await this.service.delete(req.params.id);
            res.json({ message: 'Deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = BaseController;

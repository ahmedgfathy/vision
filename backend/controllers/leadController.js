const leadService = require('../services/leadService');

class LeadController {
  async create(req, res) {
    try {
      const lead = await leadService.create(req.body, req.user.id);
      res.status(201).json(lead);
    } catch (error) {
      console.error('Create lead error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const leads = await leadService.findAll(req.query);
      res.json(leads);
    } catch (error) {
      console.error('Get leads error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const lead = await leadService.findById(req.params.id);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      res.json(lead);
    } catch (error) {
      console.error('Get lead error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const lead = await leadService.update(req.params.id, req.body, req.user.id);
      res.json(lead);
    } catch (error) {
      console.error('Update lead error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await leadService.delete(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      console.error('Delete lead error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async getStats(req, res) {
    try {
      const stats = await leadService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Get lead stats error:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new LeadController();

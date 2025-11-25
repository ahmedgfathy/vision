const BaseService = require('./baseService');

class LeadService extends BaseService {
  constructor() {
    super('leads');
  }
}

module.exports = new LeadService();

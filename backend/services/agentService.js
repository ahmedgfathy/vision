const BaseService = require('./baseService');

class AgentService extends BaseService {
  constructor() {
    super('agents');
  }
}

module.exports = new AgentService();

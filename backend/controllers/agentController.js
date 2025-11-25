const BaseController = require('./baseController');
const agentService = require('../services/agentService');

class AgentController extends BaseController {
  constructor() {
    super(agentService);
  }
}

module.exports = new AgentController();

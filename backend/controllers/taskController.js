const BaseController = require('./baseController');
const taskService = require('../services/taskService');

class TaskController extends BaseController {
  constructor() {
    super(taskService);
  }
}

module.exports = new TaskController();

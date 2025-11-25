const BaseController = require('./baseController');
const companyService = require('../services/companyService');

class CompanyController extends BaseController {
  constructor() {
    super(companyService);
  }
}

module.exports = new CompanyController();

const BaseService = require('./baseService');

class CompanyService extends BaseService {
  constructor() {
    super('companys');
  }
}

module.exports = new CompanyService();

const fs = require('fs');
const path = require('path');

const modules = ['properties', 'leads', 'agents', 'companies', 'tasks'];

const backendPath = path.join(__dirname, '..');

modules.forEach(module => {
    const capitalized = module.charAt(0).toUpperCase() + module.slice(1);
    const singular = module.slice(0, -1); // simple plural to singular
    const singularCap = singular.charAt(0).toUpperCase() + singular.slice(1);

    // Service
    const serviceContent = `const BaseService = require('./baseService');

class ${singularCap}Service extends BaseService {
  constructor() {
    super('${module}');
  }
}

module.exports = new ${singularCap}Service();
`;
    fs.writeFileSync(path.join(backendPath, 'services', `${singular}Service.js`), serviceContent);

    // Controller
    const controllerContent = `const BaseController = require('./baseController');
const ${singular}Service = require('../services/${singular}Service');

class ${singularCap}Controller extends BaseController {
  constructor() {
    super(${singular}Service);
  }
}

module.exports = new ${singularCap}Controller();
`;
    fs.writeFileSync(path.join(backendPath, 'controllers', `${singular}Controller.js`), controllerContent);

    // Routes
    const routeContent = `const express = require('express');
const router = express.Router();
const ${singular}Controller = require('../controllers/${singular}Controller');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', ${singular}Controller.getAll);
router.get('/:id', ${singular}Controller.getOne);
router.post('/', ${singular}Controller.create);
router.put('/:id', ${singular}Controller.update);
router.delete('/:id', ${singular}Controller.delete);

module.exports = router;
`;
    fs.writeFileSync(path.join(backendPath, 'routes', `${singular}Routes.js`), routeContent);

    console.log(`Generated backend files for ${module}`);
});

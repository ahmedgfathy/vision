const fs = require('fs');
const path = require('path');

const backendPath = path.join(__dirname, '..');

const fixes = [
    { old: 'propertie', new: 'property' },
    { old: 'companie', new: 'company' }
];

const dirs = ['routes', 'controllers', 'services'];

fixes.forEach(fix => {
    dirs.forEach(dir => {
        const oldPath = path.join(backendPath, dir, `${fix.old}${dir === 'routes' ? 'Routes' : dir === 'controllers' ? 'Controller' : 'Service'}.js`);
        const newPath = path.join(backendPath, dir, `${fix.new}${dir === 'routes' ? 'Routes' : dir === 'controllers' ? 'Controller' : 'Service'}.js`);

        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed ${oldPath} to ${newPath}`);
        }
    });
});

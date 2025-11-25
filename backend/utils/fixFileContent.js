const fs = require('fs');
const path = require('path');

const backendPath = path.join(__dirname, '..');

const fixes = [
    { old: 'propertie', new: 'property' },
    { old: 'Propertie', new: 'Property' },
    { old: 'companie', new: 'company' },
    { old: 'Companie', new: 'Company' }
];

const dirs = ['routes', 'controllers', 'services'];

dirs.forEach(dir => {
    const files = fs.readdirSync(path.join(backendPath, dir));
    files.forEach(file => {
        const filePath = path.join(backendPath, dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        let changed = false;
        fixes.forEach(fix => {
            const regex = new RegExp(fix.old, 'g');
            if (content.match(regex)) {
                content = content.replace(regex, fix.new);
                changed = true;
            }
        });

        if (changed) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated content of ${filePath}`);
        }
    });
});

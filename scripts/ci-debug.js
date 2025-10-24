const fs = require('fs');

console.log('node', process.version);
console.log('platform', process.platform);
try {
  console.log('cwd', process.cwd());
  console.log('files:\n' + fs.readdirSync('.').join('\n'));
  if (fs.existsSync('node_modules/.bin')) {
    console.log('node_modules/.bin:\n' + fs.readdirSync('node_modules/.bin').join('\n'));
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}

const env = process.argv.slice(-1)[0];

if (env.trim() === 'dev') {
  process.env.NODE_ENV = 'development';
}

const fs = require('fs');
const path = require('path');
const { utils } = require('@irim/cli-base');
require('ts-node').register({
  transpileOnly: true,
  typeCheck: false,
  compilerOptions: {
    module: 'commonjs', // you can also override compilerOptions.  Only ts-node will use these overrides
  },
});

const defaultSetting = require(path.join(
  __dirname,
  '../config/defaultSettings.ts',
)).default;

const tplConfigStr = fs.readFileSync(path.join(__dirname, './_config-tpl.js'), {
  encoding: 'utf-8',
});

const renderStr = utils.templateRender(tplConfigStr, defaultSetting);

fs.writeFileSync(path.join(__dirname, '../public/config.js'), renderStr);

const env = process.argv.slice(-1)[0];

if (env.trim() === 'dev') {
  process.env.NODE_ENV = 'development';
}

// console.log('>>>>>>>>> process.env.NODE_ENV', process.env.NODE_ENV);

require('ts-node').register({
  transpileOnly: true,
  typeCheck: false,
  compilerOptions: {
    module: 'commonjs', // you can also override compilerOptions.  Only ts-node will use these overrides
  },
});

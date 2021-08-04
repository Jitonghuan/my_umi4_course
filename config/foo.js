// foo
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/04 10:43

const path = require('path');
const { Client } = require('node-scp');

async function demo() {
  const client = await Client({
    host: '192.168.0.111',
    port: 22,
    username: 'root',
    password: '&WUb&1u8508P0ohD',
  });

  await client.uploadFile(
    path.resolve(process.cwd(), 'dist/matrix/index.html'),
    '/usr/share/nginx/html/matrix-test/matrix/index.html'
  );

  client.close();
}

demo();

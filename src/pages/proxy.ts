export default {
  '/user_backend': {
    target: 'http://60.190.249.92/',
    changeOrigin: true,
  },
  '/v1': {
    target: 'http://matrix-api-test.cfuture.shop/',
    // target: 'http://10.10.130.102:8080/', // 羁绊本地
    // target: 'http://10.10.130.108:8000', // 可乐本地
    changeOrigin: true,
  },
};

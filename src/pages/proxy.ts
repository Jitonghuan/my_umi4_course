export default {
  '/user_backend': {
    target: 'http://60.190.249.92/',
    changeOrigin: true,
  },
  '/v1': {
    target: 'http://matrix-api-test.cfuture.shop/',
    // target: 'http://10.10.128.182:8081/', // 羁绊本地
    changeOrigin: true,
  },
};

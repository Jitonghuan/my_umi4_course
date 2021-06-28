(() => {
  /**
   * @param {string} logo
   * @param {string} title
   * @param {string} copyright
   * @param {string} favicon
   */
  const DEFAULT_CONFIG = {
    favicon:
      'https://come2future-web.oss-cn-hangzhou.aliyuncs.com/dev/fe-matrix-front/matrix-front/matrix/favicon.png',
    logo: 'https://come2future-web.oss-cn-hangzhou.aliyuncs.com/dev/fe-matrix-front/matrix-front/matrix/logo.png',
    title: 'Matrix',
    copyright: '2021 来未来',
  };

  window.FE_GLOBAL = DEFAULT_CONFIG;
})();

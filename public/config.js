(() => {
  /**
   * @param {string} logo
   * @param {string} title
   * @param {string} copyright
   * @param {string} favicon
   */
  const DEFAULT_CONFIG = {
    favicon: '/matrix/favicon.png',
    logo: '/matrix/logo.png',
    title: 'Matrix',
    copyright: '2021 来未来',
  };

  window.FE_GLOBAL = DEFAULT_CONFIG;
})();

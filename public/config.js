(() => {
  /**
   * @param {string} logo
   * @param {string} title
   * @param {string} copyright
   * @param {string} favicon
   */
  const DEFAULT_CONFIG = {
    favicon: '/matris/favicon.png',
    logo: '/matris/logo.png',
    title: 'Matris',
    copyright: '2021 来未来',
  };

  window.FE_GLOBAL = DEFAULT_CONFIG;
})();

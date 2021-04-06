(() => {
  /**
   * @param {string} logo
   * @param {string} title
   * @param {string} copyright
   * @param {string} favicon
   */
  const DEFAULT_CONFIG = {
    favicon: '{{favicon}}',
    logo: '{{logo}}',
    title: '{{title}}',
    copyright: '{{copyright}}',
  };

  window.FE_GLOBAL = DEFAULT_CONFIG;
})();

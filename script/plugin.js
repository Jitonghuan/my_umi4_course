export default function (api) {
  api.addRuntimePlugin(() => {
    api.logger.info('use plugin');
  });
  // api.modifyHTML(($) => {
  //   $('body').prepend(`<h1>hello umi plugin</h1>`);
  //   return $;
  // });
}

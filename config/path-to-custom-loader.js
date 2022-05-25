const fs = require('fs');
const path = require('path');

const pattern = /antd\/lib\/([^\/]+)\/style\/index.less/;

module.exports = function (content/*, map, meta */) {
  /**
   * 这里的 resourcePath 就是具体被使用的 LESS 文件的目录，详情可以参考 Webpack 文档：
   * https://webpack.js.org/api/loaders/#thisresourcepath
   */
  const { resourcePath } = this;
  const match = pattern.exec(resourcePath);
  /**
   * 1. 如果不是 Antd 相关的 LESS 文件，直接忽略不处理
   */
  if (!match) return content;
  const component = match[1];
  /**
   * 2. 根据使用的 Component 组件，找到对应的覆盖样式文件，赋值给 customizedLessPath
   */
  const customizedLessPath = getCustomizedLessFile(component);
  if (!customizedLessPath) return content;
  /**
   * 3. 如果找到了覆盖文件，就将覆盖文件插入到 LESS 的最后面，保证调用顺序
   */
  return [
    content,
    `@import "${customizedLessPath}";`,
  ].join('\n');
}

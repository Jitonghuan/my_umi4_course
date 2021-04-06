/**
 * add-page
 * @description 创建页面文件结构的脚本
 * @author yyf
 * @create 2021-02-24 10:58
 */

const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');
const { utils } = require('@irim/cli-base');

// page 文件路径
const pagePath = path.resolve('./src/pages');
// 路由配置文件
const routesPath = path.resolve(pagePath, 'routes.config.ts');
// 模板路径
const tplPath = path.resolve('./script/page-tpl');

// 改造路由
const updateRoutes = (routesInfo) => {
  const str = JSON.stringify(routesInfo);

  if (fs.existsSync(routesPath)) {
    const routesStr = fs.readFileSync(routesPath, { encoding: 'utf-8' });

    // 查找注入节点
    const idx = routesStr.indexOf('/** {{routes:');
    const targetStr = `${routesStr.substr(0, idx)}${str},\n${routesStr.substr(
      idx,
    )}`;

    fs.writeFileSync(routesPath, targetStr);

    utils.print('success', 'routes更新完成');
  }
};

// 初始化页面文件
const createPage = async () => {
  // 获取页面名称
  const pageName = await utils.input(
    '请输入页面文件名<英文、中划线，首字母须英文>',
  );
  const comsName = pageName[0].toUpperCase() + pageName.slice(1); // 页面组件名，首字母大写处理
  const pageDesc = await utils.prompt(
    '请输入页面名称<页面作用描述，例如 “测试页面”>',
    null,
    (v) => {
      if (!v) return new Error('测试页面必填！');
      return true;
    },
  );
  const pageSelect = await utils.multi(
    '请选择输出文件<空格选中>',
    [
      { name: 'index.tsx', value: 'index.tsx' },
      { name: 'index.less', value: 'index.less' },
      { name: 'mock.ts', value: 'mock.ts' },
      { name: 'model.ts', value: 'model.ts' },
      { name: 'service.ts', value: 'service.ts' },
    ],
    ['index.tsx', 'index.less', 'mock.ts'],
  );

  // 确定输出文件位置
  const outputFilePath = path.resolve(pagePath, pageName);

  utils.print('info', '>----------- 开始创建页面文件 ----------->');

  // 读取需要配置的文件，渲染输出
  pageSelect.forEach((el, idx) => {
    // 模板文件位置
    const tplFilePath = path.resolve(tplPath, el);
    // 要输出的文件path
    const outputPath = path.resolve(
      outputFilePath,
      el === 'mock.ts' ? '_mock.ts' : el,
    );

    const fileStr = fs.readFileSync(tplFilePath, { encoding: 'utf-8' });
    const renderStr = utils.templateRender(fileStr, {
      pageName,
      comsName,
      pageDesc,
      timeStr: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });

    // 判断文件夹
    if (!fs.existsSync(outputFilePath)) {
      utils.print('info', `${el}文件夹不存在，开始创建...`);
      fs.mkdirSync(outputFilePath);
    }

    // 当前文件已存在，中断当前文件的写入行为
    if (fs.existsSync(outputPath)) {
      utils.print(
        'warn',
        `${el}文件已存在，不执行覆盖，继续执行下一个文件写入`,
      );
      return;
    }

    // 文件存在，写入对应文件
    fs.writeFileSync(outputPath, renderStr);
    // utils.print('info', `${el}创建完成`);
  });

  utils.print('success', '页面创建完成');

  const isCreateRoutes = await utils.confirm(
    '是否更新路由文件<仅支持一级路由，暂不支持子路由>',
  );

  if (!isCreateRoutes) {
    return;
  }

  const pageRoute = await utils.input('请输入页面路径');
  const pageIcon = await utils.input('请输入页面路由Icon');

  utils.print('info', '>----------- 开始改造路由文件 ----------->');

  updateRoutes({
    path: pageRoute,
    name: pageDesc,
    icon: pageIcon,
    component: `@/pages/${pageName}`,
  });
};

createPage();

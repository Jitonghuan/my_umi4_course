<!--
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-08-09 15:14:09
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-08-09 15:47:20
 * @FilePath: /my_umi4_course/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

//第一步 ：初始化项目
npm init -y
//第二步：安装 pnpm
npm i pnpm -g
//3 、安装umi模块--umi4
npm i umi@4.0.0-rc.20 || pnpm i umi@4.0.0-rc.20
//4、添加 .gitignore 打包时忽略依赖包
//5、修改项目启动命令
{
  "scripts": {
    "start": "umi dev",
  },
}

可以直接使用umi dev、npm start 、npm run dev 或者npx umi dev 启动项目

6、搭建页面
7、Umi 的微生成器有统一的命令入口调用：
umi generate (alias: umi g) [type]

$ umi g page
? What is the name of page? › mypage
? How dou you want page files to be created? › - Use arrow-keys. Return to submit.
❯   mypage/index.{tsx,less}
    mypage.{tsx,less}

8、npx umi g 配置ts

9、因为 typescript 无法识别 png 后缀的文件名。因此我们可以在项目中添加一个 typings.d.ts 来修复这些不是别的文件后缀。当然如果有些库，你真的无法找到它对应的 types 库，那你也可以在这个文件中定义它或者忽略它。

10、umi全局的 hooks 数据流方案。
约定存在 src/models 目录下面的文件，只要导出了自定义 hook ，会被识别为 model，添加到全局的 hooks 数据流中。可以在任何 React 上下文中，使用 useModel 取到你需要的数据。
useModel 有两个参数，useModel(namespace,updater)。
namespace 就是 hooks model 文件的文件名，如上面例子里的 user。
updater - 可选参数。在 hooks model 返回多个状态，但使用组件仅引用了其中部分状态，并且希望仅在这几个状态更新时 rerender 时使用（性能相关）
----------------------------------------
使用 Umi model 插件
npm i @umijs/plugins@4.0.0-rc.20

11、增加配置 config/config.ts，使用 model 插件，并且配置 model 来开启插件功能。
import { defineConfig } from "umi";

export default defineConfig({
  plugins: [require.resolve("@umijs/plugins/dist/model")],
  model: {},
});


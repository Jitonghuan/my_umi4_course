/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-08-09 15:42:38
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-08-09 15:42:38
 * @FilePath: /my_umi4_course/config/config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "umi";

export default defineConfig({
  // 最终值在插件中设置，所以这里不用写
  //   title: "Hello Umi",
  plugins: [
    require.resolve("@umijs/plugins/dist/model"),
    require.resolve("@umijs/plugins/dist/antd"),
    require.resolve("@alita/plugins/dist/request"),
    // require.resolve("@umijs/max-plugin-openapi/dist/openapi"),
    
  ],
  // openAPI: {
  //   // 这里使用服务端提供的url
  //   schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json",
  //   mock: true,
  // },


  model: {},
  request: {},
  antd: {},

});

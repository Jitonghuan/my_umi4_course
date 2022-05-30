"use strict";
// 应用工程配置
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/10 15:41
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var umi_1 = require("umi");
var routes_config_1 = require("../src/routes.config");
var monaco_editor_webpack_plugin_1 = require("monaco-editor-webpack-plugin");
// 资源引用的根路径，此变量与项目在 nginx 中匹配前缀相关，如果
var sourceRoot = '/';
var _a = process.env, VERSION = _a.VERSION, NODE_ENV = _a.NODE_ENV, BUILD_ENV = _a.BUILD_ENV;
var publicPathPrefix = NODE_ENV === 'development' ? '/' : !VERSION ? "" + sourceRoot : "" + sourceRoot + VERSION + "/";
// 更多配置查看: https://umijs.org/zh-CN/config
exports["default"] = umi_1.defineConfig({
    // -----------------------------------------------------------------
    // ------------------- 可以根据实际情况修改的配置项 -------------------
    // 文件依赖路径别名，默认支持 @/ 指向 src/
    alias: {},
    esbuild: {},
    chainWebpack: function (config, _a) {
        var webpack = _a.webpack;
        config.plugin('monaco-editor').use(monaco_editor_webpack_plugin_1["default"]);
    },
    // extraBabelPlugins: [
    //   "@babel/syntax-dynamic-import",
    //   ["@babel/plugin-proposal-private-methods", { "loose": true }],
    //   ["@babel/proposal-class-properties", { "loose": true }],
    //   [
    //     "import",
    //     {
    //       "libraryName": "antd",
    //       "libraryDirectory": "lib",
    //       "style": true
    //     }
    //   ]
    // ],
    // 本地开发请求代理规则
    proxy: {
        '/user_backend': {
            target: 'http://60.190.249.92/',
            changeOrigin: true
        },
        '/v1': {
            target: 'http://matrix-test.cfuture.shop/',
            // target: 'http://matrix.cfuture.shop/',
            // target: 'http://matrix-api-test.cfuture.shop/',
            // target: 'http://10.10.129.47:8080/',//青枫本地
            // target: 'http://10.10.128.182:8081/', // 羁绊本地
            // target: 'http://10.10.130.108:8000', // 可乐本地
            // target: 'http://turing.cfuture.shop:8010', // 逍遥本地
            // target: 'https://release.zy91.com:4443/futuredog',
            // target: 'http://10.10.129.73:8080',//木南本地
            // target: 'http://10.10.129.167:8080',//时雨本地
            // target: 'http://10.10.129.54:8080',//习习本地
            // target: 'http://10.10.129.145:8080',//不辣本地
            changeOrigin: true
        }
    },
    devServer: {
        port: 9091
    },
    // 路由配置
    routes: [
        {
            path: routes_config_1.baseRoutePath,
            component: '../layouts/basic-layout/index',
            routes: __spreadArrays(routes_config_1["default"])
        },
        {
            path: '/*',
            redirect: routes_config_1.baseRoutePath + "/index"
        },
    ],
    // less 主题变量
    theme: {
        '@primary-color': '#1973CC'
    },
    // ------------------------------------------------------------
    // ------------------- 以下配置项请勿随意修改 -------------------
    // ------------------------------------------------------------
    nodeModulesTransform: { type: 'none' },
    // 默认是 browser 路由
    history: { type: 'browser' },
    // 文件 hash 后缀 （ hash: true ）
    hash: NODE_ENV === 'development',
    themeHbos: {
        // 项目 bundleName，插件会使用这个 bundleName 来进行样式隔离
        bundleName: 'matrix'
    },
    // 面向浏览器对象，开发环境默认支持 chrome
    targets: { chrome: 65, firefox: false, safari: false, edge: false, ios: false },
    publicPath: publicPathPrefix,
    // 配置 external 资源外部依赖, react, react-dom
    externals: NODE_ENV === 'development' ? {} : {
        react: 'window.React',
        'react-dom': 'window.ReactDOM'
    },
    // HTML 中以 <script> 方式引用的资源
    scripts: NODE_ENV === 'development' ? [] : [
        { src: publicPathPrefix + "react.min.js" },
        { src: publicPathPrefix + "react-dom.min.js" },
        "window.BUILD_ENV = \"" + BUILD_ENV + "\""
    ],
    // 开启动态资源加载
    dynamicImport: {
        loading: '@/components/source-loading'
    },
    extraBabelPlugins: [
        [
            require.resolve('babel-plugin-import'),
            {
                "libraryName": "@cffe/h2o-design",
                "libraryDirectory": "lib/components"
            },
            '@cffe/h2o-design',
        ]
    ]
});


<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="x-ua-compatible" content="ie=edge,chrome=1">
  <link rel="dns-prefetch" href="//dev.cdn.cfuture.cc/">
  <link rel="dns-prefetch" href="//test.cdn.cfuture.cc/">
  <link rel="icon" type="image/png" href="/front/images/favicon.png">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Cache-Control" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>浙大一院</title>

  <object id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0
    style="position: absolute;">
    <embed id="LODOP_EM" type="application/x-print-lodop" width=0 height=0></embed>
  </object>

  <script src="/front/js/qwebchannel.js"></script>
  <script src="/front/js/lodop/lodopFuncs.js"></script>
  <script src="/front/js/react-production.js"></script>

  <script>
    (function () {

      if(localStorage.getItem('appsConfig')){
        var index=0;
        JSON.parse(localStorage.getItem('appsConfig')).find((item,i)=>{index=i; return item.basePath=='/'});
        if(index>1){
          localStorage.removeItem('appsConfig')
        }
      }
      if (location.host.endsWith(".cn")) {
        window.__webpack_public_path__ = '//test.cdn.cfuture.cc/';
      } else {
        window.__webpack_public_path__ = '//dev.cdn.cfuture.cc/';
      }
      window.__webpack_public_path__ = window.localStorage.getItem('webpackPublicPath') || window.__webpack_public_path__;

      window.__public_env__ = 'zheyi';
      window.dingToken = '6a132db0e4965cb31004ffba3b4e478bc425168dc91bcb235ac41aededa74ee3';
      window.dingToken = 'noding';
      window.systemAk = 'tHPYenXAtgtIw9xTngsj';
      window.__portal__path__ = 'future-hit-g3a/future-his-portal-web/';
      window.__portal_version__ = '1.1.11';
      window.__portal_version__ = window.sessionStorage.getItem('publicPortalVersion') || window.__portal_version__;

      // 配置业务全局loading
      window.hasFetchLoading = true;

      window.LODOP = getLodop();
      window.appsConfigDynamic = {
        {foreach $routeList as $item}
          "{$item.routePath}": "{$item.gitGroup}/{$item.gitProject}@{$item.version}"
        {/foreach}
        // "/xnlogin": "future-hit-g3a/future-his-xnlogin@0.0.1",
        // "/": "future-hit-g3a/future-his-login@1.0.28",
        // "/basis": "future-hit-g3a/future-his-sysmanager-web@1.1.16@local",
      };

    }());
  </script>
</head>
<body>
  <div id="ice-container"></div>
  <script type="text/javascript">
    (function () {
      var location = window.location;
      var hostname = location.hostname;
      var portalConfig = window.__portal_version__;
      var scriptUrl = '';
      var cssLink = '';
      var getEnv = function () { // 获取环境
        var location = window.location;
        var hostname = location.hostname;
        var developDomains = [
          'dev-his.seenew.info',
          'dev-his.seenew.cn',
          'gmc-dev.cfuture.shop',
          'gmc-dev.cfuture.cn',
          'g3a-dev.cfuture.shop',
          'g3a-dev.cfuture.cn',
          't-his.seenew.info',
        ];
        if (hostname === 'localhost') {
          return 'test'; // 测试环境
        } else if (hostname === 'dev.fh.com') { // 开发环境
          return 'dev';
        } else if (hostname === 'test.fh.com') { // 本地测试环境
          return 'localTest';
        } else if (hostname === 'mock.fh.com') { // 本地测试环境
          return 'mock';
        } else if (hostname === 'test.future-his.com') { // 阿里云测试环境
          return 'aliTest';
        } else if (developDomains.indexOf(hostname) > -1) {
          return 'develop';
        } else if (hostname.endsWith('seenew.info')) {
          return 'daily';
        }
        return 'local';
      }
      var getAssets = function (url, callback) {
        var SCRIPT_ID = 'bundle-js';
        var LINK_ID = 'bundle-css';
        var type = /\.js$/.test(url) ? 'script' : 'link';
        var id = type === 'script' ? SCRIPT_ID : LINK_ID;

        var element = document.getElementById(id);

        if (element) {
          element.parentNode.removeChild(element);
        }

        element = document.createElement(type);
        element.id = id;

        if (type === 'script') {
          element.type = 'text/javascript';
          element.src = url;
        } else {
          element.rel = 'stylesheet';
          element.href = url;
        }

        element.addEventListener('load', function () {
          if (callback) {
            callback(null);
          }
        }, false);
        element.addEventListener('error', function (e) {
          var err = new Error("资源加载失败：" + url);
          err.type = type;
          if (callback) {
            callback(err);
          }
        }, false);

        document.getElementsByTagName('head')[0].appendChild(element);
      }

      if (getEnv() === 'develop') {
        scriptUrl = window.__webpack_public_path__+ 'future-hit-g3a/future-his-portal-web/' + portalConfig + "/build/js/index.js";
      } else {
        scriptUrl = '/future-his-portal-web/' + portalConfig + '/js/index.js';
      }
      var css = window.__webpack_public_path__+ 'future-hit-g3a/future-his-portal-web/' + portalConfig +"/build/css/index.css";
      getAssets(css);
      getAssets(scriptUrl);

      var firstLevelPath = "/" + location.pathname.split("/")[1];
      var matchKey = Object.keys(window.appsConfigDynamic).find(function(key){
         return (key != '/' && firstLevelPath.toLowerCase() == key.toLowerCase())
      })
      if(matchKey){
        var res = appsConfigDynamic[matchKey].split("/")[1].split("@");
        if(res[2] && res[2] === 'local'){
          window.__webpack_public_path__ = '';
        }
      }

    })();
  </script>
</body>
</html>

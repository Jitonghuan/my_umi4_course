
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge,chrome=1" />
    <link rel="icon" type="image/png" href="/front/images/favicon.png" />
    <meta name="viewport" content="width=device-width" />
    <title>天台医共体</title>
  	<link rel="preload" href="/front/js/react-production.js" as="script" />
    <link rel="preload" href="/front/js/react.js" as="script" />
    <link rel="preload" href="/future-his-portal-web/2.0.18/js/index.js" as="script" />

  	<script>
      (function () {
          window.appsConfigDynamic = {
            {foreach $routeList as $item}
              "{$item.routePath}": "{$item.gitGroup}/{$item.gitProject}@{$item.version}"
            {/foreach}
          };
          //window.FELOG_DISABLE_API_INJECT = true;
          //window.FELOG_ENABLE_API_SUCCESS = false;
      }());
      (function () {
        try{
          //--grayConfigs start--
          var grayConfigs = [];
          //--grayConfigs end--
          var currentUser = sessionStorage.getItem('userName');
          grayConfigs.forEach(function(e){
            if (e.userName === currentUser){
              var path = e.path;
              var temp = window.appsConfigDynamic[path].split('@');
              temp[1] = e.version;
              window.appsConfigDynamic[path] = temp.join('@');
            }
          });
        }catch(e){}
      }());
	  window['dyk'] = '0x64796b796964616f6a6975';
    </script>
    <link href="/future-his-portal-web/2.0.18/css/index.css" rel="stylesheet">
    <object id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0
        style="position: absolute;">
        <embed id="LODOP_EM" type="application/x-print-lodop" width=0 height=0></embed>
    </object>
    <script id="seenew-felog" data-project="felogs-tt" data-logstore="test" src="/front/js/felog.js"></script>
    <script src="/front/js/qwebchannel.js"></script>
    <script src="/front/js/lodop/lodopFuncs.js"></script>

    <script>
      (function () {
        window.__public_env__ = 'tiantai';
        if(location.host.match('ws-')){
          window.__public_env__ = 'weishan';
        }

      	window.__portal_version__ = '2.0.18';
      	window.__portal_version__ = window.sessionStorage.getItem('publicPortalVersion') || window.__portal_version__;

        window.__webpack_public_path__ = '';
        window.__webpack_public_path__ = window.sessionStorage.getItem('webpackPublicPath') || window.__webpack_public_path__;

        window.LODOP = getLodop();

      }());
    </script>
</head>

<body>
    <div id="ice-container"></div>
    <script>window.hasFetchLoading = true;</script>
  	<script type="text/javascript">
    (function () {

      var getAssets = function (url, callback) {
        var type = /\.js$/.test(url) ? 'script' : 'link';

       	var element = document.createElement(type);
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

        document.head.appendChild(element);
      }

      var portal = '/future-his-portal-web/'+ window.__portal_version__ +'/js/index.js';
      var css = '/future-his-portal-web/'+ window.__portal_version__ +'/css/index.css';
      if (window.__webpack_public_path__) {
        portal =  window.__webpack_public_path__ + 'future-hit-gmc/future-his-portal-web' + window.__portal_version__ +'/build/js/index.js';
        css =  window.__webpack_public_path__ + 'future-hit-gmc/future-his-portal-web' + window.__portal_version__ +'/build/css/index.css';
      }

      getAssets(css);
      var upgradePaths = ['newDispensingManage',
                          'DietManagement',
                          'webDictCommonManage',
                          'newappointmentAndRegister',
                          'admission',
                          'newDoctorStation',
                          'newtechnology',
                          'qualityControl',
                          'newdischargeSettlement',
                          'newInpationtManage',
                          'newMedicinemanager',
                          'patients',
                          'upgradeNurseStation',
                          'blood',
                          'emergency',
                          'newDispensingManageLow'
                         ]
      var needUpdate = false;
      upgradePaths.forEach(function(item){
		if(location.pathname.toLowerCase().match(item.toLowerCase())){
        	needUpdate = true;
        }
	  })
      //if(needUpdate){
        getAssets('/front/js/react-production.js',function(){
          getAssets(portal);
        });
      //}else{
      //  getAssets('/front/js/react.js',function(){
      //    getAssets(portal);
      //  });
      //}

      //var entryPaths = ['upgradeNurseStation','newDoctorStation']
      //entryPaths.forEach(function(item){
	  //if(location.pathname.match(item)){
      //  	window.FELOG_ENABLE_ENTRY = true
      //  }
	  //})
    })();
  	</script>
  <!-- script src="/front/js/feload.js" crossorigin="anonymous"></script -->

</body>

</html>

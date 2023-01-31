type IRouteItem = {
  path: string;
  name?: string;
  icon?: string;
  component: string;
  routes?: IRouteItem[];
};

/** 基础路由前缀 */
export const baseRoutePath = '/matrix';
export default [
  {
    path: 'index',
    // name: '首页',
    icon: 'icon-poc_index',
    // component: '@/pages/index',
    component: '@/pages/dashboard/workplace',
  },
  {
    path: `${baseRoutePath}/application`,
    redirect: `${baseRoutePath}/application/all`,
  },
  {
    path: `${baseRoutePath}/pedestal`,
    redirect: `${baseRoutePath}/pedestal/storage-manage/storage-dashboard`,
  },
  {
    path: `${baseRoutePath}/publish`,
    redirect: `${baseRoutePath}/publish/function`,
  },
  {
    path: `${baseRoutePath}/test`,
    redirect: `${baseRoutePath}/test/data-factory/template`,
  },
  {
    path: `${baseRoutePath}/monitor`,
    redirect: `${baseRoutePath}/monitor/board`,
  },
  {
    path: `${baseRoutePath}/ticket`,
    redirect: `${baseRoutePath}/ticket/list`,
  },
  {
    path: `${baseRoutePath}/order`,
    redirect: `${baseRoutePath}/order/list`,
  },
  {
    path: `${baseRoutePath}/code`,
    redirect: `${baseRoutePath}/code/rank`,
  },
  {
    path: `${baseRoutePath}/test/scripts`,
    redirect: `${baseRoutePath}/test/scripts/functions`,
  },
  {
    path: `${baseRoutePath}/test/autotest`,
    redirect: `${baseRoutePath}/test/autotest/dashboard`,
  },
  {
    path: `${baseRoutePath}/monitor/basic`,
    redirect: `${baseRoutePath}/monitor/basic/prometheus`,
  },
  {
    path: `${baseRoutePath}/cluster/cluster-zy`,
    redirect: `${baseRoutePath}/cluster/cluster-zy/dashboards`,
  },
  {
    path: `${baseRoutePath}/cluster/cluster-tt`,
    redirect: `${baseRoutePath}/cluster/cluster-tt/dashboards`,
  },
  {
    path: `${baseRoutePath}/cluster/cluster-zs`,
    redirect: `${baseRoutePath}/cluster/cluster-zs/dashboards`,
  },
  {
    path: `${baseRoutePath}/operation/app-tmpl`,
    redirect: `${baseRoutePath}/operation/app-tmpl/tmpl-list`,
  },
  {
    path: `${baseRoutePath}/operation/env-manage`,
    redirect: `${baseRoutePath}/operation/env-manage/env-list`,
  },
  {
    path: `${baseRoutePath}/operation/ng-manage`,
    redirect: `${baseRoutePath}/operation/ng-manage/ng-list`,
  },
  {
    path: `${baseRoutePath}/operation/helm-manage`,
    redirect: `${baseRoutePath}/operation/helm-manage/helm-list`,
  },
  {
    path: `${baseRoutePath}/operation/label-manage`,
    redirect: `${baseRoutePath}/operation/label-manage/label-list`,
  },
  {
    path: `${baseRoutePath}/test/data-factory`,
    redirect: `${baseRoutePath}/test/data-factory/template`,
  },
  {
    path: `${baseRoutePath}/test/workspace`,
    redirect: `${baseRoutePath}/test/workspace/test-case-library`,
  },
  {
    path: `${baseRoutePath}/test/quality-control-new`,
    redirect: `${baseRoutePath}/test/quality-control-new/overview`,
  },
  {
    path: `${baseRoutePath}/DBMS/authority-manage`,
    redirect: `${baseRoutePath}/DBMS/authority-manage/authority-apply`,
  },
  {
    path: `${baseRoutePath}/config/nacos-config`,
    redirect: `${baseRoutePath}/config/nacos-config/nacos`,
  },
  {
    path: `${baseRoutePath}/DBMS/safe-rule`,
    redirect: `${baseRoutePath}/DBMS/safe-rule/safe-list`,
  },
  {
    path: `${baseRoutePath}/steps`,
    redirect: `${baseRoutePath}/steps/detail`,
  },
  {
    path: `${baseRoutePath}/cluster-recovery`,
    redirect: `${baseRoutePath}/cluster-recovery/dashboards`,
  },
  {
    path: `${baseRoutePath}/cluster-recovery/scheduling`,
    redirect: `${baseRoutePath}/cluster-recovery/scheduling/organ`,
  },
  {
    path: `${baseRoutePath}/cluster-recovery/cluster-sync`,
    redirect: `${baseRoutePath}/cluster-recovery/cluster-sync/full`,
  },
  {
    path: `${baseRoutePath}/config/registry`,
    redirect: `${baseRoutePath}/config/registry/provider`,
  },
    {path: `${baseRoutePath}/database/backup`,
    redirect: `${baseRoutePath}/database/backup/plan`,
  },

  



  {
    path: `${baseRoutePath}/application`,
    name: '应用管理',
    icon: 'icon-poc_maindata',
    routes: [
      {
        path: `${baseRoutePath}/application/all`,
        name: '全部应用',
        component: '@/pages/application/all-application',
      },
      {
        path: `${baseRoutePath}/application/view-log`,
        name: '日志详情',
        key: 'appList',
        hideInMenu: true,
        component: '@/pages/application/view-log',
      },
      {
        path: `${baseRoutePath}/application/list`,
        name: '应用列表',
        key: 'appList',
        component: '@/pages/application/application-list',
      },
      {
        path: `${baseRoutePath}/application/detail`,
        name: '应用详情',
        key: 'appList',
        hideInMenu: true,
        component: '@/pages/application/application-detail',
        routes: [
          {
            path: `${baseRoutePath}/application/detail/overview`,
            name: '概述',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/application-overview',
          },
          {
            path: `${baseRoutePath}/application/detail/envManage`,
            name: '环境管理',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/application-envManage',
          },
          {
            path: `${baseRoutePath}/application/detail/traffic-detail`,
            name: '应用监控',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/traffic-detail',
          },
          {
            path: `${baseRoutePath}/application/detail/appDeploy`,
            name: '应用部署',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/application-deploy',
          },
          {
            path: `${baseRoutePath}/application/detail/deployInfo`,
            name: '部署信息',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/deploy-info',
          },
          {
            path: `${baseRoutePath}/application/detail/container-info`,
            name: '容器信息',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/deploy-info/container-info',
          },
          {
            path: `${baseRoutePath}/application/detail/loginShell`,
            name: '登陆shell',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/deploy-info/login-shell',
          },
          {
            path: `${baseRoutePath}/application/detail/viewLog`,
            name: '查看日志',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/deploy-info/view-log',
          },
          {
            path: `${baseRoutePath}/application/detail/branch`,
            name: '分支',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/branch-manage',
          },
          {
            path: `${baseRoutePath}/application/detail/configMgr`,
            name: '配置管理',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/config-parameters-manage',
          },
          {
            path: `${baseRoutePath}/application/detail/launchParameters`,
            name: '启动参数',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/config-parameters-manage',
          },
          {
            path: `${baseRoutePath}/application/detail/AppParameters`,
            name: '应用参数',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/application-params',
          },
          {
            path: `${baseRoutePath}/application/detail/pipeLineTmpl`,
            name: '流水线模版',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/pipeline-tmpl',
          },
          {
            path: `${baseRoutePath}/application/detail/addConfig`,
            name: '新增配置',
            key: 'appList',
            component: '@/pages/application/application-detail/components/add-config-parameters',
          },
          {
            path: `${baseRoutePath}/application/detail/addLaunchParameters`,
            name: '新增启动参数',
            key: 'appList',
            component: '@/pages/application/application-detail/components/add-config-parameters',
          },
          {
            path: `${baseRoutePath}/application/detail/secondPartyPkg`,
            name: '二方包',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/second-party-pkg',
          },
          {
            path: `${baseRoutePath}/application/detail/feVersion`,
            name: '版本管理',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/fe-versions',
          },
          {
            path: `${baseRoutePath}/application/detail/routeConfig`,
            name: '路由配置',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/route-config',
          },
          {
            path: `${baseRoutePath}/application/detail/changeDetails`,
            name: '路由配置',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/change-details',
          },
        ],
      },
      {
        path: `${baseRoutePath}/application/project-environment`,
        name: '项目环境',
        key: 'project-environment',
        component: '@/pages/application/project-environment',
      },
      {
        path: `${baseRoutePath}/application/environment-detail`,
        name: '项目环境详情',
        key: 'project-environment',
        component: '@/pages/application/project-environment/environment-detail',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/application/environment-deploy`,
        name: '项目环境部署',
        key: 'project-environment',
        component: '@/pages/application/project-environment/environment-deploy',
        hideInMenu: true,
        routes: [
          {
            path: `${baseRoutePath}/application/environment-deploy/overview`,
            name: '概述',
            key: 'project-environment',
            hideInMenu: true,
            component: '@/pages/application/project-environment/environment-deploy/components/application-overview',
          },
          {
            path: `${baseRoutePath}/application/environment-deploy/appDeploy`,
            name: '项目环境部署',
            key: 'project-environment',
            hideInMenu: true,
            component: '@/pages/application/project-environment/environment-deploy/components/application-deploy',
          },
          {
            path: `${baseRoutePath}/application/environment-deploy/deployInfo`,
            name: '部署信息',
            key: 'project-environment',
            hideInMenu: true,
            component: '@/pages/application/project-environment/environment-deploy/components/deploy-info',
          },
          {
            path: `${baseRoutePath}/application/environment-deploy/container-info`,
            name: '容器信息',
            key: 'project-environment',
            hideInMenu: true,
            component:
              '@/pages/application/project-environment/environment-deploy/components/deploy-info/container-info',
          },
          {
            path: `${baseRoutePath}/application/environment-deploy/loginShell`,
            name: '登陆shell',
            key: 'project-environment',
            hideInMenu: true,
            component: '@/pages/application/project-environment/environment-deploy/components/deploy-info/login-shell',
          },
          {
            path: `${baseRoutePath}/application/environment-deploy/viewLog`,
            name: '查看日志',
            key: 'project-environment',
            hideInMenu: true,
            component: '@/pages/application/project-environment/environment-deploy/components/deploy-info/view-log',
          },
          {
            path: `${baseRoutePath}/application/environment-deploy/branch`,
            name: '分支',
            key: 'project-environment',
            hideInMenu: true,
            component: '@/pages/application/project-environment/environment-deploy/components/branch-manage',
          },
          {
            path: `${baseRoutePath}/application/environment-deploy/AppParameters`,
            name: '应用模板',
            key: 'project-environment',
            hideInMenu: true,
            component: '@/pages/application/project-environment/environment-deploy/components/application-params',
          },
          {
            path: `${baseRoutePath}/application/environment-deploy/feVersion`,
            name: '版本管理',
            key: 'project-environment',
            hideInMenu: true,
            component: '@/pages/application/project-environment/environment-deploy/components/fe-versions',
          },
          {
            path: `${baseRoutePath}/application/environment-deploy/routeConfig`,
            name: '路由配置',
            key: 'project-environment',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/route-config',
          },
          {
            path: `${baseRoutePath}/application/environment-deploy/changeDetails`,
            name: '路由配置',
            key: 'project-environment',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/change-details',
          },
        ],
      },
      {
        path: `${baseRoutePath}/application/version-management`,
        name: '主干版本',
        key: 'version-management',
        component: '@/pages/application/version-management',
      },
      {
        path: `${baseRoutePath}/application/dependency-manage`,
        name: '依赖管理',
        key: 'dependency-manage',
        component: '@/pages/application/dependency-manage',
      },
      {
        path: `${baseRoutePath}/application/npm-list`,
        name: 'NPM管理',
        component: '@/pages/npm-manage/list',
      },
      {
        path: `${baseRoutePath}/application/npm-detail`,
        name: 'NPM详情',
        component: '@/pages/npm-manage/detail',
        hideInMenu: true,
        routes: [
          {
            path: `${baseRoutePath}/application/npm-detail/overview`,
            name: '概述',
            hideInMenu: true,
            component: '@/pages/npm-manage/detail/components/overview',
          },
          {
            path: `${baseRoutePath}/application/npm-detail/branch`,
            name: '分支',
            hideInMenu: true,
            component: '@/pages/npm-manage/detail/components/branch-manage',
          },
          {
            path: `${baseRoutePath}/application/npm-detail/deploy`,
            name: '部署',
            hideInMenu: true,
            component: '@/pages/npm-manage/detail/components/deploy',
          },
          {
            path: 'version',
            name: '部署',
            hideInMenu: true,
            component: '@/pages/npm-manage/detail/components/versions-manage',
          },
        ],
      },
    ],
  },
  {
    "path": `${baseRoutePath}/version-manage`,
    "name": "版本管理",
    "icon": "icon-Textarea",
    "routes": [
      {
        'path': `${baseRoutePath}/version-manage/list`,
        'key': "version-list",
        "name": "版本列表",
        "component": "@/pages/version-manage/version-list",
      },
      {
        "path": `${baseRoutePath}/version-manage/detail`,
        "name": "版本详情",
        "key": "version-detail",
        "component": "@/pages/version-manage/version-detail",
      },
    ]
  },
  {
    path: `${baseRoutePath}/DBMS`,
    name: '数据管理',
    icon: 'icon-Detail',
    routes: [
      {
        path: `${baseRoutePath}/DBMS/authority-manage`,
        name: '权限管理',
        key: 'authority-manage',
        component: '@/pages/DBMS/authority-manage',
        routes: [
          {
            path: `${baseRoutePath}/DBMS/authority-manage/authority-apply`,
            name: '权限申请',
            key: 'authority-manage',
            component: '@/pages/DBMS/authority-manage/components/authority-apply',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/DBMS/authority-manage/my-authority`,
            name: '我的权限',
            key: 'authority-manage',
            component: '@/pages/DBMS/authority-manage/components/my-authority',
            hideInMenu: true,
          },
        ],
      },
      {
        path: `${baseRoutePath}/DBMS/data-query`,
        name: '数据查询',
        key: 'data-query',
        component: '@/pages/DBMS/data-query',
      },

      {
        path: `${baseRoutePath}/DBMS/data-change`,
        name: '数据变更',
        key: 'data-change',
        component: '@/pages/DBMS/data-change',
      },
      {
        path: `${baseRoutePath}/DBMS/approval-end`,
        name: '工单详情-审批结束',
        key: 'data-change',
        component: '@/pages/DBMS/data-change/components/approval-end',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/DBMS/ddl-detail`,
        name: '工单详情-结构变更',
        key: 'data-change',
        component: '@/pages/DBMS/data-change/components/ddl-detail',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/DBMS/change-apply`,
        name: '数据变更申请',
        key: 'data-change',
        component: '@/pages/DBMS/data-change/components/change-apply',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/DBMS/struct-apply`,
        name: '结构变更申请',
        key: 'data-change',
        component: '@/pages/DBMS/data-change/components/struct-apply',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/DBMS/safe-rule`,
        name: '安全规则',
        key: 'safe-rule',
        component: '@/pages/DBMS/safe-rule',
        routes: [
          {
            path: `${baseRoutePath}/DBMS/safe-rule/safe-list`,
            name: '安全规则',
            key: 'safe-rule',
            component: '@/pages/DBMS/safe-rule/components/safe-list',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/DBMS/safe-rule/instance-list`,
            name: '实例规则',
            key: 'safe-rule',
            component: '@/pages/DBMS/safe-rule/components/instance-list',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    path: `${baseRoutePath}/config`,
    name: '微服务组件',
    icon: 'icon-Time',
    routes: [
      {
        path: `${baseRoutePath}/config/nacos-config`,
        name: '配置中心',
        key: 'nacos-config',
        component: '@/pages/config/nacos-config',
        routes: [
          {
            path: `${baseRoutePath}/config/nacos-config/nacos`,
            name: 'nacos配置',
            key: 'nacos-config',
            component: '@/pages/config/nacos-config/components/nacos',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/config/nacos-config/namespace`,
            name: '命名空间',
            key: 'nacos-config',
            component: '@/pages/config/nacos-config/components/namespace',
            hideInMenu: true,
          },
        ],
      },
      {
        path: `${baseRoutePath}/config/registry`,
        name: '注册中心',
        key: 'registry',
        component: '@/pages/config/registry-center',
        routes: [
          {
            path: `${baseRoutePath}/config/registry/provider`,
            name: '生产者列表',
            key: 'registry',
            component: '@/pages/config/registry-center/providers-list',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/config/registry/consumer`,
            name: '消费者列表',
            key: 'registry',
            component: '@/pages/config/registry-center/consumers-list',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/config/registry/subscriber`,
            name: '订阅实例列表',
            key: 'registry',
            component: '@/pages/config/registry-center/subscribers-list',
            hideInMenu: true,
          },
        ],
      },
      {
        path: `${baseRoutePath}/config/registry/service-detail`,
        name: '服务详情',
        key: 'registry',
        hideInMenu: true,
        component: '@/pages/config/registry-center/service-detail',
      }
    ],
  },
  {
    path: `${baseRoutePath}/publish`,
    name: '项目管理',
    icon: 'icon-exit',
    routes: [
      {
        path: `${baseRoutePath}/publish/function`,
        key: 'function',
        name: '发布功能',
        component: '@/pages/publish/function',
        exact: true,
      },
      {
        path: `${baseRoutePath}/publish/function/addFunction`,
        name: '新增发布功能',
        key: 'function',
        hideInMenu: true,
        component: '@/pages/publish/function/function-add',
      },
      {
        path: `${baseRoutePath}/publish/function/editFunction`,
        name: '编辑发布功能',
        key: 'function',
        hideInMenu: true,
        component: '@/pages/publish/function/function-edit',
      },
      {
        path: `${baseRoutePath}/publish/function/checkFunction`,
        name: '查看发布功能',
        key: 'function',
        hideInMenu: true,
        component: '@/pages/publish/function/function-check',
      },
      {
        path: `${baseRoutePath}/publish/plan`,
        name: '发布计划',
        key: 'plan',
        exact: true,
        component: '@/pages/publish/plan',
      },
      {
        path: `${baseRoutePath}/publish/plan/addConfigModify`,
        name: '新增发布计划',
        key: 'plan',
        hideInMenu: true,
        component: '@/pages/publish/plan/config-modify/add-modify',
      },
      {
        path: `${baseRoutePath}/publish/plan/editConfigModify`,
        name: '编辑发布计划',
        key: 'plan',
        hideInMenu: true,
        component: '@/pages/publish/plan/config-modify/edit-modify',
      },
      {
        path: `${baseRoutePath}/publish/plan/checkConfigModify`,
        name: '查看发布计划',
        key: 'plan',
        hideInMenu: true,
        component: '@/pages/publish/plan/config-modify/check-modify',
      },
      {
        path: `${baseRoutePath}/publish/apply`,
        name: '发布申请',
        component: '@/pages/publish/apply',
      },
    ],
  },
  {
    path: `${baseRoutePath}/ticket`,
    name: '工单管理',
    icon: 'icon-report',
    routes: [
      {
        path: `${baseRoutePath}/ticket/list`,
        name: '运维工单',
        key: 'ticketList',
        component: '@/pages/ticket/ticket-list',
      },
    ],
  },
  {
    path: `${baseRoutePath}/monitor`,
    name: '监控管理',
    icon: 'icon-poc_index',
    routes: [
      {
        path: `${baseRoutePath}/monitor/dashboard`,
        name: '监控大盘',
        component: '@/pages/monitor/dashboard',
      },
      {
        path: `${baseRoutePath}/monitor/panel`,
        name: '基础监控',
        component: '@/pages/monitor/board',
      },
      {
        path: `${baseRoutePath}/monitor/detail`,
        name: '监控大盘详情',
        hideInMenu: true,
        component: '@/pages/monitor/board/board-detail',
      },
      // {
      //   "path": `${baseRoutePath}/monitor/board`,
      //   "name": '集群监控',
      //   "component": '@/pages/monitor/cluster',
      //   "hideInMenu": true,
      // },
      // {
      //   "path": `${baseRoutePath}/monitor/application`,
      //   "name": '应用监控',
      //   "component": '@/pages/monitor/application',
      // },
      {
        path: `${baseRoutePath}/monitor/business`,
        name: '业务监控',
        key: 'business-monitor',
        component: '@/pages/monitor/business/index',
      },
      {
        path: `${baseRoutePath}/monitor/fe-monitor`,
        name: '前端监控',
        component: '@/pages/fe-monitor/basic/index',
      },
      {
        "path": `${baseRoutePath}/monitor/network-dail`,
        "name": "网络拨测",
        "component": "@/pages/monitor/network-dail",
        "key": "network-dail",

      },
      {
        "path": `${baseRoutePath}/monitor/dail-edit`,
        "name": "拨测编辑",
        "component": "@/pages/monitor/network-dail/edit-dail",
        "key": "network-dail",
        "hideInMenu": true,

      },
      {
        path: `${baseRoutePath}/monitor/prometheus-edit`,
        name: '编辑Prometheus',
        hideInMenu: true,
        component: '@/pages/monitor/business/prometheus/prometheus-form',
      },
      {
        path: `${baseRoutePath}/monitor/log-prometheus-edit`,
        name: '编辑日志监控',
        hideInMenu: true,
        component: '@/pages/monitor/business/log-prometheus/edit-page',
      },
      {
        path: `${baseRoutePath}/monitor/log-monitor`,
        name: '配置业务监控',
        key: 'business-monitor',
        component: '@/pages/monitor/business/log-monitor',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/monitor/dp-monitor-edit`,
        name: '配置数据库监控',
        key: 'dp-monitor-edit',
        component: '@/pages/monitor/business/dp-monitor-edit',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/monitor/alarm-rules`,
        name: '报警中心',
        component: '@/pages/monitor/alarm-center',
        key:'alarm-rules',
       
      },
      {
        path: `${baseRoutePath}/monitor/alarm-rules/group-push`,
        name: '报警分组推送',
        key: 'alarm-rules',
        component: '@/pages/monitor/alarm-group/group-push',
        hideInMenu: true,
      },

      {
        path: `${baseRoutePath}/monitor/template`,
        name: '监控配置',
        component: '@/pages/monitor/template-center',
      },
      // {
      //   "path": `${baseRoutePath}/monitor/history`,
      //   "name": "报警历史",
      //   "component": "@/pages/monitor/history"
      // }
    ],
  },
  {
    path: `${baseRoutePath}/logger`,
    name: '日志管理',
    icon: 'icon-diagnose',
    routes: [
      // {
      //   "path": `${baseRoutePath}/logger/search`,
      //   "name": "日志检索",
      //   "component": "@/pages/logger/search"
      // },
      {
        path: `${baseRoutePath}/logger/search`,
        name: '日志检索',
        component: '@/pages/logger/search-new',
      },
      {
        path: `${baseRoutePath}/logger/index-manage`,
        name: '索引管理',
        component: '@/pages/logger/index-manage',
      },
      {
        path: `${baseRoutePath}/logger/logger-alarm`,
        name: '日志告警',
        key: 'logger-alarm',
        component: '@/pages/logger/logger-alarm',
      },
    ],
  },
  {
    path: `${baseRoutePath}/trafficmap`,
    name: '流量地图',
    icon: 'icon-ic_flow',
    routes: [
      {
        path: `${baseRoutePath}/trafficmap/global-topo`,
        name: '全局拓扑',
        key: 'trafficmap-topo',
        component: '@/pages/trafficmap/global-topo',
      },
      {
        path: `${baseRoutePath}/trafficmap/app-traffic`,
        name: '应用监控',
        key: 'trafficmap-app',
        component: '@/pages/trafficmap/app-traffic',
      },
      {
        path: `${baseRoutePath}/trafficmap/traffic-detail`,
        name: '流量详情',
        key: 'trafficmap-app',
        component: '@/pages/trafficmap/app-traffic/traffic-detail',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/trafficmap/tracking`,
        name: '追踪',
        key: 'trafficmap-track',
        component: '@/pages/trafficmap/tracking',
      },
      {
        path: `${baseRoutePath}/trafficmap/config`,
        name: '配置',
        key: 'trafficmap-config',
        component: '@/pages/trafficmap/config',
        routes: [
          {
            path: `${baseRoutePath}/trafficmap/config/domain-config`,
            name: '域配置',
            key: 'trafficmap-config',
            component: '@/pages/trafficmap/config/component/domain-config',
          },
          {
            path: `${baseRoutePath}/trafficmap/config/noise-reduction`,
            name: '降噪配置',
            key: 'trafficmap-config',
            component: '@/pages/trafficmap/config/component/noise-reduction',
          },
        ],
      },
    ],
  },
  {
    path: `${baseRoutePath}/code`,
    name: '代码管理',
    icon: 'icon-code',
    routes: [
      {
        path: `${baseRoutePath}/code/rank`,
        name: '代码排行',
        component: '@/pages/code/rank',
      },
      {
        path: `${baseRoutePath}/code/details`,
        name: '统计详情',
        component: '@/pages/code/details',
      },
    ],
  },
  {
    path: `${baseRoutePath}/operation`,
    name: '运维管理',
    icon: 'icon-atomic',
    routes: [
      {
        path: `${baseRoutePath}/operation/app-tmpl`,
        name: '应用模版',
        key: 'app-tmpl',
        routes: [
          {
            path: `${baseRoutePath}/operation/app-tmpl/tmpl-list`,
            name: '应用模版列表',
            key: 'app-tmpl',
            component: '@/pages/operation/app-tmpl/tmpl-list',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/operation/app-tmpl/tmpl-create`,
            name: '应用模版编辑',
            key: 'app-tmpl',
            component: '@/pages/operation/app-tmpl/tmpl-create',
            hideInMenu: true,
          },

          {
            path: `${baseRoutePath}/operation/app-tmpl/push`,
            name: '推送模版',
            key: 'app-tmpl',
            component: '@/pages/operation/app-tmpl/push',
            hideInMenu: true,
          },
        ],
      },
      {
        path: `${baseRoutePath}/operation/pipeline-tmpl`,
        name: '流水线模版',
        key: 'pipeline-tmpl',
        component: '@/pages/operation/pipeline-tmpl',
      },
      {
        path: `${baseRoutePath}/operation/push-tmpl`,
        name: '推送流水线模版',
        key: 'pipeline-tmpl',
        component: '@/pages/operation/pipeline-tmpl/push-tmpl',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/operation/env-manage`,
        name: '环境管理',
        key: 'env-manage',
        routes: [
          {
            path: `${baseRoutePath}/operation/env-manage/env-list`,
            name: '环境列表',
            key: 'env-manage',
            component: '@/pages/operation/env-manage/env-list',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/operation/env-manage/push-env`,
            name: '推送环境',
            key: 'env-manage',
            component: '@/pages/operation/env-manage/push-env',
            hideInMenu: true,
          },
        ],
      },
      {
        path: `${baseRoutePath}/operation/ng-manage`,
        name: 'NG配置管理',
        key: 'ng-manage',
        routes: [
          {
            path: `${baseRoutePath}/operation/ng-manage/ng-list`,
            name: 'NG配置列表',
            key: 'ng-manage',
            component: '@/pages/operation/ng-manage/ng-list',
            hideInMenu: true,
          },
        ],
      },
      {
        path: `${baseRoutePath}/operation/label-manage`,
        name: '标签管理',
        key: 'label-manage',
        routes: [
          {
            path: `${baseRoutePath}/operation/label-manage/label-list`,
            name: '标签列表',
            key: 'label-manage',
            component: '@/pages/operation/label-manage/label-list',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/operation/label-manage/label-bind`,
            name: '绑定标签',
            key: 'label-manage',
            component: '@/pages/operation/label-manage/label-bind',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/operation/label-manage/label-unbound`,
            name: '解绑标签',
            key: 'label-manage',
            component: '@/pages/operation/label-manage/label-unbound',
            hideInMenu: true,
          },
        ],
      },
      {
        path: `${baseRoutePath}/operation/DNS-manage`,
        name: 'DNS管理',
        key: 'DNS-manage',
        component: '@/pages/operation/DNS-manage',
      },
      {
        path: `${baseRoutePath}/operation/task-manage`,
        name: '任务管理',
        key: 'task-manage',
        component: '@/pages/operation/task-manage',
      },
      {
        path: `${baseRoutePath}/operation/helm-manage`,
        name: 'Helm管理',
        key: 'helm-manage',
        routes: [
          {
            path: `${baseRoutePath}/operation/helm-manage/helm-list`,
            name: 'helm列表',
            key: 'helm-manage',
            component: '@/pages/operation/helm-manage/helm-list',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/operation/helm-manage/helm-detail`,
            name: 'helm详情',
            key: 'helm-manage',
            component: '@/pages/operation/helm-manage/helm-detail',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/operation/helm-manage/create-chart`,
            name: '创建chart',
            key: 'helm-manage',
            component: '@/pages/operation/helm-manage/create-chart',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    "path": `${baseRoutePath}/cluster-recovery`,
    "name": "集群容灾",
    "icon": "icon-Deploy",
    "routes": [
      {
        "path": `${baseRoutePath}/cluster-recovery/dashboards`,
        "name": "流量大盘",
        "key": "dashboards",
        "component": "@/pages/cluster-recovery-new/dashboards",
       
      },
      {
        "path": `${baseRoutePath}/cluster-recovery/scheduling`,
        "name": "流量调度",
        "key": "scheduling-mode",
        "component": "@/pages/cluster-recovery-new/scheduling",
        routes:[
          {
            "path": `${baseRoutePath}/cluster-recovery/scheduling/organ`,
            "name": "机构维度",
            "key": "scheduling-mode",
            "component": "@/pages/cluster-recovery-new/scheduling/organ",
            "hideInMenu": true
          },

          {
            "path": `${baseRoutePath}/cluster-recovery/scheduling/operator`,
            "name": "操作员维度",
            "key": "scheduling-mode",
            "component": "@/pages/cluster-recovery-new/scheduling/operator",
            "hideInMenu": true
          },
          {
            "path": `${baseRoutePath}/cluster-recovery/scheduling/user`,
            "name": "用户维度",
            "key": "scheduling-mode",
            "component": "@/pages/cluster-recovery-new/scheduling/user",
            "hideInMenu": true
          },

        ]
       
      },
      {
        "path": `${baseRoutePath}/cluster-recovery/cluster-sync`,
        "name": "集群同步",
        "key": "cluster-sync",
        "component": "@/pages/cluster-recovery-new/cluster-sync",
        routes:[
          {
            "path": `${baseRoutePath}/cluster-recovery/cluster-sync/full`,
            "name": "全量同步",
            "key": "cluster-sync",
            "component": "@/pages/cluster-recovery-new/cluster-sync/full",
            "hideInMenu": true
          },

          {
            "path": `${baseRoutePath}/cluster-recovery/cluster-sync/backend`,
            "name": "后端单应用同步",
            "key": "cluster-sync",
            "component": "@/pages/cluster-recovery-new/cluster-sync/backend",
            "hideInMenu": true
          },
          {
            "path": `${baseRoutePath}/cluster-recovery/cluster-sync/front`,
            "name": "前端单应用同步",
            "key": "cluster-sync",
            "component": "@/pages/cluster-recovery-new/cluster-sync/front",
            "hideInMenu": true
          },
          {
            "path": `${baseRoutePath}/cluster-recovery/cluster-sync/nacos`,
            "name": "Nacos配置同步",
            "key": "cluster-sync",
            "component": "@/pages/cluster-recovery-new/cluster-sync/nacos",
            "hideInMenu": true
          },
          {
            "path": `${baseRoutePath}/cluster-recovery/cluster-sync/policy`,
            "name": "同步策略",
            "key": "cluster-sync",
            "component": "@/pages/cluster-recovery-new/cluster-sync/policy",
            "hideInMenu": true
          },

        ]
        
      },
      {
        "path": `${baseRoutePath}/cluster-recovery/cluster-sync-detail`,
        "name": "集群同步详情",
        "key": "sync-detail",
        "component": "@/pages/cluster-recovery-new/cluster-sync/sync-detail",
        "hideInMenu": true
      
      },
      {
        "path": `${baseRoutePath}/cluster-recovery/district-manage`,
        "name": "机构管理",
        "key": "district-manage",
        "component": "@/pages/cluster-recovery-new/district-manage",
      },
      {
        "path": `${baseRoutePath}/cluster-recovery/operation-log`,
        "name": "操作记录",
        "key": "operation-log",
        "component": "@/pages/cluster-recovery-new/operation-log",
       
      },
     
    ]
  },

  {
    "path": `${baseRoutePath}/station`,
    "name": "建站管理",
    "icon": "icon-activity",
    "routes": [
      {
        path: `${baseRoutePath}/station/product-list`,
        name: '产品列表',
        key: 'product-list',
        component: '@/pages/station/product-list',
      },
      {
        path: `${baseRoutePath}/station/product-description`,
        name: '产品描述',
        key: 'product-list',
        component: '@/pages/station/product-list/product-description',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/station/version-detail`,
        name: '版本详情',
        key: 'product-list',
        component: '@/pages/station/product-list/version-detail',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/station/component-center`,
        name: '组件中心',
        key: 'component-center',
        component: '@/pages/station/component-center',
      },
      {
        path: `${baseRoutePath}/station/component-detail`,
        name: '组件详情',
        key: 'component-center',
        component: '@/pages/station/component-center/component-detail',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/station/product-management`,
        name: '制品管理',
        key: 'product-management',
        component: '@/pages/station/product-management',
      },
      {
        path: `${baseRoutePath}/station/product-config`,
        name: '配置建站参数',
        key: 'product-management',
        component: '@/pages/station/product-management/product-config',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/station/component-tmpl`,
        name: '组件模版',
        key: 'component-tmpl',
        component: '@/pages/station/component-tmpl',
      },
    ],
  },
  {
    path: `${baseRoutePath}/cluster`,
    name: '双集群管理',
    icon: 'icon-extension',
    routes: [
      {
        path: `${baseRoutePath}/cluster/cluster-zy`,
        name: '浙一双集群管理',
        key: 'cluster-cluster-zy',
        component: '@/pages/cluster/cluster-zy',
        routes: [
          {
            path: `${baseRoutePath}/cluster/cluster-zy/dashboards`,
            name: '集群看板',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/dashboards',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zy/scheduling`,
            name: '流量调度',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/scheduling',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zy/cluster-sync`,
            name: '集群同步',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/cluster-sync',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zy/cluster-sync-detail`,
            name: '集群同步',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/cluster-sync/sync-detail',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zy/application-sync`,
            name: '应用同步',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/application-sync',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zy/operation-log`,
            name: '操作记录',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/operation-log',
            hideInMenu: true,
          },
        ],
      },
      {
        path: `${baseRoutePath}/cluster/cluster-tt`,
        name: '天台双集群管理',
        key: 'cluster-clusterTt',
        component: '@/pages/cluster/cluster-tt',
        routes: [
          {
            path: `${baseRoutePath}/cluster/cluster-tt/dashboards`,
            name: '集群看板',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/dashboards',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-tt/scheduling`,
            name: '流量调度',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/scheduling',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-tt/cluster-sync`,
            name: '集群同步',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/cluster-sync',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-tt/cluster-sync-detail`,
            name: '集群同步',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/cluster-sync/sync-detail',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-tt/application-sync`,
            name: '应用同步',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/application-sync',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-tt/operation-log`,
            name: '操作记录',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/operation-log',
            hideInMenu: true,
          },
        ],
      },
      {
        path: `${baseRoutePath}/cluster/cluster-zs`,
        name: '流量调度',
        key: 'cluster-clusterZs',
        component: '@/pages/cluster/cluster-zs',
        routes: [
          {
            path: `${baseRoutePath}/cluster/cluster-zs/dashboards`,
            name: '集群看板',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/dashboards',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zs/scheduling-mode`,
            name: '流量调度',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/scheduling-mode',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zs/cluster-sync`,
            name: '集群同步',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/cluster-sync',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zs/cluster-sync-detail`,
            name: '集群同步',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/cluster-sync/sync-detail',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zs/application-sync`,
            name: '应用同步',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/application-sync',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zs/application-sync-front`,
            name: '前端应用同步',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/application-sync-front',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zs/operation-log`,
            name: '操作记录',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/operation-log',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/cluster/cluster-zs/district-manage`,
            name: '机构管理',
            key: 'district-manage',
            component: '@/pages/cluster/cluster-zs/district-manage',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    path: `${baseRoutePath}/pedestal`,
    name: '基座管理',
    icon: 'icon-dataset',
    routes: [
      {
        path: `${baseRoutePath}/pedestal/volume-detail`,
        name: '卷详情',
        key: 'storage-manage',
        component: '@/pages/pedestal/storage-manage/volume-detail',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/pedestal/cluster-info`,
        name: '集群概览',
        key: 'cluster-info',
        component: '@/pages/pedestal/cluster-info',
      },
      {
        path: `${baseRoutePath}/pedestal/view-log`,
        name: '查看日志',
        key: 'cluster-detail',
        component: '@/pages/pedestal/cluster-detail/load-detail/view-log',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/pedestal/login-shell`,
        name: '登陆shell',
        key: 'cluster-detail',
        component: '@/pages/pedestal/cluster-detail/load-detail/login-shell',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/pedestal/cluster-detail`,
        name: '集群详情',
        key: 'cluster-detail',
        component: '@/pages/pedestal/cluster-detail',
        routes: [
          {
            path: `${baseRoutePath}/pedestal/cluster-detail/node-list`,
            name: '节点列表',
            key: 'cluster-detail',
            component: '@/pages/pedestal/cluster-detail/node-list',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/pedestal/cluster-detail/resource-detail`,
            name: '资源详情',
            key: 'cluster-detail',
            component: '@/pages/pedestal/cluster-detail/resource-detail',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/pedestal/cluster-detail/hpa`,
            name: '弹性伸缩',
            key: 'cluster-detail',
            component: '@/pages/pedestal/cluster-detail/hpa',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/pedestal/cluster-detail/resource-statistics`,
            name: '资源详情',
            key: 'cluster-detail',
            component: '@/pages/pedestal/cluster-detail/resource-statistics',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/pedestal/cluster-detail/event-warning`,
            name: '资源详情',
            key: 'cluster-detail',
            component: '@/pages/pedestal/cluster-detail/event-warning',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/pedestal/cluster-detail/task-manage`,
            name: '任务管理',
            key: 'cluster-detail',
            component: '@/pages/pedestal/cluster-detail/task-manage',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/pedestal/cluster-detail/load-detail`,
            name: '工作负载',
            key: 'cluster-detail',
            component: '@/pages/pedestal/cluster-detail/load-detail',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/pedestal/cluster-detail/pods`,
            name: 'pod详情',
            key: 'cluster-detail',
            component: '@/pages/pedestal/cluster-detail/load-detail/pods-detail',
            hideInMenu: true,
          },
          {
            path: 'detail',
            name: 'configmap详情',
            key: 'cluster-detail',
            component: '@/pages/pedestal/cluster-detail/resource-detail/cs-detail',
            hideInMenu: true,
          },
          { redirect: 'resource-detail' },
        ],
      },
      {
        path: `${baseRoutePath}/pedestal/storage-manage`,
        name: '存储管理',
        key: 'storage-manage',
        component: '@/pages/pedestal/storage-manage',

        routes: [
          {
            path: `${baseRoutePath}/pedestal/storage-manage/storage-dashboard`,
            name: '存储大盘',
            key: 'storage-manage',
            component: '@/pages/pedestal/storage-manage/storage-dashboard',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/pedestal/storage-manage/node-manage`,
            name: '节点管理',
            key: 'storage-manage',
            hideInMenu: true,
            component: '@/pages/pedestal/storage-manage/node-manage',
          },
          {
            path: `${baseRoutePath}/pedestal/storage-manage/volume-manage`,
            name: '卷管理',
            key: 'storage-manage',
            component: '@/pages/pedestal/storage-manage/volume-manage',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    path: `${baseRoutePath}/display`,
    name: '数据分析',
    icon: 'icon-dataset',
    routes: [
      {
        path: `${baseRoutePath}/display/main`,
        name: '实战分析',
        key: 'display',
        component: '@/pages/display',
      },
    ],
  },

  {
    path: `${baseRoutePath}/database`,
    name: '数据库管理',
    icon: 'icon-TableSettings',
    routes: [
      {
        path: `${baseRoutePath}/database/overview`,
        name: '概览',
        key: 'overview',
        component: '@/pages/database/overview',
      },
      {
        path: `${baseRoutePath}/database/info`,
        name: '实例详情',
        key: 'instance-list',
        component: '@/pages/database/instance-list/components/instance-info',
        hideInMenu: true,
        routes:[
          {
            path: `${baseRoutePath}/database/info/detail`,
            name: '实例详情',
            key: 'instance-list',
            component: '@/pages/database/instance-list/components/instance-info/components/instance-detail',
          },
          {
            path: `${baseRoutePath}/database/info/trend`,
            name: '性能趋势',
            key: 'instance-list',
            component: '@/pages/database/overview/trends',
          },
          {
            path: `${baseRoutePath}/database/info/database`,
            name: '数据库管理',
            key: 'instance-list',
            component: '@/pages/database/database-manage',
          },
          {
            path: `${baseRoutePath}/database/info/session`,
            name: '会话管理',
            key: 'instance-list',
            component: '@/pages/database/instance-list/components/instance-info/components/session-diag',
          },
          {
            path: `${baseRoutePath}/database/info/account`,
            name: '账号管理',
            key: 'instance-list',
            component: '@/pages/database/account-manage',
          },
         

        ]
      },
      {
        path: `${baseRoutePath}/database/cluster-list`,
        name: '集群列表',
        key: 'cluster-list',
        component: '@/pages/database/cluster-list',
      },
      {
        path: `${baseRoutePath}/database/instance-list`,
        name: '实例列表',
        key: 'instance-list',
        component: '@/pages/database/instance-list',
      },
      {
        path: `${baseRoutePath}/database/backup`,
        name: '备份管理',
        key: 'backup',
        component: '@/pages/database/backup',
        routes:[
          {
            path: `${baseRoutePath}/database/backup/plan`,
            name: '备份计划',
            key: 'backup',
            component: '@/pages/database/backup/backup-plan',
            hideInMenu: true,
          },
          {
            path: `${baseRoutePath}/database/backup/record`,
            name: '备份记录',
            key: 'backup',
            component: '@/pages/database/backup/backup-record',
            hideInMenu: true,
          },
        ]
      }
    ],
  },
  {
    path: `${baseRoutePath}/admin`,
    name: '管理员菜单',
    icon: 'icon-userRecent',
    routes: [
      {
        path: `${baseRoutePath}/admin/user`,
        name: '用户管理',
        key: 'user',
        component: '@/pages/admin/user-manage',
      },
      {
        path: `${baseRoutePath}/admin/create-user`,
        name: '新建用户',
        key: 'user',
        component: '@/pages/admin/user-manage/create-user',
        hideInMenu: true,
      },
      {
        path: `${baseRoutePath}/admin/main`,
        name: '主页管理',
        key: 'main',
        component: '@/pages/admin/article-manage',
      },
      {
        path: `${baseRoutePath}/admin/tmpl-log`,
        name: '操作日志',
        key: 'tmpl-log',
        component: '@/pages/operation/tmpl-log',
      },
    ],
  },
  {
    path: '*',
    name: 'NOT FOUND',
    hideInMenu: true,
    component: '@/pages/index/page-404',
  },
] as IRouteItem[];

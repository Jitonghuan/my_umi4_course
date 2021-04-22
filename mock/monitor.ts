export default {
  // 集群列表
  'GET /v1/monitorManage/cluster': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: [
      { id: '1', clusterName: '浙一医院1' },
      { id: '2', clusterName: '天台医院2' },
      { id: '3', clusterName: '浙一医院3' },
      { id: '4', clusterName: '天台医院4' },
      { id: '5', clusterName: '浙一医院5' },
      { id: '6', clusterName: '天台医院6' },
      { id: '7', clusterName: '浙一医院7' },
      { id: '8', clusterName: '天台医院8' },
      { id: '9', clusterName: '浙一医院9' },
      { id: '10', clusterName: '天台医院10' },
    ],
  },
  // 资源使用率
  'GET /v1/monitorManage/resource/clusterTotal': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      clusterAlertsNum: 31,
      clusterAvgCpu: 20.86,
      clusterAvgDisk: 52.93,
      clusterAvgMemory: 62.73,
      clusterDeploymentNum: 962,
      clusterNodeNum: 20,
      clusterPodNum: 1592,
    },
  },
  // 节点使用率
  'GET /v1/monitorManage/resource/node': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      '192.168.54.108:9100': {
        cpuCoreNum: '8',
        cpuUsageRate: 14.09,
        diskUsageRate: 79.08,
        hostname: 'master0003',
        load: 0.31,
        memoryTotal: 15.41,
        memoryUsageRate: 21.25,
        upTime: 267,
      },
      '192.168.54.109:9100': {
        cpuCoreNum: '16',
        cpuUsageRate: 11.13,
        diskUsageRate: 71.34,
        hostname: 'node0006',
        load: 1.52,
        memoryTotal: 30.91,
        memoryUsageRate: 61.08,
        upTime: 266,
      },
      '192.168.54.110:9100': {
        cpuCoreNum: '16',
        cpuUsageRate: 17.11,
        diskUsageRate: 71.08,
        hostname: 'node0003',
        load: 1.96,
        memoryTotal: 61.92,
        memoryUsageRate: 73.58,
        upTime: 266,
      },
    },
  },
  // 接入的数据大盘
  'GET /v1/monitorManage/grafana/dashboard': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      Home: 'https://grafana.seenew.info/grafana/d/home/home',
      Kubernetes概览:
        'https://grafana.seenew.info/grafana/d/dev-k8s-overview/kubernetesgai-lan',
      '【dev】- Kubernetes容器副本':
        'https://grafana.seenew.info/grafana/d/1855283466460174-7453-223/dev-kubernetesrong-qi-fu-ben',
      '【tt-prd】- Alerts':
        'https://grafana.seenew.info/grafana/d/pbHjqZzmk/tt-prd-alerts',
    },
  },

  'GET /v1/monitorManage/app/list': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: [
      { id: '1', appName: '浙一医院1', appCode: '1' },
      { id: '2', appName: '天台医院2', appCode: '2' },
      { id: '3', appName: '浙一医院3', appCode: '3' },
      { id: '4', appName: '天台医院4', appCode: '4' },
      { id: '5', appName: '浙一医院5', appCode: '5' },
      { id: '6', appName: '天台医院6', appCode: '6' },
      { id: '7', appName: '浙一医院7', appCode: '7' },
      { id: '8', appName: '天台医院8', appCode: '8' },
      { id: '9', appName: '浙一医院9', appCode: '9' },
      { id: '10', appName: '天台医院10', appCode: '10' },
    ],
  },

  'GET /v1/monitorManage/env/list': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: [
      { id: '1', envName: 'test', envCode: 'test' },
      { id: '2', envName: 'dev', envCode: 'dev' },
      { id: '3', envName: 'cis', envCode: 'cis' },
    ],
  },

  'GET /v1/monitorManage/app/podInfo': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: [
      {
        ip: '192.168.54.108:9100',
        cpuCoreNum: '8',
        cpuUsageRate: 14.09,
        diskUsageRate: 79.08,
        hostname: 'master0003',
        load: 0.31,
        memoryTotal: 15.41,
        memoryUsageRate: 21.25,
        upTime: 267,
      },
      {
        ip: '192.168.54.109:9100',
        cpuCoreNum: '16',
        cpuUsageRate: 11.13,
        diskUsageRate: 71.34,
        hostname: 'node0006',
        load: 1.52,
        memoryTotal: 30.91,
        memoryUsageRate: 61.08,
        upTime: 266,
      },
      {
        ip: '192.168.54.110:9100',
        cpuCoreNum: '16',
        cpuUsageRate: 17.11,
        diskUsageRate: 71.08,
        hostname: 'node0003',
        load: 1.96,
        memoryTotal: 61.92,
        memoryUsageRate: 73.58,
        upTime: 266,
      },
    ],
  },

  'GET /v1/monitorManage/app/gcCount': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {},
  },

  'GET /v1/monitorManage/app/gcTime': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {},
  },

  'GET /v1/monitorManage/app/jvmHeap': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {},
  },

  'GET /v1/monitorManage/app/jvmMetaspace': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {},
  },
};

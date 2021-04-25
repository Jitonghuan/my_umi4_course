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

  'GET /v1/monitorManage/app/env': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: ['hbos-dev', 'hbos-test'],
  },

  'GET /v1/monitorManage/app/podInfo': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: [
      {
        cpu: 0.69,
        disk: 0.01,
        health: 1,
        hostIP: '10.100.124.159',
        hostName: 'hbos-dtc-7f7dffb998-wnlfw',
        memory: 8.27,
        restartNum: 0,
        uptime: 0,
      },
    ],
  },

  'GET /v1/monitorManage/app/gcCount': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      fullGCCount: [
        [1619343808.322, '0'],
        [1619343868.322, '0'],
        [1619343928.322, '0'],
        [1619343988.322, '0'],
      ],
      fullGCSum: [
        [1619343808.322, '4'],
        [1619343868.322, '4'],
        [1619343928.322, '4'],
        [1619343988.322, '4'],
      ],
      youngGCCount: [
        [1619343808.322, '2'],
        [1619343868.322, '1.999000499750125'],
        [1619343928.322, '0'],
        [1619343988.322, '0'],
      ],
      youngGCSum: [
        [1619343808.322, '45'],
        [1619343868.322, '47'],
        [1619343928.322, '47'],
        [1619343988.322, '48'],
      ],
    },
  },

  'GET /v1/monitorManage/app/gcTime': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      fullGCTime: [
        [1619343808.323, '0'],
        [1619343868.323, '0'],
        [1619343928.323, '0'],
        [1619343988.323, '0'],
      ],
      fullGCTimeSum: [
        [1619343808.323, '0.653'],
        [1619343868.323, '0.653'],
        [1619343928.323, '0.653'],
        [1619343988.323, '0.653'],
      ],
      youngGCTime: [
        [1619343808.323, '0.03600000000000003'],
        [1619343868.323, '0.04197901049475244'],
        [1619343928.323, '0'],
        [1619343988.323, '0'],
      ],
      youngGCTimeSum: [
        [1619343808.323, '1.302'],
        [1619343868.323, '1.341'],
        [1619343928.323, '1.341'],
        [1619343988.323, '1.363'],
      ],
    },
  },

  'GET /v1/monitorManage/app/jvmHeap': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      heapEdenSpace: [
        [1619343808.324, 295.34],
        [1619343868.324, '75.41822052001953'],
        [1619343928.324, '251.93450927734375'],
        [1619343988.324, '148.418212890625'],
      ],
      heapMemSum: [
        [1619343808.324, 170.2],
        [1619343868.324, '204.14667510986328'],
        [1619343928.324, '380.3551712036133'],
        [1619343988.324, '275.9550476074219'],
      ],
      heapOldGen: [
        [1619343808.324, 92.63],
        [1619343868.324, '93.14769744873047'],
        [1619343928.324, '93.14769744873047'],
        [1619343988.324, '93.1867904663086'],
      ],
      heapSurvivorSpace: [
        [1619343808.324, 7.39],
        [1619343868.324, '10.707473754882812'],
        [1619343928.324, '10.707473754882812'],
        [1619343988.324, '10.187667846679688'],
      ],
    },
  },

  'GET /v1/monitorManage/app/jvmMetaspace': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      metaspace: [
        [1619343808.324, 108.95],
        [1619343868.324, '112.65153503417969'],
        [1619343928.324, '112.79752349853516'],
        [1619343988.324, '112.80381774902344'],
        [1619344048.324, '112.87494659423828'],
      ],
    },
  },
};

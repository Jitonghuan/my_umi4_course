

export const envTypeData = [
    {
      key: 'dev',
      label: 'DEV',
      value: 'dev',
    },
    {
      key: 'test',
      label: 'TEST',
      value: 'test',
    },
    {
      key: 'pre',
      label: 'PRE',
      value: 'pre',
    },
    {
      key: 'prod',
      label: 'PROD',
      value: 'prod',
    },
  ]; //环境大类
  export const rulesOptions = [
    {
      key: 2,
      value: 2,
      label: '警告',
    },
    {
      key: 3,
      value: 3,
      label: '严重',
    },
    {
      key: 4,
      value: 4,
      label: '灾难',
    },
  ];
  
  export const silenceOptions = [
    {
      key: 1,
      value: 1,
      label: '是',
    },
    {
      key: 0,
      value: 0,
      label: '否',
    },
  ];
  
  export const editColumns = [
    {
      title: '键（点击可修改）',
      dataIndex: 'key',
      editable: true,
      width: '45%',
    },
    {
      title: '值（点击可修改）',
      dataIndex: 'value',
      key: 'value',
      editable: true,
      width: '45%',
    },
  ];
  
  export const ALERT_LEVEL: Record<string, { text: string; value: number }> = {
    '2': { text: '警告', value: 2 },
    '3': { text: '严重', value: 3 },
    '4': { text: '灾难', value: 4 },
  };
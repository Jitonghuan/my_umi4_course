import React from 'react';

type IModuleType = 'commitNo' | 'filePath' | 'app';

const typeEnumMap = {
  commitNo: '姓名',
  filePath: '文件名',
  app: '应用名称',
};

// table 通用配置
export const getTableColumns = (type: IModuleType) => [
  {
    dataIndex: 'no',
    title: '排名',
    width: 50,
    ellipsis: true,
    render: (val: number) => <span>TOP{val}</span>,
  },
  {
    dataIndex: 'rankingListKey',
    title: typeEnumMap[type],
    width: 150,
    copyable: true,
    showTooltip: true,
    ellipsis: true,
  },
  {
    dataIndex: 'rankingListValue',
    title: '数量',
    width: 50,
    ellipsis: true,
  },
];

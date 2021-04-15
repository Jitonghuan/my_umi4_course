const mockTableData = [
  {
    Id: 1,
    ticketCode: '123456',
    title: '张三-运维权限申请-阿里云',
    ticketType: '运维权限申请',
    ticketSubType: '阿里云',
    env: '天台',
    line: 'g3a',
    remark: '天气真好',
    status: 4,
    info: '',
    createUser: '高晨光',
    modifyUser: '高晨光',
    gmtCreate: '2020-12-15 13:21:25',
    gmtModify: '2020-12-15 13:21:25',
    deleted: 0,
    dbRemark: '',
  },
  {
    Id: 2,
    ticketCode: '234567',
    title: '张三-运维权限申请-JumpServer',
    ticketType: '运维权限申请',
    ticketSubType: 'JumpServer',
    env: '天台',
    line: 'g3a',
    remark: '天气真好',
    status: 2,
    info: '',
    createUser: '高晨光',
    modifyUser: '高晨光',
    gmtCreate: '2020-12-15 13:21:25',
    gmtModify: '2020-12-15 13:21:25',
    deleted: 0,
    dbRemark: '',
  },
];

export default {
  // 工单查询接口
  [`GET /v1/ticketManage/list`]: {
    success: true,
    data: {
      dataSource: mockTableData,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: mockTableData.length,
      },
    },
  },
  // 工单状态类型
  ['GET /v1/ticketManage/getOptions']: {
    success: true,
    data: {
      资源申请: ['ECS', 'RDS'],
      运维权限申请: ['阿里云', 'Rancher', 'VPN', 'JumpServer'],
    },
  },
};

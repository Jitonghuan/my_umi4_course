import { Button } from 'antd';
import { history } from 'umi';

export const columns = [
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '事件原因',
    dataIndex: 'reason',
  },
  {
    title: '事件信息',
    dataIndex: 'message',
  },
  {
    title: '最后更新',
    dataIndex: 'lastUpdateTime',
  },
];

export const containerColumns = [
  {
    title: '容器名称',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '容器状态',
    dataIndex: 'reason',
  },
  {
    title: '容器镜像',
    dataIndex: 'message',
  },
  {
    title: '重启次数',
    dataIndex: 'lastUpdateTime',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    render: (text: string, record: any, index: number) => (
      <>
        <Button
          size="small"
          type="primary"
          onClick={
            () => {}
            // history.push(
            //     `/matrix/application/detail/viewLog?appCode=${appData?.appCode}&envCode=${currentEnvData}&instName=${record?.instName}&viewLogEnvType=${envTypeCode}`,
            // )
          }
        >
          查看日志
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            // history.push(
            //     `/matrix/application/detail/loginShell?appCode=${appData?.appCode}&envCode=${currentEnvData}&instName=${record?.instName}`,
            // );
          }}
        >
          登陆shell
        </Button>
      </>
    ),
  },
];

import { datetimeCellRender } from '@/utils';
import { FormProps } from '@/components/table-search/typing';
import { Space, Popconfirm, Tooltip, Switch } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import JavaLogo from '@/assets/imgs/Python-logo.svg';
import PythonLogo from '@/assets/imgs/java-logo.png';
import GolangLogo from '@/assets/imgs/go-logo.svg';
// 列表页-表格
export const createTableColumns = (params: {
  
    onView: (record: any, index: number) => void;
    onAlertConfig: (record: any, index: number) => void;
    
  }) => {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
      },
      {
        title: '应用名称',
        dataIndex: 'appName',
        key: 'appName',
        width: 200,
      },
      {
        title: 'appCode',
        dataIndex: 'appCode',
        key: 'title',
        width: 200,
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: 'CPU',
        dataIndex: 'cpu',
        key: 'cpu',
        width: 200,
        render: (value) => <>{} </>,
      },
      {
        title: '内存',
        dataIndex: 'memeory',
        key: 'memeory',
        width: 200,
        render: (value) => <>{} </>,
      },
      {
        title: '请求总数（5min)',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 200,
        render: (value) => <>{} </>,
      },
      {
        title: '平均RT（5min)',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 200,
        render: (value) => <>{} </>,
      },
      {
        title: '成功率（5min)',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 200,
        render: (value) => <>{} </>,
      },
      {
        title: '失败数（5min)',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 200,
        render: (value) => <>{} </>,
      },
      {
        title: '状态',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 200,
        render: (value) => <>{} </>,
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        fixed:"right",
        width: 180,
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
            <a onClick={() => params.onView(record, index)}>详情</a>
            <a onClick={() => params.onAlertConfig(record, index)}>告警配置</a>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };
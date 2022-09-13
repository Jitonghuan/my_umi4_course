import { Space, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';

export const formOptions: FormProps[] = [
   
    {
      key: '1',
      type: 'select',
      label: '工单状态',
      dataIndex: 'appCode',
      width: '160px',
      placeholder: '请选择',
      showSelectSearch: true,
      option:[],
     
    },
    {
      key: '2',
      type: 'select',
      label: '变更库',
      dataIndex: 'envCode',
      width: '160px',
      showSelectSearch: true,
      option:[],
    },
    {
        key: '2',
        type: 'select',
        label: '申请人',
        dataIndex: 'envCode',
        width: '160px',
        showSelectSearch: true,
        option:[],
      },
    {
      key: '3',
      type: 'input',
      label: '申请原因',
      dataIndex: 'metricsUrl',
      width: '160px',
      placeholder: '请输入',
    },
  ];


// 列表页-表格
export const createTableColumns = (params: {
  onDetail: (record: any, index: number) => void;
}) => {
  return [
    {
      title: '工单号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '申请原因',
      dataIndex: 'name',
      key: 'name',
      width: '14%',
    },
    {
      title: '变更库',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '当前状态',
      dataIndex: 'mobile',
      key: 'mobile',
      width: '28%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
        title: '申请人',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '当前处理人',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '创建时间',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '最后操作时间',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      

    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '14%',
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space>
          <a onClick={() => params.onDetail(record, index)}>详情</a>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
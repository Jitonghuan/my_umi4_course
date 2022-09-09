import { Space, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';

export const formOptions: FormProps[] = [
   
    {
      key: '1',
      type: 'select',
      label: '用户',
      dataIndex: 'appCode',
      width: '160px',
      placeholder: '请选择',
      showSelectSearch: true,
      option:[],
     
    },
    {
      key: '2',
      type: 'select',
      label: '实例',
      dataIndex: 'envCode',
      width: '160px',
      showSelectSearch: true,
      option:[],
    },
    {
        key: '3',
        type: 'select',
        label: '数据库',
        dataIndex: 'envCode',
        width: '160px',
        showSelectSearch: true,
        option:[],
      },
  ];


// 列表页-表格
export const createTableColumns = (params: {
    onDelete: (record: any, index: number) => void;
}) => {
  return [
    {
      title: '用户',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '对象类型',
      dataIndex: 'name',
      key: 'name',
      width: '14%',
    },
    {
      title: '实例',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '数据库',
      dataIndex: 'mobile',
      key: 'mobile',
      width: '28%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
        title: '结果集限制',
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
        title: '过期时间',
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
        <Space>
          <a onClick={() => params.onDelete(record, index)}>删除权限</a>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
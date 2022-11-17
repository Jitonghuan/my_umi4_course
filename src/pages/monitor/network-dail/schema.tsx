import { datetimeCellRender } from '@/utils';
import { FormProps } from '@/components/table-search/typing';
import { Space, Popconfirm, Tooltip, Switch } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import {
    PlusOutlined,
    BarChartOutlined,
    FormOutlined,
    DeleteOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
  } from '@ant-design/icons';

// 列表页-查询表单
export const createFormColumns = (params: { onTypeChange: (value: string) => void }) => {
  return [
    {
      key: '1',
      type: 'select',
      label: '集群选择',
      dataIndex: 'type',
      width: '200px',
      placeholder: '请选择',
      option: [],
      onChange: params.onTypeChange,
    },
    {
      key: '2',
      type: 'input',
      label: '拨测名称',
      dataIndex: 'type',
      width: '200px',
      placeholder: '请输入',
     
    },
    {
      key: '3',
      type: 'input',
      label: '拨测地址',
      dataIndex: 'type',
      width: '200px',
      placeholder: '请输入',
     
    },
    {
      key: '4',
      type: 'input',
      label: '拨测类型',
      dataIndex: 'type',
      width: '200px',
      placeholder: '请输入',
     
    },
    {
      key: '5',
      type: 'input',
      label: '状态',
      dataIndex: 'type',
      width: '200px',
      placeholder: '请输入',
     
    },
  ] as FormProps[];
};

// 列表页-表格
export const createTableColumns = (params: {
  onEdit: (record: any, index: number) => void;
  onView: (record: any, index: number) => void;
  onDelete: (record: any) => void;
 
}) => {
  return [
    {
      title: '拨测ID',
      dataIndex: 'id',
      key: 'id',
      width: '4%',
    },
    {
      title: '拨测名称',
      dataIndex: 'type',
      key: 'type',
      width: '14%',
    },
    {
      title: '拨测地址',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
        title: '拨测类型',
        dataIndex: 'title',
        key: 'title',
        width: '10%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '采集频率',
        dataIndex: 'title',
        key: 'title',
        width: '10%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '拨测状态',
        dataIndex: 'title',
        key: 'title',
        width: '10%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
     
     
     
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '12%',
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space>
          <a onClick={() => params.onView(record, index)}><BarChartOutlined/>看板</a>
          <a onClick={() => params.onEdit(record, index)}><FormOutlined />编辑</a>
          <a onClick={() => params.onEdit(record, index)}><PlayCircleOutlined />停止</a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params?.onDelete(record.id);
            }}
          >
            <a><DeleteOutlined />删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};

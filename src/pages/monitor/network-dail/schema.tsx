import { datetimeCellRender } from '@/utils';
import { FormProps } from '@/components/table-search/typing';
import { Space, Popconfirm, Tooltip, Spin,Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import {
    PlusOutlined,
    BarChartOutlined,
    FormOutlined,
    DeleteOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
  } from '@ant-design/icons';


// 列表页-表格
export const createTableColumns = (params: {
  delLoading:boolean;
  onEdit: (record: any, index: number) => void;
  onView: (record: any, index: number) => void;
  onDelete: (record: any) => void;
 
}) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '4%',
    },
    {
      title: '拨测名称',
      dataIndex: 'probeName',
      key: 'probeName',
      width: '14%',
    },
    {
      title: '拨测地址',
      dataIndex: 'probeUrl',
      key: 'probeUrl',
      width: '20%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
        title: '拨测类型',
        dataIndex: 'probeType',
        key: 'probeType',
        width: '10%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '采集频率',
        dataIndex: 'probeInterval',
        key: 'probeInterval',
        width: '10%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '拨测状态',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        ellipsis: true,
        render: (status) => <Tag color={status===0?"green":"red"}>{status===0?"开启":"停止"}</Tag>,
      },
     
     
     
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '16%',
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space size="middle">
          <a onClick={() => params.onView(record, index)}><BarChartOutlined/>看板</a>
          <a onClick={() => params.onEdit(record, index)}><FormOutlined />编辑</a>
          <a onClick={() => params.onEdit(record, index)}><PlayCircleOutlined />停止</a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params?.onDelete(record.id);
            }}
          >
           <Spin spinning={ params?.delLoading}><a><DeleteOutlined />删除</a></Spin> 
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};

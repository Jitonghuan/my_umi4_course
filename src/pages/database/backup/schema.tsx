import { datetimeCellRender } from '@/utils';
import { FormProps } from '@/components/table-search/typing';
import { Space, Popconfirm, Tooltip, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

// 列表页-表格
export const createTableColumns = (params: {
    onEdit: (record: any, index: number) => void;
    // onView: (record: any, index: number) => void;
    onDelete: (record: any) => void;
   
  }) => {
    return [
      {
        title: '备份计划名称',
        dataIndex: 'backupName',
        key: 'backupName',
        width: '14%',
      },
      {
        title: '集群/库表',
        dataIndex: 'backupObj',
        key: 'backupObj',
        width: '14%',
      },
      
      {
        title: '备份类型',
        dataIndex: 'backupType',
        key: 'backupType',
        // width: '20%',
        
      },
      {
        title: '备份周期',
        dataIndex: 'backupCycle',
        key: 'backupCycle',
        width: '10%',
       
      },
      {
        title: '备份时间',
        dataIndex: 'backupTime',
        key: 'backupTime',
        width: '10%',
       
      },
      {
        title: '备份保留时间',
        dataIndex: 'storeTime',
        key: 'storeTime',
        width: '10%',
       
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        width: '12%',
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
          
            <a onClick={() => params.onEdit(record, index)}>编辑</a>
            <Popconfirm
              title="确认删除?"
              onConfirm={() => {
                params?.onDelete(record.id);
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };
  
  export const createRecordTableColumns = () => {
    return [
      {
        title: '备份计划名称',
        dataIndex: 'backupName',
        key: 'backupName',
        width: '33%',
      },
      {
        title: '备份集群/库表',
        dataIndex: 'backupObj',
        key: 'backupObj',
        width: '33%',
      },
    
      {
        title: '备份类型',
        dataIndex: 'backupType',
        key: 'backupType',
        width: '33%',
        // render: (value) => <>{datetimeCellRender(value)} </>,
      },
      // {
      //   title: '备份开始时间',
      //   dataIndex: 'backupStart',
      //   key: 'backupStart',
      //   width: '10%',
       
      // },
      // {
      //   title: '备份结束时间',
      //   dataIndex: 'backupEnd',
      //   key: 'backupEnd',
      //   width: '10%',
       
      // },
      // {
      //   title: '备份大小',
      //   dataIndex: 'backupSize',
      //   key: 'backupSize',
      //   width: '10%',
       
      // },
      // {
      //   title: '备份状态',
      //   dataIndex: 'backupState',
      //   key: 'backupState',
      //   width: '10%',
      //   render:(value)=>{
      //     return <Tag color={value==="已完成"?"green":"default"}>{value}</Tag>
      //   }
       
      // },
     
    ] as ColumnsType<any>;
  };

  export const checkboxOption=[
    {
    label:'星期一',
    value:'1',
   },
   {
    label:'星期二',
    value:'2',
   },
   {
    label:'星期三',
    value:'3',
   },
   {
    label:'星期四',
    value:'4',
   },
   {
    label:'星期五',
    value:'5',

   },
   {
    label:'星期六',
    value:'6',
   },
   {
    label:'星期日',
    value:'7',
   },
]
  
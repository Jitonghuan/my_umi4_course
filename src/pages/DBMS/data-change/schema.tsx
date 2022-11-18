import { Space, Popconfirm, Tooltip,Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { datetimeCellRender } from '@/utils';
import {CurrentStatusStatus} from '../authority-manage/components/authority-apply/schema'
export const statusOptions=[
  {
    label:"已正常结束",
    value:"finish",
    key:"finish",
  },
  {
    label:"审批取消",
    value:"abort",
    key:"abort",
  },
  {
    label:"待审批",
    value:"manReviewing",
    key:"manReviewing",
  },
  {
    label:"审批拒绝",
    value:"reject",
    key:"reject",
  },
  {
    label:"审批通过",
    value:"reviewPass",
    key:"reviewPass",
  },
  {
    label:"定时执行",
    value:"timingTask",
    key:"timingTask"
   
  },
  {
    label:"排队中",
    value:"queuing",
    key:"queuing"
  },
  {
    label:"执行中",
    value:"executing",
    key:"executing",
  },
  {
    label:"自动审批不通过",
    value:"autoReviewWrong",
    key:"autoReviewWrong",
  },
  {
    label:"执行有异常",
    value:"exception",
    key:"exception",
  },


]
export const createDataFormItems = (params: {
  // currentStatusOptions?: any[];
  userNameOptions?: any[];
  
}) => {
  return [
    {
      key: '1',
      type: 'select',
      label: '工单状态',
      dataIndex: 'currentStatus',
      width: '160px',
      placeholder: '请选择',
      showSelectSearch: true,
      option:statusOptions,
      renderLabel:true,
     
    },
    {
      key: '2',
      type: 'select',
      label: '工单类别',
      dataIndex: 'wfUserType',
      width: '160px',
      placeholder: '请选择',
      showSelectSearch: true,
      option:privWfTypeOptions,
      renderLabel:true,
     
    },
    
    {
        key: '3',
        type: 'select',
        label: '申请人',
        dataIndex: 'userName',
        width: '160px',
        showSelectSearch: true,
        option:params?.userNameOptions,
      },
    {
      key: '4',
      type: 'input',
      label: '标题',
      dataIndex: 'title',
      width: '160px',
      placeholder: '请输入',
    },
  ] as FormProps[];
};


export const privWfTypeOptions=[
  {
    label:"我发起的",
    value:"creator",
    key:"creator",
  },
  {
    label:"我审批的",
    value:"auditor",
    key:"auditor",
  },
 
]
// 列表页-表格
export const createTableColumns = (params: {
  dataSource:any,
  onDetail: (record: any, index: number) => void;
}) => {
  return [
    {
      title: '工单号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '工单类别',
      dataIndex: 'wfUserType',
      key: 'wfUserType',
      width: 120,
      //"我审批的"
       render: (wfUserType) =>  <Tag color={wfUserType==="我审批的"?"#2db7f5":"pink"}>{wfUserType}</Tag>,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 280,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '实例',
      dataIndex: 'instanceName',
      key: 'instanceName',
      width: 170,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '变更库',
      dataIndex: 'dbCode',
      key: 'dbCode',
      width:180,
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    //syntaxType
    {
      title: '类型',
      dataIndex: 'sqlWfType',
      key: 'sqlWfType',
      width:110,
      ellipsis: true,
      render: (text) => <Tooltip title={text==="sql"?"数据变更":"结构变更"}>{text==="sql"?<Tag color="purple">数据变更</Tag>:<Tag color="cyan">结构变更</Tag>}</Tooltip>,
    },
    {
      title: '当前状态',
      dataIndex: 'currentStatusDesc',
      key: 'currentStatusDesc',
      width: 180,
      ellipsis: true,
      render: (text,record:any) => <Tooltip title={text}><Tag color={CurrentStatusStatus[record?.currentStatus]?.tagColor||"default"}>{text}</Tag></Tooltip>
    },
    {
      title: '当前处理人',
      dataIndex: 'audit',
      key: 'audit',
      // width: '10%',
      width: 280,
      ellipsis: {
        showTitle: false,
      },
      render: (users,record,index) => {
       
        return (
          <>
          {users?.map((item:any)=>{
            return( <Tag color="#108ee9">{item} </Tag>)
          })}
        
          </>
          
          
        )
      }
    },
    {
        title: '申请人',
        dataIndex: 'userName',
        key: 'userName',
        width: 120,
        ellipsis: true,
        render: (user) =>  <Tag color="#2db7f5">{user}</Tag>,
      },
     
      {
        title: '创建时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 200,
        ellipsis: true,
        render: (value) => <>{datetimeCellRender(value)} </>,
      },
      {
        title: '最后操作时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 200,
        ellipsis: true,
        render: (value) => <>{datetimeCellRender(value)} </>,
      },
      

    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      align: 'center',
      width: 90,
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space>
          <a onClick={() => params.onDetail(record, index)}>详情</a>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
import { Space, Popconfirm, Tooltip ,Tag} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { datetimeCellRender } from '@/utils';

type CurrentStatusStatusTypeItem = {
  tagColor: string;
  tagText: string;
  
};

export const CurrentStatusStatus :Record<string, CurrentStatusStatusTypeItem>={
  "finish":{tagColor:"success",tagText:"已正常结束"},
  "abort":{tagColor:"warning",tagText:"人工终止流程"},
  "manReviewing":{tagColor:"processing",tagText:"待审核"},
  "reviewPass":{tagColor:"green",tagText:"审核通过"},
  "timingTask":{tagColor:"cyan",tagText:"定时执行"},  
  "queuing":{tagColor:"blue",tagText:"排队中"},
  "executing":{tagColor:"geekblue",tagText:"执行中"},
  "autoReviewWrong":{tagColor:"error",tagText:"自动审核不通过"},
  "exception":{tagColor:"volcano",tagText:"执行有异常"},
}
export const currentStatusOptions=[
  {
    label:"已正常结束",
    value:"finish"
  },
  {
    label:"人工终止流程",
    value:"abort"
  },
  {
    label:"待审核",
    value:"manReviewing"
  },
  {
    label:"审核通过",
    value:"reviewPass"
  },
  {
    label:"定时执行",
    value:"timingTask"
  },
  {
    label:"排队中",
    value:"queuing"
  },
  {
    label:"执行中",
    value:"executing"
  },
  {
    label:"自动审核不通过",
    value:"autoReviewWrong"
  },
  {
    label:"执行有异常",
    value:"exception"
  },


]

type PrivWfTypeItem = {
  tagColor: string;
  tagText: string;
  
};

export const PrivWfType :Record<string, PrivWfTypeItem>={
  "owner":{tagColor:"#87d068",tagText:"owner权限"},
  "database":{tagColor:"#2db7f5",tagText:"数据库权限"},
  "table":{tagColor:"magenta",tagText:"表权限"},
  "limit":{tagColor:"purple",tagText:"查询条数限制权限"},
  
}

export const createFormItems = (params: {
  currentStatusOptions?: any[];
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
      option:params?.currentStatusOptions,
     
    },
    {
      key: '2',
      type: 'select',
      label: '申请人',
      dataIndex: 'userName',
      width: '160px',
      showSelectSearch: true,
      option:params?.userNameOptions,
    },
    {
      key: '3',
      type: 'input',
      label: '标题',
      dataIndex: 'title',
      width: '160px',
      placeholder: '请输入',
    },
  ] as FormProps[];
};

export const formOptions: FormProps[] = [
   
    {
      key: '1',
      type: 'select',
      label: '工单状态',
      dataIndex: 'currentStatus',
      width: '160px',
      placeholder: '请选择',
      showSelectSearch: true,
      option:[],
     
    },
    {
      key: '2',
      type: 'select',
      label: '申请人',
      dataIndex: 'userName',
      width: '160px',
      showSelectSearch: true,
      option:[],
    },
    {
      key: '3',
      type: 'input',
      label: '标题',
      dataIndex: 'title',
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
      dataIndex: 'InstanceId',
      key: 'InstanceId',
      width: '7%',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '13%',
    },
    {
      title: '申请原因',
      dataIndex: 'remark',
      key: 'remark',
      width: '10%',
    },
    {
      title: '对象类型',
      dataIndex: 'privWfTypeDesc',
      key: 'privWfTypeDesc',
      width: '10%',
     
      render: (text,record:any) => <Tooltip title={text}><Tag color={PrivWfType[record?.privWfType]?.tagColor||"default"}>{text}</Tag></Tooltip>,
    },
    {
      title: '当前状态',
      dataIndex: 'currentStatusDesc',
      key: 'currentStatusDesc',
      width: '12%',
     
      render: (text,record:any) => <Tooltip title={text}><Tag color={CurrentStatusStatus[record?.currentStatus]?.tagColor||"default"}>{text}</Tag></Tooltip>,
    },
    {
        title: '申请人',
        dataIndex: 'userName',
        key: 'userName',
        width: '10%',
        ellipsis: true,
        render: (user) =>  <Tag color="#2db7f5">{user}</Tag>,
      },
      {
        title: '当前处理人',
        dataIndex: 'audit',
        key: 'audit',
        width: '10%',
        ellipsis: true,
        render: (users,record) => {
          let auditUsers=[];
          if(record?.audit?.length>0&&record?.audit[0]?.AuditStatus==="wait"){
            auditUsers=record?.audit?.AuditStatus?.Groups 
          }
          // auditUsers?.length>0?auditUsers?.map():"暂无",
          return (
            <>
            {auditUsers?.length>0?auditUsers?.map((item:string)=>{
             <Tag color="#108ee9">{item}</Tag>
            }):"暂无"}

            </>
            
            
          )
        }
      },
      {
        title: '最后操作时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: '15%',
        ellipsis: true,
        render: (value) => <><Tooltip title={datetimeCellRender(value)}>{datetimeCellRender(value)}</Tooltip> </>,
      },
      {
        title: '时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: '15%',
        ellipsis: true,
        render: (value) => <><Tooltip title={datetimeCellRender(value)}>{datetimeCellRender(value)}</Tooltip></>,
      },

    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'option',
      key: 'option',
     
      width: 100,
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space>
          <a onClick={() => params.onDetail(record, index)}>详情</a>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
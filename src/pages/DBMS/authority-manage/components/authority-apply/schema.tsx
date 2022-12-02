import { Space,  Tooltip ,Tag} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, } from '@/components/table-search/typing';
import { datetimeCellRender } from '@/utils';

type CurrentStatusStatusTypeItem = {
  tagColor: string;
  tagText: string;
  
};

export const CurrentStatusStatus :Record<string, CurrentStatusStatusTypeItem>={
  "finish":{tagColor:"success",tagText:"已正常结束"},
  "abort":{tagColor:"yellow",tagText:"审批撤销"},
  "reject":{tagColor:"red",tagText:"审批拒绝"},
  "manReviewing":{tagColor:"processing",tagText:"待审批"},
  "reviewPass":{tagColor:"green",tagText:"审批通过"},
  "timingTask":{tagColor:"cyan",tagText:"定时执行"},  
  "queuing":{tagColor:"blue",tagText:"排队中"},
  "executing":{tagColor:"geekblue",tagText:"执行中"},
  "autoReviewWrong":{tagColor:"error",tagText:"自动审批不通过"},
  "exception":{tagColor:"#f50",tagText:"执行有异常"},
}
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
export const currentStatusOptions=[
  {
    label:"已正常结束",
    value:"finish",
    key:"finish",
  },
  {
    label:"审批拒绝",
    value:"reject",
    key:"reject",
  },
  {
    label:"审批撤销",
    value:"abort",
    key:"abort",
  },
  {
    label:"待审批",
    value:"manReviewing",
    key:"manReviewing",
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
export const currentApplyStatusOptions=[
 
  {
    label:"审批拒绝",
    value:"reject",
    key:"reject",
  },
  {
    label:"审批撤销",
    value:"abort",
    key:"abort",
  },
  {
    label:"待审批",
    value:"manReviewing",
    key:"manReviewing",
  },
  {
    label:"审批通过",
    value:"reviewPass",
    key:"reviewPass",
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
      option:currentStatusOptions,
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



// 列表页-表格
export const createTableColumns = (params: {
  dataSource:any
  onDetail: (record: any, index: number) => void;
}) => {
  return [
    {
      title: '工单号',
      dataIndex: 'id',
      key: 'id',
      // width: '7%',
      width: 80,
    },
    {
      title: '工单类别',
      dataIndex: 'wfUserType',
      key: 'wfUserType',
      // width: '10%',
      width: 120,
      //"我审批的"
       render: (wfUserType) =>  <Tag color={wfUserType==="我审批的"?"#2db7f5":"pink"}>{wfUserType}</Tag>,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      // width: '13%',
      width: 280,
    },
    {
      title: '对象类型',
      dataIndex: 'privWfTypeDesc',
      key: 'privWfTypeDesc',
      // width: '10%',
      width: 160,
     
      //render: (text,record:any) => <Tooltip title={text}><Tag color={PrivWfType[record?.privWfType]?.tagColor||"default"}>{text}</Tag></Tooltip>,
    },
    {
      title: '当前状态',
      dataIndex: 'currentStatusDesc',
      key: 'currentStatusDesc',
      // width: '12%',
      width: 180,
     
      render: (text,record:any) => <Tooltip title={text}><Tag color={CurrentStatusStatus[record?.currentStatus]?.tagColor||"default"}>{text}</Tag></Tooltip>,
    },
    {
      title: '申请原因',
      dataIndex: 'remark',
      key: 'remark',
      // width: '10%',
      width: 320,
    },
   
   
    {
        title: '申请人',
        dataIndex: 'userName',
        key: 'userName',
        // width: '10%',
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        render: (user) =>  <Tag color="#2db7f5">{user}</Tag>,
      },
      {
        title: '当前处理人',
        dataIndex: 'currentAudits',
        key: 'currentAudits',
        // width: '10%',
        width: 280,
        ellipsis: {
          showTitle: false,
        },
        render:(users,record,index)=>{
          if(users&&users?.length>0){
                return (
            <>
            {users?.map((item:any)=>{
              return( <Tag color="#108ee9">{item} </Tag>)
            })}
          
            </>)
            
          }


        }

        // render: (users,record,index) => {
         
        //   return (
        //     <>
        //     {users?.map((item:any)=>{
        //       return( <Tag color="#108ee9">{item} </Tag>)
        //     })}
          
        //     </>
            
            
        //   )
        // }
      },
      {
        title: '最后操作时间',
        dataIndex: 'endTime',
        key: 'endTime',
        // width: '15%',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (value) => <><Tooltip title={datetimeCellRender(value)}>{datetimeCellRender(value)}</Tooltip> </>,
      },
      {
        title: '创建时间',
        dataIndex: 'startTime',
        key: 'startTime',
        // width: '15%',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (value) => <><Tooltip title={datetimeCellRender(value)}>{datetimeCellRender(value)}</Tooltip></>,
      },

    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'option',
      key: 'option',
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
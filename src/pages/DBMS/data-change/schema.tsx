import { Space, Popconfirm, Tooltip,Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { datetimeCellRender } from '@/utils';
import {CurrentStatusStatus} from '../authority-manage/components/authority-apply/schema'

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
      label: '变更库',
      dataIndex: 'dbCode',
      width: '160px',
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
        option:params?.userNameOptions,
      },
    {
      key: '3',
      type: 'input',
      label: '申请原因',
      dataIndex: 'remark',
      width: '160px',
      placeholder: '请输入',
    },
  ] as FormProps[];
};


// 列表页-表格
export const createTableColumns = (params: {
  onDetail: (record: any, index: number) => void;
}) => {
  return [
    {
      title: '工单号',
      dataIndex: 'instanceId',
      key: 'instanceId',
      width: '10%',
    },
    {
      title: '申请原因',
      dataIndex: 'remark',
      key: 'remark',
      width: '14%',
    },
    {
      title: '变更库',
      dataIndex: 'dbCode',
      key: 'dbCode',
      width: '30%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '当前状态',
      dataIndex: 'currentStatusDesc',
      key: 'currentStatusDesc',
      width: '28%',
      ellipsis: true,
      render: (text,record:any) => <Tooltip title={text}><Tag color={CurrentStatusStatus[record?.currentStatus]?.tagColor||"default"}>{text}</Tag></Tooltip>
    },
    {
        title: '申请人',
        dataIndex: 'userName',
        key: 'userName',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      // {
      //   title: '当前处理人',
      //   dataIndex: 'audit',
      //   key: 'audit',
      //   width: '28%',
      //   ellipsis: true,
      //   render: (users,record) => {
      //     let auditUsers=[];
      //     if(record?.audit?.AuditStatus==="wait"){
      //       auditUsers=record?.audit?.AuditStatus?.Groups 
      //     }
      //     // auditUsers?.length>0?auditUsers?.map():"暂无",
      //     return (
      //       <>
      //       {auditUsers?.length>0?auditUsers?.map((item:string)=>{
      //         <Tag>{item}</Tag>
      //       }):"暂无"}

      //       </>
            
            
      //     )
      //   }
      // },
      {
        title: '创建时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: '28%',
        ellipsis: true,
        render: (value) => <>{datetimeCellRender(value)} </>,
      },
      {
        title: '最后操作时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: '28%',
        ellipsis: true,
        render: (value) => <>{datetimeCellRender(value)} </>,
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
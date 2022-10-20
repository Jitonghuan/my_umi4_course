import { Tooltip,message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import {SnippetsOutlined} from "@ant-design/icons"
import { CopyToClipboard } from 'react-copy-to-clipboard';

// 列表页-表格
export const createTableColumns = (
  params: {
    disabled:boolean
    onCopy: (record: any, index: number,) => void;
   
  }

) => {
  console.log("-----disabled----",params?.disabled)
 
  return [
    {
      title: '执行时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: '12%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: '8%',
    },
    {
      title: '实例',
      dataIndex: 'instanceName',
      key: 'instanceName',
      width: '10%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '库',
      dataIndex: 'dbCode',
      key: 'dbCode',
      width: '14%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
        title: 'sql语句',
        dataIndex: 'sqlContent',
        key: 'sqlContent',
        width: '22%',
        ellipsis: true,
        render: (text,record,index) =>(
        <> {console.log("=======flag=====",params?.disabled)}
          {params?.disabled?<span>{text}</span>: <a  onClick={()=>{
             params?.onCopy(record, index)}}>{text}</a>}
       
          
        </>)},
      {
        title: '结果行数',
        dataIndex: 'affectedRow',
        key: 'affectedRow',
        width: '8%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '耗时',
        dataIndex: 'costTime',
        key: 'costTime',
        width: '10%',
        ellipsis: true,
        render: (text) => <Tooltip title={`${text} s`}>{`${text} s`}</Tooltip>,
      },
      //sqlOriginalContent
      {
        title: 'sql原语句',
        dataIndex: 'sqlOriginalContent',
        key: 'sqlOriginalContent',
        width: '14%',
        ellipsis: true,
        render: (text) => <Tooltip title={`${text} s`}>{`${text} s`}</Tooltip>,
      },
     
  ] as ColumnsType<any>;
};
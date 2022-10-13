import { Space, Popconfirm, Tooltip,message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import {SnippetsOutlined} from "@ant-design/icons"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FormProps, OptionProps } from '@/components/table-search/typing';

// 列表页-表格
export const createTableColumns = (
  params: {
    onCopy: (record: any, index: number) => void;
  }
) => {
 
  return [
    {
      title: '复制',
      dataIndex: 'copy',
      key: 'copy',
      width: '8%',
      align:"center",
      render: (text,record,index) => (
        <CopyToClipboard text={JSON.stringify(record||{})} onCopy={() =>{
          message.success('已复制此条数据！')
          params?.onCopy(record, index)
        }}>
          <SnippetsOutlined style={{color:"#3591ff"}} />
      </CopyToClipboard>
      
      ),
    },
    {
      title: '执行时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: '18%',
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: '10%',
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
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
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
        width: '8%',
        ellipsis: true,
        render: (text) => <Tooltip title={`${parseInt(text)}s`}>{`${parseInt(text)}s`}</Tooltip>,
      },
     
  ] as ColumnsType<any>;
};
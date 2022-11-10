import { datetimeCellRender } from '@/utils';
import { FormProps } from '@/components/table-search/typing';
import { Space, Popconfirm, Tooltip, Switch } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import JavaLogo from '@/assets/imgs/java-logo.png';
import PythonLogo from '@/assets/imgs/Python-logo.svg';
import GolangLogo from '@/assets/imgs/go-logo.svg';
type languageTypeItem = {
  icon:React.ReactNode;
  text: string;
};
const LANGUAGE_TYPE: Record<string, [React.ReactNode]> = {
  java: [ <img src={JavaLogo} alt="" />],
  python: [<img src={PythonLogo} alt="" />],
  golang:[ <img src={GolangLogo} alt="" />],
};



// 列表页-表格
export const createTableColumns = (params: {
  
    onView: (record: any, index: number) => void;
    onAlertConfig: (record: any, index: number) => void;
    
  }) => {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
      },
      {
        title: '应用名称',
        dataIndex: 'appName',
        key: 'appName',
        width: 200,
        sorter: {
          compare: (a: any, b: any) => a.appName.localeCompare(b.appName),
        },
        render: (text,record) => {return <>
        <span >
          {
          record?.language==="java"? <img src={JavaLogo} height={18} width={18} alt="" />
         : record?.language==="python"?<img src={PythonLogo} height={18} width={18} alt="" />:
         record?.language==="golang"?<img src={GolangLogo} height={18} width={18} alt="" />:null
           }</span><span style={{marginLeft:8}}>{text}</span> </>}, 

      },
      {
        title: 'AppCode',
        dataIndex: 'appCode',
        key: 'appCode',
        width: 200,
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
        sorter: {
          compare: (a: any, b: any) => a.appCode.localeCompare(b.appCode),
        },
      },
      {
        title: 'CPU',
        dataIndex: 'instanceCpuRate',
        key: 'instanceCpuRate',
        width: 200,
        //render: (value) => <>{} </>,
        sorter: {
          compare: (a: any, b: any) => a.instanceCpuRate - b.instanceCpuRate,
        },
      },
      {
        title: '内存',
        dataIndex: 'instanceWssRate',
        key: 'instanceWssRate',
        width: 200,
        //render: (value) => <>{} </>,
        sorter: {
          compare: (a: any, b: any) => a.instanceWssRate - b.instanceWssRate,
        },
      },
      {
        title: '请求总数（5min)',
        dataIndex: 'fullGcTotal',
        key: 'fullGcTotal',
        width: 200,
        //render: (value) => <>{} </>,
        sorter: {
          compare: (a: any, b: any) => a.fullGcTotal - b.fullGcTotal,
        },
      },
      {
        title: '平均RT（5min)',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 200,
        //render: (value) => <>{} </>,
        sorter: {
          compare: (a: any, b: any) => a.Wss - b.Wss,
        },
      },
      {
        title: '成功率（5min)',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 200,
        //render: (value) => <>{} </>,
        sorter: {
          compare: (a: any, b: any) => a.Wss - b.Wss,
        },
      },
      {
        title: '失败数（5min)',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 200,
        //render: (value) => <>{} </>,
        sorter: {
          compare: (a: any, b: any) => a.Wss - b.Wss,
        },
      },
      {
        title: '状态',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: 200,
        //render: (value) => <>{} </>,
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        fixed:"right",
        width: 180,
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
            <a onClick={() => params.onView(record, index)}>详情</a>
            <a onClick={() => params.onAlertConfig(record, index)}>告警配置</a>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };
import { Space, Tooltip, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import JavaLogo from '@/assets/imgs/java-logo.png';
import PythonLogo from '@/assets/imgs/Python-logo.svg';
import GolangLogo from '@/assets/imgs/go-logo.svg';



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
        width: 50,
      },
      {
        title: '应用名称',
        dataIndex: 'appName',
        key: 'appName',
        width: 300,
        sorter: {
          compare: (a: any, b: any) => a.appName.localeCompare(b.appName),
        },
        render: (text,record,index) => {return <>
        <span >
          {
          record?.language==="java"?<span > <img src={JavaLogo} height={18} width={18} alt="" style={{marginBottom:8}}/></span>
         : record?.language==="python"?<span ><img src={PythonLogo} height={18} width={18} alt="" style={{marginBottom:8}} /></span>:
         record?.language==="golang"?<span ><img src={GolangLogo} height={18} width={18} alt="" style={{marginBottom:8}} /></span>:null
           }</span><span style={{marginLeft:8}}><a onClick={() => params.onView(record, index)}>{text}</a></span> </>}, 

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
        dataIndex: 'svcCpuRate',
        key: 'svcCpuRate',
        width: 90,
        render: (value) => <>{value}% </>,
        sorter: {
          compare: (a: any, b: any) => a.instanceCpuRate - b.instanceCpuRate,
        },
      },
      {
        title: '内存',
        dataIndex: 'svcWssRate',
        key: 'svcWssRate',
        width: 100,
        render: (value) => <>{value}% </>,
        sorter: {
          compare: (a: any, b: any) => a.instanceWssRate - b.instanceWssRate,
        },
      },
      {
        title: '请求总数（5min)',
        dataIndex: 'svcTotalRes',
        key: 'svcTotalRes',
        width: 110,
        //render: (value) => <>{} </>,
        sorter: {
          compare: (a: any, b: any) => a.svcTotalRes - b.svcTotalRes,
        },
      },
      {
        title: '平均RT（5min)',
        dataIndex: 'svcAvg',
        key: 'svcAvg',
        width: 110,
        //render: (value) => <>{} </>,
        sorter: {
          compare: (a: any, b: any) => a.svcAvg - b.svcAvg,
        },
      },
      {
        title: '成功率（5min)',
        dataIndex: 'svcSR',
        key: 'svcSR',
        width: 110,
        render: (value) => <>{value}% </>,
        sorter: {
          compare: (a: any, b: any) => a.svcSR - b.svcSR,
        },
      },
      {
        title: '失败数（5min)',
        dataIndex: 'svcFailed',
        key: 'svcFailed',
        width: 110,
        //render: (value) => <>{} </>,
        sorter: {
          compare: (a: any, b: any) => a.svcFailed - b.svcFailed,
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 90,
        render: (value) => <>{
          value==="警告"?<Tag color="yellow">警告</Tag>:value==="正常"?<Tag color="success">正常</Tag>:value==="危险"?<Tag color="red">危险</Tag>:"--"

        } </>,
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        fixed:"right",
        width: 120,
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
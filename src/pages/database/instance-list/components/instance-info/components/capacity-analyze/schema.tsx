import { Space, Avatar, Popconfirm, Tag, Spin,Tooltip,Badge } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { datetimeCellRender } from '@/utils';
 export const infoLayoutGrid = {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 4,
    xl: 4,
    xxl: 4,
    xxxl: 4,
  };
  // 列表页-表格
export const createAbnormalTableColumns = () => {
  return [
   
    {
      title: '表/集合名',
      dataIndex: 'tableName',
      key: 'tableName',
      // width: 290,
      ellipsis:true,
     
      render:(value,record,index)=>(
        <Tooltip title={value}>
          <span>{value}</span>
        </Tooltip> 
       )
    },
    {
      title: '数据库名',
      dataIndex: 'tableSchema',
      key: 'tableSchema',
      // width: 120,
      ellipsis: true,
      // sorter: {
      //   compare: (a: any, b: any) => a.host.localeCompare(b.host),
      // },
    },
    {
      title: '异常内容',
      dataIndex: 'reason',
      key: 'reason',
      // width: 180,
      // sorter: {
      //   compare: (a: any, b: any) => a.db.localeCompare(b.db),
      // },
    },
    {
      title: '诊断时间',
      dataIndex: 'resultTime',
      key: 'resultTime',
      // width: 90,
      // sorter: {
      //   compare: (a: any, b: any) => a.command.localeCompare(b.command),
      // },
      render:(value)=><span>
        {value?datetimeCellRender(value):""}
      </span>
    },
   
  ] as ColumnsType<any>;
};
// 列表页-表格
export const createSpaceTableColumns = () => {
  return [
 
    {
      title: '表名',
      dataIndex: 'tableName',
      key: 'tableName',
      width: 190,
      ellipsis:true,
      sorter: {
        compare: (a: any, b: any) => a.tableName.localeCompare(b.tableName),
      },
      render:(value,record,index)=>(
        <Tooltip title={value}>
          <span>{value}</span>
        </Tooltip> 
       )
    },
    {
      title: '数据库名',
      dataIndex: 'tableSchema',
      key: 'tableSchema',
      width: 120,
      ellipsis: true,
      sorter: {
        compare: (a: any, b: any) => a.tableSchema.localeCompare(b.tableSchema),
      },
      // sorter: {
      //   compare: (a: any, b: any) => a.host.localeCompare(b.host),
      // },
    },
    {
      title: '存储引擎',
      dataIndex: 'engine',
      key: 'engine',
      width: 120,
      sorter: {
        compare: (a: any, b: any) => a.engine.localeCompare(b.engine),
      },
    },
    {
      title: '表空间',
      dataIndex: 'tableLength',
      key: 'tableLength',
      width: 100,
      sorter: {
        compare: (a: any, b: any) => a.tableLength - b.tableLength,
      },
      render: (value: any) => {
        return <span>{value} GB</span>;
      },
    },
    {
      title: '表空间占比',
      dataIndex: 'perTableLength',
      key: 'perTableLength',
      width: 100,
      sorter: {
        compare: (a: any, b: any) => a.perTableLength - b.perTableLength,
      },
      render: (value: any) => {
        return <span>{value} %</span>;
      },
    },
    {
      title: '索引空间',
      dataIndex: 'indexLength',
      key: 'indexLength',
      width: 100,
      ellipsis:true,
      sorter: {
        compare: (a: any, b: any) => a.indexLength - b.indexLength,
      },
      render:(value:string)=>{
        return(
          <Tooltip title={value}>
          <span>{value} GB</span>
         
        </Tooltip>
        )

      }
    },
  
    {
      title: '数据空间',
      dataIndex: 'dataLength',
      key: 'dataLength',
      width: 90,
      sorter: {
        compare: (a: any, b: any) => a.dataLength - b.dataLength,
      },
      render: (value: any) => {
        return <span>{value} GB</span>;
      },
     
     
    },
    {
      title: '碎片率',
      dataIndex: 'perDataFree',
      key: 'perDataFree',
      width: 90,
      sorter: {
        compare: (a: any, b: any) => a.perDataFree - b.perDataFree,
      },
      render: (value: any) => {
        return <span>{value} %</span>;
      },
     
     
    },
    {
      title: '表行数',
      dataIndex: 'tableRows',
      key: 'tableRows',
      width: 90,
      sorter: {
        compare: (a: any, b: any) => a.tableRows - b.tableRows,
      },
     
     
    },
    {
      title: '平均时长',
      dataIndex: 'avgRowLength',
      key: 'avgRowLength',
      width: 90,
      sorter: {
        compare: (a: any, b: any) => a.avgRowLength - b.avgRowLength,
      },
      render: (value: any) => {
        return <span>{value} KB</span>;
      },
     
     
    },
  ] as ColumnsType<any>;
};


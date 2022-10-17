import { Space, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { datetimeCellRender } from '@/utils';

// export const formOptions: FormProps[] = [
  
   
//     {
//       key: '1',
//       type: 'select',
//       label: '用户',
//       dataIndex: 'userName',
//       width: '160px',
//       placeholder: '请选择',
//       showSelectSearch: true,
//       option:params?.userNameOptions,
     
//     },
   
//   ];
  export const createFormItems = (params: {
 
    userNameOptions?: any[];
    
  }) => {
    return [
      
  
  
      {
        key: '1',
        type: 'select',
        label: '申请人',
        dataIndex: 'userName',
        width: '160px',
        showSelectSearch: true,
        option:params?.userNameOptions,
      },
     
    ] as FormProps[];
  };
  


// 列表页-表格
export const createTableColumns = (params: {
    onDelete: (record: any, index: number) => void;
}) => {
  return [
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: '对象类型',
      dataIndex: 'privType',
      key: 'privType',
      width: '18%',
    },
    {
      title: '实例',
      dataIndex: 'instanceName',
      key: 'instanceName',
      width: '14%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '数据库',
      dataIndex: 'dbCode',
      key: 'dbCode',
      width: '20%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '表',
      dataIndex: 'tableCode',
      key: 'tableCode',
      width: '20%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
        title: '结果集限制',
        dataIndex: 'limitNum',
        key: 'limitNum',
        width: '20%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '创建时间',
        dataIndex: 'validStartTime',
        key: 'validStartTime',
        width: '30%',
        ellipsis: true,
        render: (value) => <>{datetimeCellRender(value)} </>,
      },
      {
        title: '过期时间',
        dataIndex: 'validEndTime',
        key: 'validEndTime',
        width: '30%',
        ellipsis: true,
        render: (value) => <>{datetimeCellRender(value)} </>,
      },

    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '18%',
      render: (_: string, record, index: number) => (
        <Space>
            <Popconfirm
            title="确认删除此权限?"
            onConfirm={() => {
              params.onDelete(record, index)
            }}
          >
            <a style={{color:"red"}}>删除权限</a>
          </Popconfirm>
         
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};
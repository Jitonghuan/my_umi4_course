import { Space, Popconfirm, Tooltip,Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { datetimeCellRender } from '@/utils';


export const createDiffTableColumns = (params: {
    // createError:any,
    // modifyError:any,
    onViewError:(record: any, index: number) => void;
    onDetail: (record: any, index: number) => void;
  }) => {
    return [
      {
        title: '来源表',
        dataIndex: 'fromTableCode',
        key: 'fromTableCode',
        
      },
      {
        title: '目标表',
        dataIndex: 'toTableCode',
        key: 'toTableCode',
       
       
      },
     
  
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        fixed: 'right',
        align: 'center',
        width: 120,
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
            <a onClick={() => params.onDetail(record, index)}>查看</a>
            {record?.errorMessage&& <a style={{color:"red"}} onClick={() => params.onViewError(record, index)}>错误信息</a>}
           
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };
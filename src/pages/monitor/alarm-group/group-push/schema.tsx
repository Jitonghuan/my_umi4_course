import { datetimeCellRender } from '@/utils';
import { FormProps } from '@/components/table-search/typing';
import { Space, Popconfirm, Tooltip, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
const ALERT_LEVEL: Record<number, { text: string; value: number; color: string }> = {
    2: { text: '警告', value: 2, color: 'yellow' },
    3: { text: '严重', value: 3, color: 'orange' },
    4: { text: '灾难', value: 4, color: 'red' },
  };
  type StatusTypeItem = {
    color: string;
    tagText: string;
    buttonText: string;
    status: number;
    
  };
  const STATUS_TYPE: Record<number, StatusTypeItem> = {
    0: { tagText: '已启用', buttonText: '停用', color: 'green', status: 1 },
    1: { tagText: '未启用', buttonText: '启用', color: 'default', status: 0 },
  };  
// 列表页-表格
export const createTableColumns = () => {
    return [
        {
            title: '报警名称',
            dataIndex: 'name',
            key: 'name',
            width: 140,
          },
          {
            title: '环境',
            dataIndex: 'envName',
            key: 'envName',
            width: 120,
          },
          {
            title: '关联应用',
            dataIndex: 'appCode',
            key: 'appCode',
            width: 120,
          },
          //nameSpace
          {
            title: '命名空间',
            dataIndex: 'namespace',
            key: 'namespace',
            width: 120,
          },
          {
            title: '报警级别',
            dataIndex: 'level',
            key: 'level',
            render: (text: number) => <Tag color={ALERT_LEVEL[text]?.color}>{ALERT_LEVEL[text]?.text}</Tag>,
            width: 120,
          },
          {
            title: '告警表达式',
            dataIndex: 'expression',
            key: 'expression',
            width: 220,
            render: (text: string) => (
              <Tooltip title={text}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 220,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {text}
                </span>
              </Tooltip>
            ),
          },
          {
            title: '告警消息',
            dataIndex: 'message',
            key: 'message',
            width: 200,
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (text: number) => <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].tagText}</Tag>,
          },
         
     
    ] as ColumnsType<any>;
  };
  
import { Space, Popconfirm, Tooltip,Tag,Spin } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
/** 编辑页回显数据 */
export interface TmplEdit extends Record<string, any> {
  templateCode: string;
  templateType: string;
  templateName: string;
  tmplConfigurableItem: object;
  appCategoryCode: any;
  envCodes: string;
  templateValue: string;
  languageCode: string;
  remark: string;
  broSource:any
}
/** 应用开发语言(后端) */
export type AppDevelopLanguage = 'java' | 'golang' | 'python';
export const appDevelopLanguageOptions: IOption<AppDevelopLanguage>[] = [
  { label: 'GOLANG', value: 'golang' },
  { label: 'JAVA', value: 'java' },
  { label: 'PYTHON', value: 'python' },
];
// 列表页-表格
export const createTableColumns = (params: {
   
    onCopy: (record: any, index: number) => void;
    onEdit: (record: any, index: number) => void;
    onView: (record: any, index: number) => void;
    onPush: (record: any, index: number) => void;
    onDelete: (record: any, index: number) => void;
  }) => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
      },
      {
        title: '模版名称',
        dataIndex: 'templateName',
        key: 'templateName',
        width: '20%',
      },
      {
        title: '模版语言',
        dataIndex: 'languageCode',
        key: 'languageCode',
        width: '8%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '模版类型',
        dataIndex: 'templateType',
        key: 'templateType',
        width: '8%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '应用分类',
        dataIndex: 'appCategoryCode',
        key: 'appCategoryCode',
        width: '12%',
        ellipsis: true,
        render: (appCategoryCode) => <Tooltip placement="topLeft" title={appCategoryCode?.map((item:string)=>{return <span style={{padding:2}}><Tag color="green">{item}</Tag></span>})}>{appCategoryCode?.map((item:string)=>{return <span style={{padding:1}}><Tag color="green">{item}</Tag></span>})}</Tooltip>,
      },
      {
        title: '环境',
        dataIndex: 'envCode',
        key: 'envCode',
        width: '16%',
        ellipsis: true,
        render:(current) => (
            <span>
                <Tooltip title={current?.map((item: any) => {
                   return (
                    <span style={{ marginLeft: 4, marginTop: 2 }}>
                        <Tag color='#e8f8ff'><span style={{ color: '#1890ff' }}>{item}</span></Tag>
                    </span>
                );
              })}>
                {current?.map((item: any) => {
                   return (
                    <span style={{ marginLeft: 4, marginTop: 2 }}>
                        <Tag color='#e8f8ff'><span style={{ color: '#1890ff' }}>{item}</span></Tag>
                    </span>
                );
              })}
                </Tooltip>
            </span>
          )
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '14%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        width: '14%',
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space size="small">
                <a
                    onClick={() =>
                        params.onCopy(record, index)
                    }
                  >
                    复制
                  </a>
                  <a
                    onClick={() =>
                        params.onView(record, index)
                   
                    }
                  >
                    详情
                  </a>

                  <a 
                  onClick={() => params.onEdit(record, index)
                }
                  >编辑</a>
                  <a
                    onClick={() => {
                        params.onPush(record, index)
                    }}
                  >
                    推送
                  </a>
                  <Popconfirm title="确定要删除该信息吗？" 
                  onConfirm={() => 
                    params.onDelete(record, index)
                }
                  >
                     
                   <a>删除</a>
                  </Popconfirm>
          </Space>
        ),
      },
    ] as ColumnsType<any>;
  };
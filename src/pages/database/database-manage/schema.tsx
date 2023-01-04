/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 15:42:22
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-12 14:28:32
 * @FilePath: /fe-matrix/src/pages/database/database-manage/schema.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Space, Popconfirm, Spin } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
export const readonlyColumns=()=>{
  return [
    {
      title: '数据库名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: '字符集',
      dataIndex: 'characterset',
      key: 'characterset',
      width: '25%',
    },
    {
      title: '授权账号',
      dataIndex: 'owner',
      key: 'owner',
      width: '25%',
    },

    {
      title: '备注说明',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
    },

  ]
}
// 列表页-表格
export const createTableColumns = (params: { 
  onDelete: (record: any) => void; delLoading: boolean }) => {
  return [
    {
      title: '数据库名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '字符集',
      dataIndex: 'characterset',
      key: 'characterset',
      width: '20%',
    },
    {
      title: '授权账号',
      dataIndex: 'owner',
      key: 'owner',
      width: '25%',
    },

    {
      title: '备注说明',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (_: string, record, index: number) => (
        
        //根据不同类型跳转
        <Space>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params?.onDelete(record);
            }}
            
          >
            <Spin spinning={params?.delLoading}>
              <a >删除</a>
            </Spin>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};

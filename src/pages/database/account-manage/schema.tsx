/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 17:02:02
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-07 17:08:03
 * @FilePath: /fe-matrix/src/pages/database/account-manage/schema.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Space, Tag, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
// 列表页-表格
export const createTableColumns = (params: { onDelete: (record: any) => void }) => {
  return [
    {
      title: '账号',
      dataIndex: 'user',
      key: 'user',
      width: '14%',
    },
    {
      title: '权限',
      dataIndex: 'grantPrivs',
      key: 'grantPrivs',
      width: '20%',
      render: (grantPrivs: any, record, index: number) =>
        grantPrivs?.map((item: string) => {
          return <p>{item},</p>;
        }),
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      width: '14%',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '12%',
      render: (_: string, record, index: number) => (
        //根据不同类型跳转
        <Space>
          <a>授权</a>
          <a>回收</a>
          <a>改密</a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              params?.onDelete(record.id);
            }}
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ] as ColumnsType<any>;
};

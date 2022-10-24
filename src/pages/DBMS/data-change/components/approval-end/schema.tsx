/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-19 00:45:17
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-09-19 00:54:07
 * @FilePath: /fe-matrix/src/pages/DBMS/data-change/components/approval-end/schema.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Space, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';

// 列表页-表格
export const createTableColumns = () => {
  return [
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 120,
    },
    {
      title: '操作人',
      dataIndex: 'operatorDisplay',
      key: 'operatorDisplay',
      width: '14%',
    },
    {
      title: '操作时间',
      dataIndex: 'operatorTime',
      key: 'operatorTime',
      width: '30%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '操作信息',
      dataIndex: 'operationInfo',
      key: 'operationInfo',
      width: '50%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
   
  ] as ColumnsType<any>;
};
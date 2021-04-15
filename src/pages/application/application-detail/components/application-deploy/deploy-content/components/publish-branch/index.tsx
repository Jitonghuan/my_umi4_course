/**
 * PublishBranch
 * @description 发布分支
 * @author moting.nq
 * @create 2021-04-15 10:22
 */

import React from 'react';
import { Steps, Button } from 'antd';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import { useEffectOnce } from 'white-react-use';
import { createTableSchema } from './schema';
import { queryPublishContentList } from '../../../service';
import { IProps } from './types';
import './index.less';

const { Step } = Steps;
const rootCls = 'publish-branch-compo';

const PublishBranch = (props: IProps) => {
  // 查询数据
  const { run: queryContentList, tableProps } = usePaginated({
    requestUrl: queryPublishContentList,
    requestMethod: 'POST',
    pagination: {
      showSizeChanger: true,
      showTotal: (total) => `总共 ${total} 条数据`,
    },
  });

  useEffectOnce(() => {
    queryContentList();
  });

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>待发布的分支</div>

      <div className={`${rootCls}__list-wrap`}>
        <div className={`${rootCls}__list-header`}>
          <span className={`${rootCls}__list-header-text`}>分支列表</span>

          <div className={`${rootCls}__list-header-btns`}>
            {/* TODO 没选择置灰 */}
            <Button>提交分支</Button>
          </div>
        </div>

        {/* TODO 需要页码吗？ */}
        <HulkTable
          rowKey="id"
          size="small"
          className={`${rootCls}__list-table`}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
              console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                'selectedRows: ',
                selectedRows,
              );
            },
            // getCheckboxProps: (record: any) => ({
            //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
            //   name: record.name,
            // }),
          }}
          columns={createTableSchema() as any}
          {...tableProps}
        />
      </div>
    </div>
  );
};

PublishBranch.defaultProps = {};

export default PublishBranch;

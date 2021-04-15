/**
 * PublishContent
 * @description 发布内容
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
const rootCls = 'publish-content-compo';

const PublishContent = (props: IProps) => {
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
      <div className={`${rootCls}__title`}>发布内容</div>

      <Steps className={`${rootCls}__steps`} current={1}>
        <Step title="创建任务" />
        <Step title="合并release" />
        <Step title="部署" />
        <Step title="发布" />
        <Step title="执行完成" />
      </Steps>

      <div className={`${rootCls}__list-wrap`}>
        <div className={`${rootCls}__list-header`}>
          <span className={`${rootCls}__list-header-text`}>内容列表</span>

          <div className={`${rootCls}__list-header-btns`}>
            <Button>重新部署</Button>
            <Button>批量退出</Button>
            <Button>重启</Button>
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

PublishContent.defaultProps = {};

export default PublishContent;

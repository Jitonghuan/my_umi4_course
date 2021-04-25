/**
 * PublishRecord
 * @description 发布记录
 * @author moting.nq
 * @create 2021-04-25 16:05
 */

import React from 'react';
import HulkTable from '@cffe/vc-hulk-table';
import { createTableSchema } from './schema';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-record-compo';

const PublishRecord = (props: IProps) => {
  // TODO 缺接口

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布记录</div>

      <HulkTable
        className={`${rootCls}__table`}
        rowKey="id"
        size="small"
        dataSource={[]}
        pagination={false}
        columns={createTableSchema() as any}
      />
    </div>
  );
};

PublishRecord.defaultProps = {};

export default PublishRecord;

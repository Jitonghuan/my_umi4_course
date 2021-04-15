/**
 * PublishDetail
 * @description 发布详情
 * @author moting.nq
 * @create 2021-04-15 10:11
 */

import React from 'react';
import { Descriptions } from 'antd';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-detail-compo';

const PublishDetail = (props: IProps) => {
  return (
    <div className={rootCls}>
      <Descriptions
        title="发布详情"
        size="small"
        labelStyle={{ color: '#5F677A', textAlign: 'right' }}
        contentStyle={{ color: '#000' }}
      >
        <Descriptions.Item label="CRID">1107</Descriptions.Item>
        <Descriptions.Item label="部署分支">1111</Descriptions.Item>
        <Descriptions.Item label="冲突分支">暂无</Descriptions.Item>
        <Descriptions.Item label="合并分支">暂无</Descriptions.Item>
        <Descriptions.Item label="发布院区">暂无</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

PublishDetail.defaultProps = {};

export default PublishDetail;

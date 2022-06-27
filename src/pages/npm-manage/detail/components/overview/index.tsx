import React from 'react';
import { Descriptions } from 'antd';
import './index.less';

export default function Overview() {

  return (
    <div className="npm-detail-overview">
      <Descriptions
        title="基础信息"
        className="fixed"
        bordered
        column={1}
        labelStyle={{ width: 200 }}
      >
        <Descriptions.Item label="包名">XXX</Descriptions.Item>
        <Descriptions.Item label="git地址">
          <a target="_blank">
            地址
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="owner">XXX</Descriptions.Item>
        <Descriptions.Item label="应用描述">XXX</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

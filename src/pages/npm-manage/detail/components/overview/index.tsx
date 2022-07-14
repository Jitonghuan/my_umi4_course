import React, { useContext } from 'react';
import { Descriptions } from 'antd';
import DetailContext from '../../context';
import './index.less';

export default function Overview() {
  const { npmData } = useContext(DetailContext);

  return (
    <div className="npm-detail-overview">
      <Descriptions
        title="基础信息"
        className="fixed"
        bordered
        column={1}
        labelStyle={{ width: 200 }}
      >
        <Descriptions.Item label="包名">{npmData?.npmName}</Descriptions.Item>
        <Descriptions.Item label="git地址">
          <a href={npmData?.gitAddress} target="_blank">
            {npmData?.gitAddress}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="owner">{npmData?.npmOwner}</Descriptions.Item>
        <Descriptions.Item label="应用描述">{npmData?.desc}</Descriptions.Item>
        <Descriptions.Item label="fnpm文档">
          <a href={`http://web.npm.cfuture.cc/package/${npmData?.npmName}`} target="_blank">
            {`http://web.npm.cfuture.cc/package/${npmData?.npmName}`}
          </a>
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

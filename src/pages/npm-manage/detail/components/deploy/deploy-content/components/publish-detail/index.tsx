import React from 'react';
import { Descriptions, Typography } from 'antd';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-detail-compo';
const { Paragraph } = Typography;
export default function PublishDetail(props: IProps) {
  let { deployInfo } = props;
  let { metadata, branchInfo, buildInfo, status } = deployInfo || {};
  const { buildUrl } = buildInfo || {};

  let errorInfo: any[] = [];
  if (status && status.deployErrInfo) {
    Object.keys(status.deployErrInfo).forEach((item) => {
      if (status.deployErrInfo[item]) {
        errorInfo.push({ key: item, errorMessage: status.deployErrInfo[item] });
      }
    });
  }

  function goToJenkins(item: any) {
    if (buildUrl && item?.key) {
      const data = buildUrl[item?.key] || '';
      if (data) {
        window.open(data, '_blank');
      }
    }
  }

  return (
    <div className={rootCls}>
      <Descriptions
        title="发布详情"
        labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
        contentStyle={{ color: '#000' }}
        column={4}
        bordered
      >
        <Descriptions.Item label="CRID" contentStyle={{ whiteSpace: 'nowrap' }}>
          {metadata?.id || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="部署分支" span={2}>
          {branchInfo?.releaseBranch ? <Paragraph copyable>{branchInfo?.releaseBranch}</Paragraph> : '---'}
        </Descriptions.Item>
        <Descriptions.Item label="部署版本" contentStyle={{ whiteSpace: 'nowrap' }}>
          {buildInfo?.buildResultInfo?.version ? (
            <Paragraph copyable>{buildInfo?.buildResultInfo?.version}</Paragraph>
          ) : (
            '---'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="冲突分支" span={4}>
          {branchInfo?.conflictFeature || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="主干分支" span={4}>
          {branchInfo?.masterBranch || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="合并分支" span={4}>
          {branchInfo?.features.join(',') || '--'}
        </Descriptions.Item>
        {status?.deployErrInfo && errorInfo.length && (
          <Descriptions.Item label="部署错误信息" span={4} contentStyle={{ color: 'red' }}>
            <div>
              {errorInfo.map((err) => (
                <div>
                  <span style={{ color: 'black' }}> {err?.errorMessage ? `${err?.key}：` : ''}</span>
                  <a
                    style={{ color: 'red', textDecoration: 'underline' }}
                    onClick={() => {
                      if (err?.errorMessage.indexOf('请查看jenkins详情') !== -1) {
                        goToJenkins(err);
                      }
                    }}
                  >
                    {err?.errorMessage}
                  </a>
                </div>
              ))}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>

    </div>
  );
}

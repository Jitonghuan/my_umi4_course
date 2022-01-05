/**
 * ApplicationCardList
 * @description 应用卡片列表
 * @author moting.nq
 * @create 2021-04-08 16:09
 */

import React from 'react';
import { history } from 'umi';
import { Tag, Tooltip } from 'antd';
import { Html5Outlined, CodeOutlined, UserOutlined } from '@ant-design/icons';
import CardLayout from '@cffe/vc-b-card-layout';
import { AppItemVO } from '../../interfaces';
import './index.less';

const cardCls = 'all-application-page__card';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

const APP_TYPE_TAG: Record<string, [string, React.ReactNode]> = {
  frontend: ['geekblue', <Html5Outlined />],
  backend: ['default', <CodeOutlined />],
};

export interface IProps {
  dataSource: AppItemVO[];
  type?: string;
}

export default function ApplicationCardList(props: IProps) {
  const { dataSource, type } = props;

  return (
    <CardLayout>
      {dataSource.map((item) => (
        <div
          key={item.id}
          className={cardCls}
          onClick={() =>
            history.push({
              pathname: 'detail',
              query: {
                id: `${item.id}`,
                appCode: item.appCode,
              },
            })
          }
        >
          <div className={`${cardCls}-header`}>{item.appName}</div>
          {item.appType === 'frontend' && type === 'mine' ? (
            <>
              <div className={`${cardCls}-sub-header`}>
                {item.appType === 'frontend' ? `工程：${item.deploymentName}` : ''}
              </div>
              <div className={`${cardCls}-router`}>
                {item.relationMainApps && item.relationMainApps.length
                  ? `路由：${item.relationMainApps[0].routePath}`
                  : ''}
              </div>
            </>
          ) : null}

          <div className={`${cardCls}-content`}>
            <div>
              <Tag color={APP_TYPE_TAG[item.appType]?.[0]} icon={APP_TYPE_TAG[item.appType]?.[1]}>
                {APP_TYPE_MAP[item.appType]}
              </Tag>
            </div>
            <Tooltip title={item.owner}>
              <div>
                <UserOutlined /> {item.owner}
              </div>
            </Tooltip>
          </div>
        </div>
      ))}
    </CardLayout>
  );
}

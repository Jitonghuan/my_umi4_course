/**
 * ApplicationCardList
 * @description 应用卡片列表
 * @author moting.nq
 * @create 2021-04-08 16:09
 */

import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { Tag, Tooltip, Popconfirm } from 'antd';
import { StarFilled, StarTwoTone, Html5Outlined, CodeOutlined, UserOutlined } from '@ant-design/icons';
import { collectRequst } from '../../common';
import CardLayout from '@cffe/vc-b-card-layout';
import { AppItemVO } from '../../interfaces';
import './index.less';

const cardCls = 'all-application-page__card';

const APP_TYPE_MAP: { [index: string]: any } = {
  frontend: '前端',
  backend: '后端',
};

const APP_TYPE_TAG: Record<string, [string, React.ReactNode]> = {
  frontend: ['geekblue', <Html5Outlined />],
  backend: ['default', <CodeOutlined />],
};
export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
}

export interface IProps {
  dataSource: AppItemVO[];
  type?: string;
  loadAppListData: any;
}

export default function ApplicationCardList(props: IProps) {
  const { dataSource, type, loadAppListData } = props;
  useEffect(() => {
    if (dataSource) {
      dataSource.forEach((item) => {
        Object.assign(item, { isCollection: 0 });
      });
    }
  }, []);
  const switchStar = async (a: AppItemVO, evt: any) => {
    const appCode = a.appCode;
    const result = await collectRequst('application', a.isCollection ? 'cancel' : 'add', appCode);
    if (result) {
      loadAppListData();
    }
  };

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
          <div className={`${cardCls}-header`} style={{ position: 'relative' }}>
            {item.appName}
            <span onClick={(e) => e.stopPropagation()}>
              <Popconfirm
                title={`确定${item.isCollection ? '取消该收藏' : '收藏该应用'}吗？`}
                onConfirm={(e) => switchStar(item, e)}
                okText="确定"
                cancelText="取消"
              >
                <span
                  style={{
                    top: 0,
                    right: 0,
                    position: 'absolute',
                    color: '#ff8419',
                  }}
                >
                  {item.isCollection ? <StarFilled /> : <StarTwoTone twoToneColor="#ff8419" />}
                </span>
              </Popconfirm>
            </span>
          </div>
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

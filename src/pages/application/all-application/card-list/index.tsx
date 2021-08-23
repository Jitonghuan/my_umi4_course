/**
 * ApplicationCardList
 * @description 应用卡片列表
 * @author moting.nq
 * @create 2021-04-08 16:09
 */

import React from 'react';
import { history } from 'umi';
import CardLayout from '@cffe/vc-b-card-layout';
import { IProps } from './types';
import './index.less';

const cardCls = 'all-application-page__card';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

const ApplicationCardList = (props: IProps) => {
  const { dataSource } = props;

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
                isClient: String(item.isClient),
                isContainClient: String(item.isContainClient),
              },
            })
          }
        >
          <div className={`${cardCls}-header`}>{item.appName}</div>

          <div className={`${cardCls}-content`}>
            <div>应用类型：{APP_TYPE_MAP[item.appType]}</div>
            <div>owner：{item.owner}</div>
          </div>
        </div>
      ))}
    </CardLayout>
  );
};

ApplicationCardList.defaultProps = {};

export default ApplicationCardList;

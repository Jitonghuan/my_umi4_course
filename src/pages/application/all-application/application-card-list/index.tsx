/**
 * ApplicationCardList
 * @description 应用卡片列表
 * @author moting.nq
 * @create 2021-04-08 16:09
 */

import React from 'react';
import { Pagination } from 'antd';
import CardLayout from '@cffe/vc-b-card-layout';
import { cardCls } from '../constants';
import { IProps } from './types';
import './index.less';

const ApplicationCardList = (props: IProps) => {
  const { dataSource, pagination } = props;

  return (
    <>
      <CardLayout>
        {dataSource.map((item) => (
          <div key={item.id} className={cardCls}>
            <div className={`${cardCls}-header`}>{item.appName}</div>

            <div className={`${cardCls}-content`}>
              <div>应用类型：{item.appType}</div>
              <div>owner：{item.owner}</div>
            </div>
          </div>
        ))}
      </CardLayout>

      <div className={`${cardCls}-pagination-wrap`}>
        <Pagination showQuickJumper {...pagination} />
      </div>
    </>
  );
};

ApplicationCardList.defaultProps = {};

export default ApplicationCardList;

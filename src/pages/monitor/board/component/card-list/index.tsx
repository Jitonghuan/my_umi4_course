/**
 * ApplicationCardList
 * @description 应用卡片列表
 * @author moting.nq
 * @create 2021-04-08 16:09
 */

import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { Tag, Tooltip, Popconfirm } from 'antd';
import { StarFilled, StarTwoTone, Html5Outlined, CodeOutlined, UserOutlined, RestFilled, RestTwoTone, EditFilled } from '@ant-design/icons';
import { collectRequst } from '../../service';
import CardLayout from '@cffe/vc-b-card-layout';
import { AppItemVO } from '../../interfaces';
import './index.less';

const cardCls = 'monitor-board-page__card';

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
            history.push('detail')
          }
        >
          <div className={`${cardCls}-header`} style={{ position: 'relative' }}>
            {item.appName}
            <span onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0 }}>
              <Popconfirm
                title={`确定删除大盘吗？`}
                onConfirm={(e) => switchStar(item, e)}
                okText="确定"
                cancelText="取消"
              >
                <RestFilled className={`${cardCls}-header-delete`} />
              </Popconfirm>

              <EditFilled className={`${cardCls}-header-edit`}/>
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
            <div className={`${cardCls}-content-description`}>
              <span className={`${cardCls}-content-description-label`}>分类</span>
              <span className={`${cardCls}-content-description-value`}>集群监控大盘</span>
            </div>
            <div className={`${cardCls}-content-description`}>
              <span className={`${cardCls}-content-description-label`}>数据源类型</span>
              <span className={`${cardCls}-content-description-value`}>集群监控大盘</span>
            </div>
            <div className={`${cardCls}-content-description`}>
              <span className={`${cardCls}-content-description-label`}>数据源名称</span>
              <span className={`${cardCls}-content-description-value`}>集群监控大盘</span>
            </div>
          </div>
        </div>
      ))}
    </CardLayout>
  );
}

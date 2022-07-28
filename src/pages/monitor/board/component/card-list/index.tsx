/**
 * ApplicationCardList
 * @description 应用卡片列表
 * @author moting.nq
 * @create 2021-04-08 16:09
 */

import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { Popconfirm } from 'antd';
import { RestFilled, EditFilled } from '@ant-design/icons';
import CardLayout from '@cffe/vc-b-card-layout';
import './index.less';
import { delGraphTable } from '../../service';

const cardCls = 'monitor-board-page__card';

export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
}

export interface IProps {
  dataSource: any[];
  loadGraphTable: any;
  cluster: string;
  deleteBoard: (graphUuid: string) => any;
  handleEdit: (data: any) => any;
}

export default function ApplicationCardList(props: IProps) {
  const { dataSource, deleteBoard, handleEdit } = props;

  return (
    <CardLayout>
      {dataSource.map((item: any) => (
        <div
          key={item.graphUuid}
          className={cardCls}
          onClick={() =>
            history.push({
              pathname: 'detail',
              search: `?graphName=${item.GraphName}&url=${encodeURIComponent(item.url)}`
            })
          }
        >
          <div className={`${cardCls}-header`} style={{ position: 'relative' }}>
            {item.GraphName}
            <span onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0 }}>
              <Popconfirm
                title={`确定删除大盘吗？`}
                onConfirm={() => { deleteBoard(item.graphUuid) }}
                okText="确定"
                cancelText="取消"
              >
                <RestFilled className={`${cardCls}-header-delete`} />
              </Popconfirm>
              <EditFilled className={`${cardCls}-header-edit`} onClick={() => { handleEdit(item) }} />
            </span>
          </div>

          <div className={`${cardCls}-content`}>
            <div className={`${cardCls}-content-description`}>
              <span className={`${cardCls}-content-description-label`}>分类</span>
              <span className={`${cardCls}-content-description-value`}>{item.GraphType}</span>
            </div>
            <div className={`${cardCls}-content-description`}>
              <span className={`${cardCls}-content-description-label`}>数据源类型</span>
              <span className={`${cardCls}-content-description-value`}>{item.DsType}</span>
            </div>
            <div className={`${cardCls}-content-description`}>
              <span className={`${cardCls}-content-description-label`}>数据源名称</span>
              <span className={`${cardCls}-content-description-value`}>{item.DsName}</span>
            </div>
          </div>
        </div>
      ))}
    </CardLayout>
  );
}

/**
 * PublishRecord
 * @description 发布记录
 * @author moting.nq
 * @create 2021-04-25 16:05
 */

import React, { useState, useEffect } from 'react';
import { Modal, Button, List } from 'antd';
import VCDescription from '@/components/vc-description';
import { recordFieldMap } from './schema';
import { IProps, IRecord } from './types';
import { queryRecordApi } from './service';
import { usePaginated } from '@cffe/vc-hulk-table';
import './index.less';

const rootCls = 'publish-record-compo';

const PublishRecord = (props: IProps) => {
  const { env, appCode } = props;

  const [curRecord, setcurRecord] = useState<IRecord>({});
  const [visible, setVisible] = useState<boolean>(false);

  const {
    run: queryDataSource,
    tableProps,
    loadMore,
    setPageInfo,
  } = usePaginated({
    requestUrl: queryRecordApi,
    requestMethod: 'GET',
    loadMore: true,
  });

  useEffect(() => {
    queryDataSource({
      appCode,
      env,
      isActive: 0,
    });
  }, []);

  const renderLoadMore = () => {
    const { total = 0, current = 0 } = tableProps?.pagination || {};
    return (
      total > 0 && (
        <div className={`${rootCls}-btns`}>
          <Button
            ghost
            type="dashed"
            loading={tableProps.loading}
            onClick={loadMore}
          >
            加载更多
          </Button>
        </div>
      )
    );
  };

  // 显示详情
  const handleShowDetail = (record: IRecord) => {
    setVisible(true);
    setcurRecord(record);
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布记录</div>

      <List
        className="demo-loadmore-list"
        loading={tableProps.loading}
        itemLayout="vertical"
        loadMore={renderLoadMore()}
        dataSource={tableProps.dataSource as IRecord[]}
        renderItem={(item) => (
          <List.Item>
            {Object.keys(recordFieldMap)
              .slice(0, 3)
              .map((key) => (
                <span className={`${rootCls}-row ${key}`}>
                  <label>{recordFieldMap[key]}</label>：{item[key]}
                </span>
              ))}
            <a onClick={() => handleShowDetail(item)}>详情</a>
          </List.Item>
        )}
      />

      <Modal
        title="发布详情"
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <VCDescription
          column={1}
          dataSource={Object.keys(recordFieldMap).map((field) => ({
            label: recordFieldMap[field],
            value: curRecord[field],
          }))}
        />
      </Modal>
    </div>
  );
};

PublishRecord.defaultProps = {};

export default PublishRecord;

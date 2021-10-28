/**
 * PublishRecord
 * @description 发布记录
 * @author moting.nq
 * @create 2021-04-25 16:05
 */

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Modal, Button, List } from 'antd';
import VCDescription from '@/components/vc-description';
import DetailContext from '@/pages/application/application-detail/context';
import { recordFieldMap } from './schema';
import { IProps, IRecord } from './types';
import { queryRecordApi } from './service';
import { usePaginated } from '@cffe/vc-hulk-table';
import { queryEnvsReq } from '@/pages/application/service';
import './index.less';

const rootCls = 'publish-record-compo';

export default function PublishRecord(props: IProps) {
  const { env, appCode } = props;

  const { appData } = useContext(DetailContext);
  const { appCategoryCode } = appData || {};

  const [curRecord, setcurRecord] = useState<IRecord>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [envDataList, setEnvDataList] = useState([]);

  const {
    run: queryDataSource,
    tableProps,
    loadMore,
  } = usePaginated({
    requestUrl: queryRecordApi,
    requestMethod: 'GET',
    showRequestError: true,
    loadMore: true,
  });

  useEffect(() => {
    queryDataSource({
      appCode,
      env,
      isActive: 0,
    });
  }, []);

  useEffect(() => {
    if (!appCategoryCode) return;
    queryEnvsReq({
      categoryCode: appCategoryCode as string,
      envTypeCode: env,
      appCode,
    }).then((data) => {
      setEnvDataList(data.list);
    });
  }, [appCategoryCode, env]);

  const envNames: IRecord = useMemo(() => {
    const { envs } = curRecord;
    const namesArr: any[] = [];
    if (envs?.indexOf(',') > -1) {
      const list = envs?.split(',') || [];
      envDataList?.forEach((item: any) => {
        list?.forEach((v: any) => {
          if (item?.envCode === v) {
            namesArr.push(item.envName);
          }
        });
      });
      return {
        ...curRecord,
        envs: namesArr.join(','),
      };
    }

    return {
      ...curRecord,
      envs: (envDataList as any).find((v: any) => v.envCode === envs)?.envName,
    };
  }, [envDataList, curRecord]);

  const renderLoadMore = () => {
    const { pageSize = 0, total = 0, current = 0 } = tableProps?.pagination || {};

    return (
      total > 0 &&
      total > pageSize && (
        <div className={`${rootCls}-btns`}>
          <Button ghost type="dashed" onClick={loadMore}>
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
      {tableProps.dataSource?.filter((v) => v?.envTypeCode === env)?.length ? (
        <List
          className="demo-loadmore-list"
          loading={tableProps.loading}
          itemLayout="vertical"
          loadMore={renderLoadMore()}
          dataSource={tableProps.dataSource?.filter((v) => v?.envTypeCode === env) as IRecord[]}
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
      ) : null}

      <Modal title="发布详情" width={600} visible={visible} footer={false} onCancel={() => setVisible(false)}>
        <VCDescription
          labelStyle={{ width: 90, justifyContent: 'flex-end' }}
          column={1}
          dataSource={Object.keys(recordFieldMap).map((field) => ({
            label: recordFieldMap[field],
            value: envNames[field],
          }))}
        />
      </Modal>
    </div>
  );
}

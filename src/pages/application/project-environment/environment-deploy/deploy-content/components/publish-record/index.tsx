/**
 * PublishRecord
 * @description 发布记录
 * @author moting.nq
 * @create 2021-04-25 16:05
 */

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Modal, Button, List, Tag } from 'antd';
import useInterval from '@/pages/application/application-detail/components/application-deploy/deploy-content/useInterval';
import VCDescription from '@/components/vc-description';
import DetailContext from '@/pages/application/application-detail/context';
import { recordFieldMap, recordFieldMapOut, recordDisplayMap } from './schema';
import moment from 'moment';
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
  const [envDataList, setEnvDataList] = useState<any>([]);

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
      envTypeCode: env,
      pageIndex: 1,
    });
  }, []);
  useEffect(() => {
    let intervalId = setInterval(() => {
      if (appCode && env) {
        queryDataSource({
          appCode,
          envTypeCode: env,
          pageIndex: 1,
        });
      }
    }, 8000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!appCategoryCode) return;
    queryEnvsReq({
      categoryCode: appCategoryCode as string,
      envTypeCode: env,
      appCode,
    }).then((data) => {
      let envSelect: any = [];
      data?.list?.map((item: any) => {
        envSelect.push({ label: item.envName, value: item.envCode });
      });
      setEnvDataList(envSelect);
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
      };
    }

    return {
      ...curRecord,
    };
  }, [envDataList, curRecord]);

  const renderLoadMore = () => {
    const { pageSize = 0, total = 0, current = 0 } = tableProps?.pagination || {};

    return (
      total > 0 &&
      total > pageSize && (
        <div className={`${rootCls}-btns`}>
          <Button ghost type="primary" onClick={loadMore}>
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
        <div>
          <List
            className="demo-loadmore-list"
            // loading={tableProps.loading}
            itemLayout="vertical"
            loadMore={renderLoadMore()}
            dataSource={tableProps.dataSource?.filter((v) => v?.envTypeCode === env) as IRecord[]}
            renderItem={(item) => (
              <List.Item>
                <div>
                  {' '}
                  <label>{recordFieldMapOut['modifyUser']}</label>:{item['modifyUser']}
                </div>
                <div>
                  {' '}
                  <label>{recordFieldMapOut['deployedTime']}</label>:
                  {moment(item['deployedTime']).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                {item.deployStatus === 'multiEnvDeploying' && item.deploySubStates ? (
                  <div>
                    <label>{recordFieldMapOut['deployStatus']}</label>:
                    {JSON.parse(item.deploySubStates).map((subItem: any) => (
                      <div>
                        <label>{subItem.envCode}</label>:
                        {
                          <span style={{ marginLeft: 6 }}>
                            <Tag color={recordDisplayMap[subItem['subState']]?.color}>
                              {recordDisplayMap[subItem['subState']]?.text}
                            </Tag>
                          </span>
                        }
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <label>{recordFieldMapOut['deployStatus']}</label>:
                    {
                      <span style={{ marginLeft: 6 }}>
                        <Tag color={recordDisplayMap[item['deployStatus']]?.color}>
                          {recordDisplayMap[item['deployStatus']]?.text}
                        </Tag>
                      </span>
                    }
                  </div>
                )}
                <a onClick={() => handleShowDetail(item)}>详情</a>
              </List.Item>
            )}
          />
        </div>
      ) : null}

      <Modal title="发布详情" width={600} visible={visible} footer={false} onCancel={() => setVisible(false)}>
        <VCDescription labelStyle={{ width: 90, justifyContent: 'flex-end' }} column={1} dataSource={curRecord} />
      </Modal>
    </div>
  );
}

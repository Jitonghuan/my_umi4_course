/**
 * PublishRecord
 * @description 发布记录
 * @author moting.nq
 * @create 2021-04-25 16:05
 */

import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Modal, Button, List, Tag } from 'antd';
import VCDescription from '@/components/vc-description';
import DetailContext from '@/pages/application/application-detail/context';
import { recordFieldMap, recordFieldMapOut, recordDisplayMap } from './schema';
import { IProps, IRecord } from './types';
import { queryRecordApi } from './service';
import { usePaginated } from '@cffe/vc-hulk-table';
import { queryEnvsReq } from '@/pages/application/service';
import moment from 'moment';
import './index.less';

const rootCls = 'publish-record-compo';

const PublishRecord = (props: IProps) => {
  const { env, appCode,newPublish } = props;

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

  // useEffect(() => {
  //   queryDataSource({
  //     appCode,
  //     env,
  //     isActive: 0,
  //   });
  // }, []);
  useEffect(() => {
    queryDataSource({
      appCode,
      envTypeCode: env,
      pageIndex: 1,
    });
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

  let dom: any = document?.getElementById('load-more-list');
  let scrollTop = useRef<any>(dom?.scrollTop);

  const renderLoadMore = () => {
    const { pageSize = 0, total = 0, current = 0 } = tableProps?.pagination || {};

    return (
      total > 0 &&
      total > pageSize && (
        <div className={`${rootCls}-btns`}>
          <Button ghost type="dashed" loading={tableProps.loading} onClick={loadMore}>
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
          // loading={tableProps.loading}
          itemLayout="vertical"
          loadMore={renderLoadMore()}
          dataSource={tableProps.dataSource?.filter((v) => v?.envTypeCode === env) as IRecord[]}
          renderItem={(item) => (
            <List.Item>
              <div>
                <label>{recordFieldMapOut['modifyUser']}</label>:{item['modifyUser']}
              </div>
              <div>
                <label>{recordFieldMapOut['deployedTime']}</label>:
                {item['deployedTime'] ? moment(item['deployedTime']).format('YYYY-MM-DD HH:mm:ss') : null}
              </div>
              {item.deployStatus === 'multiEnvDeploying' && item.deploySubStates ? (
                <div>
                  <label>{recordFieldMapOut['deployStatus']}</label>:
                  {JSON.parse(item.deploySubStates).map((subItem: any) => (
                    <div>
                      <label>{subItem.envCode}</label>:
                      {
                        <span style={{ marginLeft: 6 }}>
                          <Tag color={recordDisplayMap[subItem['subState']]?.color || 'red'}>
                            {recordDisplayMap[subItem['subState']]?.text || '---'}
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
                      <Tag color={recordDisplayMap[item['deployStatus']]?.color || 'red'}>
                        {recordDisplayMap[item['deployStatus']]?.text || '---'}
                      </Tag>
                    </span>
                  }
                </div>
              )}
              <a onClick={() => handleShowDetail(item)}>详情</a>
            </List.Item>
          )}
        />
      ) : null}

      <Modal title="发布详情" width={600} visible={visible} footer={false} onCancel={() => setVisible(false)}>
        <VCDescription labelStyle={{ width: 90, justifyContent: 'flex-end' }} column={1} dataSource={curRecord} newPublish={newPublish} />
      </Modal>

      {/* <Modal title="发布详情" visible={visible} onCancel={() => setVisible(false)}>
        <VCDescription
          column={1}
          dataSource={Object.keys(recordFieldMap).map((field) => ({
            label: recordFieldMap[field],
            value: envNames[field],
          }))}
        />
      </Modal> */}
    </div>
  );
};

PublishRecord.defaultProps = {};

export default PublishRecord;

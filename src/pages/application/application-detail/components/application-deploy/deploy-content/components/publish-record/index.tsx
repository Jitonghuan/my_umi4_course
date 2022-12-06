/**
 * PublishRecord
 * @description 发布记录
 * @author moting.nq
 * @create 2021-04-25 16:05
 */

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Modal, Button, List, Tag, Tabs } from 'antd';
import VCDescription from '@/components/vc-description';
import DetailContext from '@/pages/application/application-detail/context';
import { recordFieldMapOut, recordDisplayMap } from './schema';
import moment from 'moment';
import axios from 'axios';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { IProps, IRecord } from './types';
import { queryRecordApi } from './service';
import { usePaginated } from '@cffe/vc-hulk-table';
import { queryEnvsReq } from '@/pages/application/service';
import './index.less';

import appConfig from '@/app.config';

const rootCls = 'publish-record-compo';

export default function PublishRecord(props: IProps) {
  const { env, appCode } = props;

  const { appData } = useContext(DetailContext);
  const { appCategoryCode, deploymentName, appType } = appData || {};

  const [intervalId, setIntervalId] = useState<any>(null);
  const [depVisible, setDepVisible] = useState<boolean>(false);
  const [npmJson, setNpmJson] = useState('');
  const [originNpmJson, setOriginNpmJson] = useState('');
  const [curVersion, setCurVersion] = useState('');
  const [curEnvCode, setCurEnvCode] = useState(''); // 只给依赖详情使用
  const [lastVersion, setLastVersion] = useState('');

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
  }, [appCode]);

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

    setIntervalId(intervalId);

    return () => {
      intervalId && clearInterval(intervalId);
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
          <Button
            ghost
            type="primary"
            onClick={() => {
              loadMore && loadMore();
              intervalId && clearInterval(intervalId);
            }}
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

  async function showDepDetail(item: any, i: number) {
    let data = tableProps.dataSource?.filter((v) => v?.envTypeCode === env) || [];
    let envCode = item.envs.split(',')[0];
    let res = null;
    let originRes = null;
    setNpmJson('');
    setOriginNpmJson('');
    setLastVersion('');
    setCurVersion(item.version);
    setCurEnvCode(envCode);
    try {
      res = await axios.get(
        `https://c2f-resource.oss-cn-hangzhou.aliyuncs.com/${envCode}/${deploymentName}/${item.version}/npm-tile.json`,
      );
      setNpmJson(res?.data ? JSON.stringify(res.data, null, '\t') : '');
    } catch (e) {}

    try {
      let lastItem = data.find(
        (val, j) =>
          val.deployStatus === 'finish' && j > i && val.envs.split(',').find((env: string) => env === envCode),
      );
      setLastVersion(lastItem?.version || '');
      if (lastItem) {
        originRes = await axios.get(
          `https://c2f-resource.oss-cn-hangzhou.aliyuncs.com/${envCode}/${deploymentName}/${lastItem.version}/npm-tile.json`,
        );
        setOriginNpmJson(originRes?.data ? JSON.stringify(originRes.data, null, '\t') : '');
      }
    } catch (e) {}
    setDepVisible(true);
  }

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布记录</div>
      {tableProps.dataSource?.filter((v) => v?.envTypeCode === env)?.length ? (
        <div>
          <List
            className="demo-loadmore-list"
            id="load-more-list"
            // loading={tableProps.loading}
            itemLayout="vertical"
            loadMore={renderLoadMore()}
            dataSource={tableProps.dataSource?.filter((v) => v?.envTypeCode === env) as IRecord[]}
            renderItem={(item, i) => (
              <List.Item>
                <div>
                  <label>{recordFieldMapOut['modifyUser']}</label>:{item['modifyUser']}
                </div>
                <div>
                  <label>{recordFieldMapOut['deployedTime']}</label>:
                  {moment(item['deployedTime']).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                {item.version && (
                  <div>
                    <label>版本号</label>:{item['version']}
                  </div>
                )}
                {item.deployStatus === 'multiEnvDeploying' && item.deploySubStates ? (
                  <div>
                    <label>{recordFieldMapOut['deployStatus']}</label>:
                    {JSON.parse(item.deploySubStates)?.map((subItem: any) => (
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
                {item.deployStatus === 'finish' &&
                  appConfig.IS_Matrix === 'public' &&
                  appType === 'frontend' &&
                  appCategoryCode === 'hbos' && (
                    <a style={{ marginLeft: '10px' }} onClick={() => showDepDetail(item, i)}>
                      依赖
                    </a>
                  )}
              </List.Item>
            )}
          />
        </div>
      ) : null}
      {depVisible && (
        <Modal
          title="依赖详情"
          width={1000}
          visible={depVisible}
          footer={false}
          onCancel={() => setDepVisible(false)}
          className="dependency-modal-wrapper"
        >
          <Tabs>
            <Tabs.TabPane tab="版本对比" key="0">
              <ReactDiffViewer
                oldValue={originNpmJson}
                newValue={npmJson}
                splitView={true}
                compareMethod={DiffMethod.WORDS}
                styles={{
                  variables: {
                    light: {
                      codeFoldGutterBackground: '#6F767E',
                      codeFoldBackground: '#E2E4E5',
                    },
                  },
                }}
                leftTitle={`上一次版本：${lastVersion}`}
                rightTitle={`当前版本：${curVersion}`}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="依赖详情" key="1">
              <a
                target="_blank"
                href={`https://c2f-resource.oss-cn-hangzhou.aliyuncs.com/${curEnvCode}/${deploymentName}/${curVersion}/npm.json`}
              >
                查看
              </a>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      )}
      <Modal title="发布详情" width={800} visible={visible} footer={false} onCancel={() => setVisible(false)}>
        <VCDescription labelStyle={{ width: 90, justifyContent: 'flex-end' }} column={1} dataSource={curRecord} />
      </Modal>
    </div>
  );
}

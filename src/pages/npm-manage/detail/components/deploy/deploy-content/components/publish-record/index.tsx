import React, { useState, useEffect } from 'react';
import {Modal, Button, List, Tag, Descriptions} from 'antd';
import { recordDisplayMap } from './schema';
import moment from 'moment';
import { IProps, IRecord } from './types';
import { queryRecordApi } from '@/pages/npm-manage/detail/server';
import { usePaginated } from '@cffe/vc-hulk-table';
import './index.less';

const rootCls = 'publish-record-compo';

export default function PublishRecord(props: IProps) {
  const { env, npmName } = props;

  const [curRecord, setcurRecord] = useState<IRecord>({});
  const [visible, setVisible] = useState<boolean>(false);

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
      npmName,
      npmEnvType: env,
      pageIndex: 1,
    });
  }, [npmName]);

  useEffect(() => {
    let intervalId = setInterval(() => {
      if (npmName && env) {
        queryDataSource({
          npmName,
          envTypeCode: env,
          pageIndex: 1,
        });
      }
    }, 8000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);


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
              loadMore;
              // timerHandle('stop');
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

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>发布记录</div>
      {tableProps.dataSource?.filter((v) => v?.envTypeCode === env)?.length ? (
        <div>
          <List
            className="demo-loadmore-list"
            id="load-more-list"
            itemLayout="vertical"
            loadMore={renderLoadMore()}
            dataSource={tableProps.dataSource?.filter((v) => v?.envTypeCode === env) as IRecord[]}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <label>发布人</label>:{item['npmDeployer']}
                </div>
                <div>
                  <label>发布时间</label>:
                  {moment(item['deployedTime']).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                {item.deployStatus === 'multiEnvDeploying' && item.deploySubStates ? (
                  <div>
                    <label>发布状态</label>:
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
                    <label>发布状态</label>:
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
        </div>
      ) : null}

      <Modal title="发布详情" width={800} visible={visible} footer={false} onCancel={() => setVisible(false)}>
        <Descriptions
          labelStyle={{ width: 100, justifyContent: 'flex-end' }}
          column={1}
        >
          <Descriptions.Item label="版本号">{curRecord?.npmVersion}</Descriptions.Item>
          <Descriptions.Item label="发布人">{curRecord?.npmDeployer}</Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {moment(curRecord?.deployedTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="发布完成时间">{curRecord?.deployFinishTime}</Descriptions.Item>
          <Descriptions.Item label="发布环境">{curRecord?.envs}</Descriptions.Item>
          <Descriptions.Item label="发布状态">
            {
              <Tag color={recordDisplayMap[curRecord?.deployStatus]?.color}>
                {recordDisplayMap[curRecord?.deployStatus]?.text}
              </Tag>
            }
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
}

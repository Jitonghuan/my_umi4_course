import React, { useState, useEffect } from 'react';
import { Modal, Button, List, Tag, Descriptions, Table } from 'antd';
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
  const [intervalId, setIntervalId] = useState<any>(null);

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
      appCode: npmName,
      isNpm: true,
      envTypeCode: env,
      pageIndex: 1,
    });
  }, [npmName]);

  useEffect(() => {
    let intervalId = setInterval(() => {
      if (npmName && env) {
        queryDataSource({
          appCode: npmName,
          isNpm: true,
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

  const getJenkinsUrl = (record: any) => {
    let jenkinsUrl = record?.jenkinsUrl ? JSON.parse(record.jenkinsUrl) : {};
    return jenkinsUrl?.singleBuild || '';
  }

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
                  <label>发布人: </label>{item['modifyUser']}
                </div>
                <div>
                  <label>发布时间:</label>
                  {moment(item['deployedTime']).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                <div>
                  <label>版本号: </label>{item.version}
                </div>
                <div>
                  <label>发布状态: </label>
                  {
                    <Tag color={recordDisplayMap[item?.deployStatus]?.color}>
                      {recordDisplayMap[item?.deployStatus]?.text}
                    </Tag>
                  }
                </div>
                <a style={{ marginTop: '5px' }} onClick={() => handleShowDetail(item)}>详情</a>
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
          <Descriptions.Item label="包名">{curRecord?.appCode}</Descriptions.Item>
          <Descriptions.Item label="版本号">{curRecord?.version}</Descriptions.Item>
          <Descriptions.Item label="发布人">{curRecord?.modifyUser}</Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {moment(curRecord?.deployedTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="发布完成时间">
            {curRecord?.deployFinishTime ? moment(curRecord?.deployFinishTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="发布描述">
            {curRecord?.deployDesc}
          </Descriptions.Item>
          <Descriptions.Item label="jenkins">
            {
              getJenkinsUrl(curRecord) && (
                <a href={getJenkinsUrl(curRecord)} target="_blank">
                  {getJenkinsUrl(curRecord)}
                </a>
              )
            }
          </Descriptions.Item>
          <Descriptions.Item label="发布状态">
            {
              <Tag color={recordDisplayMap[curRecord?.deployStatus]?.color}>
                {recordDisplayMap[curRecord?.deployStatus]?.text}
              </Tag>
            }
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginLeft: 28, display: 'block' }}>功能分支:</div>
        <div style={{ marginLeft: 28 }}>
          <Table
            scroll={{ y: window.innerHeight - 515, x: '100%' }}
            style={{ width: '96%' }}
            columns={[
              {
                title: '分支名',
                dataIndex: 'branchName',
                key: 'branchName',
                width: 188,
              },
              {
                title: '变更原因',
                dataIndex: 'modifyReason',
                width: 170,
              },
              {
                title: '创建人',
                dataIndex: 'createUser',
                width: 60,
              },
            ]}
            dataSource={curRecord?.branchInfo || []}
            pagination={false}
          />
        </div>
      </Modal>
    </div>
  );
}

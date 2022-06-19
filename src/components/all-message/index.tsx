// 查看全部消息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/16 12:16

import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Popconfirm, Card, List, Tag, Spin } from 'antd';
import { ReadOutlined, SoundOutlined, ThunderboltOutlined, SmileOutlined, TagOutlined } from '@ant-design/icons';
import './index.less';
import { useReadList, useQueryUnreadNum, useDeleteSystemNotice } from '@/common/hooks';

export interface MemberEditorProps {
  mode?: EditorMode;
  allData?: any;
  onClose: () => any;
  unreadNum: number;
  loadStemNoticeList: () => any;
}

export default function MemberEditor(props: MemberEditorProps) {
  const { mode, allData, onClose, unreadNum, loadStemNoticeList } = props;
  const [getReadList] = useReadList();
  const [loading, setLoading] = useState(false);
  const [unreadNumData, loadUnreadNum] = useQueryUnreadNum();
  const [deleteSystemNotice] = useDeleteSystemNotice();

  useEffect(() => {
    if (mode === 'HIDE' || !allData) return;
  }, [mode]);

  const oneKeyRead = () => {
    setLoading(true);
    let idsArry: any = [];
    allData?.map((item: any) => {
      idsArry.push(item.id);
    });
    getReadList(idsArry)
      .then((res) => {
        message.success('您已经一键已读了所有消息!');
        loadUnreadNum();
        loadStemNoticeList();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Drawer
      width={700}
      title="查看全部消息"
      placement="right"
      visible={mode !== 'HIDE'}
      onClose={onClose}
      maskClosable={false}
      footer={null}
    >
      <div className="message-caption">
        <div className="caption-left">
          <SoundOutlined /> 您当前共有<b>{unreadNum}</b>条未读消息
        </div>
        <div className="caption-right">
          {unreadNum !== 0 ? (
            <Spin spinning={loading}>
              <Tag color="geekblue" icon={<ReadOutlined />} onClick={oneKeyRead}>
                一键已读
              </Tag>
            </Spin>
          ) : (
            <Tag color="purple" icon={<SmileOutlined />}>
              暂无未读消息
            </Tag>
          )}
        </div>
      </div>
      <List
        dataSource={allData}
        // pagination={{
        //   onChange: page => {
        //     console.log(page);
        //   },
        //   pageSize: 10,
        // }}
        renderItem={(item: any) => (
          <List.Item>
            <Card
              title={
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className={item?.readed ? 'readed-title' : 'unReaded-title'}>
                    <TagOutlined />
                    <span style={{ paddingLeft: 8 }}>{item.title}</span>
                    <span style={{ fontSize: 10, paddingLeft: 8 }}>
                      {/* <Tag color={item?.readed === true ? 'green' : 'default'}> */}
                      <span className={item?.readed ? 'readed-title-wrap' : 'unReaded-title-wrap'}>
                        {item?.readed === true ? '已读' : '未读'}
                      </span>

                      {/* </Tag> */}
                    </span>
                  </span>
                  <span>
                    <span>
                      <Popconfirm
                        title="确认删除此条消息吗？"
                        onConfirm={() => {
                          deleteSystemNotice(item?.id).then(() => {
                            loadStemNoticeList();
                          });
                        }}
                      >
                        <Tag color="red"> 删除</Tag>
                      </Popconfirm>
                    </span>
                  </span>
                </span>
              }
              style={{ width: '100%' }}
              headStyle={{ padding: 4, height: 50 }}
              bodyStyle={{ padding: 6 }}
            >
              <p id={item.systemNoticeId} className={item?.readed ? 'readed-content' : 'unReaded-content'}>
                {item.content}
              </p>
            </Card>
          </List.Item>
        )}
      />
    </Drawer>
  );
}

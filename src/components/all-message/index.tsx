// 查看全部消息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/16 12:16

import React, { useState, useEffect } from 'react';
import { Drawer, message, Popconfirm, Card, List, Tag, Spin } from 'antd';
import { ReadOutlined, SoundOutlined, SmileOutlined, TagOutlined } from '@ant-design/icons';
import './index.less';
import { useReadList, useDeleteSystemNotice } from '@/common/hooks';

export interface allMessageProps {
  mode?: EditorMode;
  allData?: any;
  onClose: () => any;
  unreadNum: number;
  loadStemNoticeList: () => any;
  loadUnreadNum: () => any;
}

export default function AllMessage(props: allMessageProps) {
  const { mode, allData, onClose, unreadNum, loadStemNoticeList, loadUnreadNum } = props;
  const [getReadList] = useReadList();
  const [loading, setLoading] = useState(false);
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

  const changeReadStatus=(item:any)=>{
    console.log('item---message',item)
    getReadList([item?.id]).then(()=>{
      loadUnreadNum();
      loadStemNoticeList();
    })
  }

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
        renderItem={(item: any) => (
          <List.Item>
            <Card
              title={
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className={item?.readed ? 'readed-title' : 'unReaded-title'}>
                    <TagOutlined />
                    <span style={{ paddingLeft: 8 }}>{item.title}</span>
                    <span style={{ fontSize: 10, paddingLeft: 8 }}>
                      {
                         item?.readed === true ? 
                          <span className='readed-title-wrap' >
                           已读
                         </span> :  <span className='unReaded-title-wrap' onClick={()=>changeReadStatus(item)}>
                         未读
                      </span>
                      }
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

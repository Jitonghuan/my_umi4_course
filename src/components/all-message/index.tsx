// 查看全部消息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/16 12:16

import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Button, Card, List, Tag } from 'antd';
import { ReadOutlined, SoundOutlined, ThunderboltOutlined, TagOutlined } from '@ant-design/icons';
import './index.less';

export interface MemberEditorProps {
  mode?: EditorMode;
  curData?: any;
  onClose: () => any;
  unreadNum: number;
}

export default function MemberEditor(props: MemberEditorProps) {
  const { mode, curData, onClose, unreadNum } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'HIDE' || !curData) return;
  }, [mode]);

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
          <SoundOutlined /> 您当前共有<b>{unreadNum}</b>条消息
        </div>
        <div className="caption-right">
          <Tag color="geekblue" icon={<ReadOutlined />}>
            一键已读
          </Tag>
        </div>
      </div>
      <List
        dataSource={curData}
        renderItem={(item: any) => (
          <List.Item>
            <Card
              title={
                <span>
                  <TagOutlined />
                  <span style={{ paddingLeft: 8 }}>{item.title}</span>
                </span>
              }
              style={{ width: '100%' }}
              headStyle={{ padding: 4, height: 50 }}
              bodyStyle={{ padding: 6 }}
            >
              <p id={item.systemNoticeId}>{item.content}</p>
            </Card>
          </List.Item>
        )}
      />
    </Drawer>
  );
}

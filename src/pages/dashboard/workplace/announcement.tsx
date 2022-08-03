import React, { useState, useEffect } from 'react';
import { BorderBox13 } from '@jiaminghi/data-view-react';
import { Link, Card, Typography, Spin, Drawer, Modal, List } from '@arco-design/web-react';
import { useGetInfoList } from '../workplace/hook';
import { SendOutlined } from '@ant-design/icons';

function Announcement() {
  const [loading, total, data, getInfoList] = useGetInfoList();
  const [curContent, setCurContent] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  useEffect(() => {
    getInfoList({ type: 'announcement' });
    return () => {
      setVisible(false);
      setModalVisible(false);
    };
  }, []);
  return (
    <Card style={{ width: 374 }}>
      <div>
        <BorderBox13 style={{ width: '350px', height: '42vh', display: 'flex' }}>
          <Typography.Title heading={6} style={{ paddingLeft: 9, display: 'flex', justifyContent: 'space-between' }}>
            <span>Matrix公告</span>

            {total > 10 && (
              <Link
                style={{ paddingRight: 9 }}
                onClick={() => {
                  setModalVisible(true);
                }}
              >
                查看更多
              </Link>
            )}
          </Typography.Title>
          <Spin loading={loading} style={{ maxHeight: '100%' }}>
            <div style={{ maxHeight: '100%', overflow: 'auto' }}>
              {data?.map((item: any) => {
                return (
                  <li>
                    <p className="announcement-title" style={{ paddingLeft: 9, marginBottom: 5 }}>
                      {' '}
                      <a
                        onClick={() => {
                          setCurContent(item.content);
                          setVisible(true);
                        }}
                      >
                        <span>
                          <SendOutlined />{' '}
                        </span>
                        {item?.title}
                      </a>
                    </p>
                  </li>
                );
              })}
            </div>
          </Spin>
        </BorderBox13>
      </div>
      <Modal
        title="公告详情"
        style={{ width: '50%' }}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        footer={null}
      >
        <p dangerouslySetInnerHTML={{ __html: curContent }}></p>
      </Modal>
      <Drawer
        width={400}
        title={<span>更多公告信息</span>}
        visible={modalVisible}
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
      >
        <List
          style={{ width: 400 }}
          size="small"
          header="公告详情"
          dataSource={data}
          render={(item, index) => (
            <List.Item key={index}>
              <Card title={item.title} style={{ width: '100%' }} bodyStyle={{ padding: 6 }}>
                <p id={item.id}>{item.content}</p>
              </Card>
            </List.Item>
          )}
        />
        ,
      </Drawer>
    </Card>
  );
}

export default Announcement;

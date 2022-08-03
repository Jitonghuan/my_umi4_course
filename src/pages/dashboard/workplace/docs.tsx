import React, { useState, useEffect } from 'react';
import { Link, Card, Typography, Drawer, List } from '@arco-design/web-react';
import { BorderBox13 } from '@jiaminghi/data-view-react';
import { CarryOutOutlined } from '@ant-design/icons';
import styles from './style/docs.module.less';
import { useGetInfoList } from '../workplace/hook';
function QuickOperation() {
  const [loading, total, data, getInfoList] = useGetInfoList();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    getInfoList({ type: 'document' });
    return () => {
      setVisible(false);
    };
  }, []);

  return (
    <Card style={{ width: 374 }}>
      <BorderBox13 style={{ width: '350px', height: '40vh', display: 'flex' }}>
        <Typography.Title heading={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ display: 'inline-block', paddingLeft: 10 }}>Matrix文档中心</span>

          {total > 10 && (
            <Link
              style={{ paddingRight: 9 }}
              onClick={() => {
                setVisible(true);
              }}
            >
              查看更多
            </Link>
          )}
        </Typography.Title>

        <div className={styles.docs}>
          {data?.map((item: any) => {
            return (
              <div style={{ display: 'flex', paddingLeft: 16 }}>
                <a href={item.content} target="_blank">
                  {' '}
                  <CarryOutOutlined />
                  {item?.title}
                </a>
              </div>
            );
          })}
        </div>
      </BorderBox13>
      <Drawer
        width={400}
        title={<span>更多文档信息 </span>}
        visible={visible}
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
          header="文档"
          dataSource={data}
          render={(item, index) => (
            <List.Item key={index}>
              {' '}
              <Card title={item.title} style={{ width: '100%' }} bodyStyle={{ padding: 6 }}>
                <p id={item.id}>{item.content}</p>
              </Card>{' '}
            </List.Item>
          )}
        />
        ,
      </Drawer>
    </Card>
  );
}

export default QuickOperation;

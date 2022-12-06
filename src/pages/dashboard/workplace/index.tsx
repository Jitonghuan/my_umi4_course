import Shortcuts from './shortcuts';
import React, { useState, useEffect } from 'react';
import { useGetInfoList } from '../workplace/hook';
import { Tag } from 'antd';
import { Card,  Drawer, Modal, List } from '@arco-design/web-react';
import styles from './style/index.module.less';
import announce from '@/assets/imgs/announce.svg';
import doc from '@/assets/imgs/doc.svg';
import observable from '@/assets/imgs/observable.png';
import devlop from '@/assets/imgs/devlop.png';
import devops from '@/assets/imgs/devops.png';
import cloudNative from '@/assets/imgs/cloud-native.png';
import clusterManage from '@/assets/imgs/cluster-manage.png';
import './index.less';

function Workplace() {
  const [docLoading, docTotal, docData, getInfoList] = useGetInfoList();
  const [loading, total, data, getAnnounce] = useGetInfoList();
  const [curContent, setCurContent] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  useEffect(() => {
    getInfoList({ type: 'document' });
  }, []);

  useEffect(() => {
    getAnnounce({ type: 'announcement' });
    return () => {
      setVisible(false);
      setModalVisible(false);
    };
  }, []);

  const inThreeDays = (currntData: string) => {
    const nowHs = Date.now();
    const currentHs = new Date(currntData).getTime();
    const threeDays = nowHs - (1000 * 60 * 60 * 24 * 3)
    return threeDays < currentHs && currentHs < nowHs
  }

  return (
    <div className={styles.wrapper} style={{ height: '100%' }}>
      <div className='all-wrapper'>
        {/* 左侧部分 */}
        <div className='left-wrapper'>
          <div className='left-top'>
            <div className='title'>Matrix</div>
            <p className='desc'>企业级可演进云原生PaaS平台</p>
          </div>
          {/* 快捷入口 */}
          <div className='shortcuts'>
            <Shortcuts />
          </div>
          <div className='left-bottom'>
            {/* 公告 */}
            <div className='announce'>
              <img src={announce} style={{ marginRight: '10px' }} />
              公告
              <div className='announce-item'>
                {data && data.length ? data.slice(0, 2)?.map((item: any) => {
                  return (
                    <div className="announce-title">
                      <span
                        onClick={() => {
                          setCurContent(item.content);
                          setVisible(true);
                        }}
                      >
                        {item?.priority === 1 ? <Tag color="orange" style={{ marginRight: '5px' }}>置顶</Tag> : ''}
                        {inThreeDays(item?.gmtCreate) ? <Tag color="orange" style={{ marginRight: '5px' }}>新</Tag> : ''}
                        {item?.title}
                      </span>
                    </div>
                  );
                }) : null}
              </div>
              {total && total > 10 ? (
                <a onClick={() => {  }}>查看更多</a>
              ) : null}
            </div>

            {/* 文档中心 */}
            <div className='doc'>
              <img src={doc} style={{ marginRight: '10px' }} />文档中心
              <div className='doc-item'>
                {docData?.map((item: any) => {
                  return (
                    <div>
                      <a href={item.content} target="_blank">
                        {item?.title}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div >

        {/* 右侧部分 */}
        <div className='right-wrapper'>
          <div className="tip"><img src={devlop} alt="" /></div>
          <div className="tip"><img src={cloudNative} alt="" /></div>
          <div className="tip"><img src={observable} alt="" /></div>
          <div className="tip"><img src={devops} alt="" /></div>
          <div className="tip"><img src={clusterManage} alt="" /></div>

          <div className="cube large"><div className="img" /></div>
          <div className="cube small"><div className="img" /></div>
        </div>
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
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
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
    </div>
  );
}

export default Workplace;

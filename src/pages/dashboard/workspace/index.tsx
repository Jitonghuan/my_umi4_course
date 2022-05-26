import React from 'react';
import { Grid, Space } from '@arco-design/web-react';
import Overview from './overview';
import ContentPercentage from './content-percentage';
import Shortcuts from './shortcuts';
import Announcement from './announcement';
import Docs from './docs';
import styles from './style/index.module.less';
import './mock';

const { Row, Col } = Grid;

const gutter = 16;

function Workplace() {
  return (
    <>
      <div className="content-bg-mask">
        <div className="g-polygon g-polygon-1"></div>
        <div className="g-polygon g-polygon-2"></div>
        <div className="g-polygon g-polygon-3"></div>
      </div>
      <div className={styles.wrapper} style={{ height: 'calc(100vh - 60px)' }}>
        <Space size={16} direction="vertical" className={styles.left}>
          <Overview />
          <Shortcuts />
          <ContentPercentage />
        </Space>
        <Space className={styles.right} size={16} direction="vertical">
          <Announcement />
          <Docs />
        </Space>
      </div>
    </>
  );
}

export default Workplace;

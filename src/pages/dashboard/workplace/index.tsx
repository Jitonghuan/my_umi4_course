import { Grid, Space } from '@arco-design/web-react';
import Overview from './overview';
import ContentPercentage from './content-percentage';
import { ContentCard } from '@/components/vc-page-content';
import Shortcuts from './shortcuts';
import Announcement from './announcement';
import Docs from './docs';
import styles from './style/index.module.less';

function Workplace() {
  return (
    <ContentCard>
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
    </ContentCard>
  );
}

export default Workplace;

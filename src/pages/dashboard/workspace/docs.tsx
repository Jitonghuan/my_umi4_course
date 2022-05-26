import React from 'react';
import { Link, Card, Typography } from '@arco-design/web-react';
import { BorderBox13 } from '@jiaminghi/data-view-react';
import { CarryOutOutlined } from '@ant-design/icons';
// import useLocale from '@/utils/useLocale';
// import locale from './locale';
import styles from './style/docs.module.less';

const links = {
  react: 'https://arco.design/react/docs/start',
  vue: 'https://arco.design/vue/docs/start',
  designLab: 'https://arco.design/themes',
  materialMarket: 'https://arco.design/material/',
};
function QuickOperation() {
  // const t = useLocale(locale);

  return (
    <Card style={{ width: 374 }}>
      <BorderBox13 style={{ width: '350px', height: '40vh', display: 'flex' }}>
        <Typography.Title heading={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ display: 'inline-block', paddingLeft: 10 }}>Matrix文档中心</span>

          <Link style={{ paddingRight: 9 }}>查看更多</Link>
        </Typography.Title>
        <div className={styles.docs}>
          <div style={{ display: 'flex', paddingLeft: 16 }}>
            <a href="https://come-future.yuque.com/sekh46/bbgc7f/kfcnkf" target="_blank">
              {' '}
              <CarryOutOutlined />
              Matrix常见问题解决手册
            </a>
          </div>
          <div style={{ display: 'flex', paddingLeft: 16 }}>
            <a href="https://come-future.yuque.com/sekh46/bbgc7f/bw55re" target="_blank">
              <CarryOutOutlined />
              Matrix项目环境使用说明
            </a>
          </div>
          <div style={{ display: 'flex', paddingLeft: 16 }}>
            <a href="https://come-future.yuque.com/sekh46/bbgc7f/zmnt91" target="_blank">
              <CarryOutOutlined />
              Matrix配置管理使用说明
            </a>
          </div>
        </div>
      </BorderBox13>
    </Card>
  );
}

export default QuickOperation;

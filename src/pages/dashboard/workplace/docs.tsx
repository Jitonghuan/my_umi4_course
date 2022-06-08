import React from 'react';
import { Link, Card, Typography } from '@arco-design/web-react';
import { BorderBox13 } from '@jiaminghi/data-view-react';
import { CarryOutOutlined } from '@ant-design/icons';
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
            <a
              href="https://come-future.yuque.com/docs/share/77c2b619-a535-4293-ad40-4df39097b095?# 《Matrix操作手册》"
              target="_blank"
            >
              {' '}
              <CarryOutOutlined />
              Matrix操作手册
            </a>
          </div>
          <div style={{ display: 'flex', paddingLeft: 16 }}>
            <a
              href=" https://come-future.yuque.com/docs/share/50d14c30-ee00-49f6-b962-b74521ad7152?# 《Matrix建议收集文档-2021-12》"
              target="_blank"
            >
              {' '}
              <CarryOutOutlined />
              Matrix建议收集文档
            </a>
          </div>
          <div style={{ display: 'flex', paddingLeft: 16 }}>
            <a
              href="https://come-future.yuque.com/docs/share/5555591c-3004-4042-a1ca-288acb9bbc5c?# 《Matrix常见问题解决手册》"
              target="_blank"
            >
              {' '}
              <CarryOutOutlined />
              Matrix常见问题解决手册
            </a>
          </div>
          <div style={{ display: 'flex', paddingLeft: 16 }}>
            <a
              href="https://come-future.yuque.com/docs/share/33f741d9-04c8-409a-b80b-a87817ca0146?# 《Matrix项目环境使用说明》"
              target="_blank"
            >
              <CarryOutOutlined />
              Matrix项目环境使用说明
            </a>
          </div>
          <div style={{ display: 'flex', paddingLeft: 16 }}>
            <a
              href="https://come-future.yuque.com/docs/share/45cda8e0-186f-4d74-a3b6-7235fd1d3846?# 《matrix配置管理使用说明》"
              target="_blank"
            >
              <CarryOutOutlined />
              Matrix配置管理使用说明
            </a>
          </div>
          <div style={{ display: 'flex', paddingLeft: 16 }}>
            <a
              href=" https://come-future.yuque.com/docs/share/4940d04e-088c-4184-bff7-82afbffde451?# 《Matrix链路追踪使用说明》"
              target="_blank"
            >
              <CarryOutOutlined />
              Matrix链路追踪使用说明
            </a>
          </div>
        </div>
      </BorderBox13>
    </Card>
  );
}

export default QuickOperation;

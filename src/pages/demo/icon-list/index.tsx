// 图标列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import { useCallback } from 'react';
import { message } from '@cffe/h2o-design';
import { GlobalOutlined, HeartOutlined } from '@ant-design/icons';
import CustomIcon from '@cffe/vc-custom-icon';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { copy2Clipboard } from '@/common/util';
import appConfig from '@/app.config';
import './index.less';

// 以下 icon 是当前默认配置的 url 中支持的图标列表，用于导航栏
// 如果需要在页面中使用图标，请直接使用 @ant-design/icons 组件，参考: https://ant.design/components/icon-cn/
const dataList = [
  'icon-poc_maindata',
  'icon-poc_index',
  'icon-report',
  'icon-exit',
  'icon-code',
  'icon-home',
  'icon-poc_mining',
  'icon-defaul_avatar',
  'icon-atomic',
  'icon-diagnose',
  'icon-trend',
  'icon-table_settings',
  'icon-instructions',
  'icon-dataset',
  'icon-error',
  'icon-success',
  'icon-right_circle',
  'icon-refresh',
  'icon-time1',
  'icon-activity',
  'icon-ability',
  'icon-entity',
  'icon-extension',
  'icon-menu-dots',
];

export default function DemoIconList() {
  const handleItemClick = useCallback(async (str: string) => {
    await copy2Clipboard(str);
    message.success(`${str} 已经复制到剪贴板!`);
  }, []);

  return (
    <PageContainer>
      <ContentCard className="page-icon-list">
        <h2>导航栏图标示例</h2>
        <div className="icon-list clearfix">
          {dataList.map((str, index) => (
            <div className="icon-item" onClick={() => handleItemClick(str)}>
              <CustomIcon key={index} type={str} scriptUrl={appConfig.menuIconUrl} fontSize="28px" />
              <div className="icon-item-name">{str}</div>
            </div>
          ))}
        </div>

        <h2>AntD 图标示例</h2>
        <div className="icon-list clearfix">
          <div className="icon-item">
            <HeartOutlined style={{ fontSize: 28 }} />
            <div className="icon-item-name">HeartOutlined</div>
          </div>
          <div className="icon-item">
            <GlobalOutlined style={{ fontSize: 28 }} />
            <div className="icon-item-name">GlobalOutlined</div>
          </div>
        </div>
      </ContentCard>
    </PageContainer>
  );
}

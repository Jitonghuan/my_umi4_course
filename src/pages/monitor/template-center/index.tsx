import React, { useState } from 'react';
import { Tabs } from '@cffe/h2o-design';
import PageContainer from '@/components/page-container';
import Panel from '@/pages/monitor/board/component/panel';
import DataSource from '@/pages/monitor/board/component/datasource';
import AlarmTemplate from '../template/index';
import { history, useLocation } from 'umi';
import { parse } from 'query-string';
import { ContentCard } from '@/components/vc-page-content';

const rootCls = 'template-center-wrapper';

export default function Board() {
  let location: any = useLocation();
  const query: any = parse(location.search);
  const [activeKey, setActiveKey] = useState<string>(query?.tab || 'panel');

  return (
    <PageContainer className={rootCls}>
      <ContentCard>
      <div>
        <Tabs
          activeKey={activeKey}
          onChange={(val) => {
            setActiveKey(val);
            history.replace({
              pathname: '/matrix/monitor/template',
              search: `tab=${val}`,
            });
          }}
        >
          <Tabs.TabPane tab="大盘模版" key="panel" />
          <Tabs.TabPane tab="数据源" key="datasource" />
          <Tabs.TabPane tab="报警模版" key="template" />
        </Tabs>
        {activeKey === 'panel' && <Panel />}
        {activeKey === 'datasource' && <DataSource />}
        {activeKey === 'template' && <AlarmTemplate />}
      </div>

      </ContentCard>

    
    </PageContainer>
  );
}

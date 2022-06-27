import { useMemo, ReactNode } from 'react';
import { history } from 'umi';
import { Tabs, Spin } from 'antd';
import VCPermission from '@/components/vc-permission';
import PageContainer from '@/components/page-container';
import { FilterCard } from '@/components/vc-page-content';
import DetailContext from './context';
import { useNpmDetail } from './hooks';
import './index.less';

interface IProps {
  children: ReactNode;
  location: {
    pathname: string;
    query: {
      id: string;
      appCode: string;
    };
  };
  route: {
    name: string;
  };
}


const tabsConfig: any = [
  {
    name: '概述',
    key: 'overview'
  },
  {
    name: '分支',
    key: 'branch'
  },
  {
    name: '部署',
    key: 'deploy'
  },
  {
    name: '版本回滚',
    key: 'version'
  }
];

const detailPath = '/matrix/npm/detail';
const { TabPane } = Tabs;

export default function NpmDetail(props: IProps) {
  const { location, children } = props;
  const { id: appId, appCode } = location.query || {};
  const [npmData, isLoading, queryNpmData] = useNpmDetail(+appId, appCode);

  const tabActiveKey = useMemo(() => {
    return /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
  }, [location.pathname]);

  // 默认重定向到【概述】路由下
  if (location.pathname === detailPath) {
    return (
      history.replace({
        pathname: `${location.pathname}/overview`,
        query: { ...location.query },
      }),
        null
    );
  }

  // 没有数据的时整体不显示，防止出现空数据异常
  if (!npmData && isLoading) {
    return (
      <PageContainer>
        <div className="block-loading">
          <Spin tip="数据初始化中" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="application-detail-page">
      <FilterCard className="layout-compact">
        <Tabs
          activeKey={tabActiveKey}
          onChange={(key) => {
            history.replace({
              pathname: `${detailPath}/${key}`,
              query: { ...location.query },
            });
          }}
          tabBarExtraContent={
            <div className="tab-right-extra">
              <h4>{npmData?.appCode}</h4>
              <span>{npmData?.appName}</span>
            </div>
          }
        >
          {tabsConfig.map((item: any) => (
            <TabPane tab={item.name} key={item.key} />
          ))}
        </Tabs>
      </FilterCard>
      <DetailContext.Provider value={{ npmData, queryNpmData }}>
        <VCPermission code={window.location.pathname} isShowErrorPage>
          {children}
        </VCPermission>
      </DetailContext.Provider>
    </PageContainer>
  );
}

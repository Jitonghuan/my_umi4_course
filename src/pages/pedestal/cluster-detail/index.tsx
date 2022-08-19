import React, { useEffect, useState } from 'react';
import {  Select, Tabs} from 'antd';
import clusterContext from './context';
import PageContainer from '@/components/page-container';
import {  ContentCard } from '@/components/vc-page-content';
import './index.less';
import { useClusterListData } from '../cluster-info/hook';
import VCPermission from '@/components/vc-permission';
import { history,useLocation,Outlet } from 'umi';
import { parse } from 'query-string';
const { TabPane } = Tabs;

const TabList = [
  { label: '节点列表', key: 'node-list' },
  { label: '资源详情', key: 'resource-detail' },
];
const path = '/matrix/pedestal/cluster-detail';

export default function ClusterDetail(props: any) {
  let location:any = useLocation();
  const query :any= parse(location.search);
  console.log(query,'query')
  // const { location, children } = props;
  const { clusterCode, clusterName } = query || {};
  const [clusterOption, setClusterOption] = useState<any>([]);
  const [selectCluster, setSelectCluster] = useState<any>({ value: clusterCode || '', label: clusterName || '' });
  const [activeTab, setActiveTab] = useState<string>(query?.key || 'node-list');
  const [data, total] = useClusterListData({ pageSize: -1, pageIndex: -1 });
  useEffect(() => {
    if (data && data.length) {
      const res = data.map((item: any) => ({ value: item.clusterCode, label: item.clusterName }));
      setClusterOption(res);
    }
  }, [data]);

  useEffect(() => { }, []);

  useEffect(() => {
    setActiveTab(query?.key || 'node-list');


    // if(query?.key&&query?.key==="node-list"){
    //   location.search.substring()

    // }
    history.replace({
      pathname:location?.pathname,
      search:location.search+`&clusterCode=${selectCluster?.value}&clusterName=${selectCluster?.label }&key=${query?.key || 'node-list'}`
      // query: { ...props.location.query, clusterCode: selectCluster?.value, clusterName: selectCluster?.label },
      // query: { ...props.location.query, key: location?.query?.key || 'node-list', clusterCode: selectCluster?.value, clusterName: selectCluster?.label },
    });
  }, [location?.pathname]);

  useEffect(() => {
    if (!clusterCode) {
      setSelectCluster(clusterOption && clusterOption[0]);
    }
  }, [clusterOption]);

  // useEffect(() => {
  //     history.push({ query: { ...location.query, clusterCode: selectCluster?.value, clusterName: selectCluster?.label } });
  // }, [selectCluster])

  const selectChange = (v: any) => {
    setSelectCluster({ label: v.label, value: v.value });
    history.push({
      pathname: `${path}/${query?.key}`,
      search:`key=${query?.key}&clusterCode=${selectCluster?.value}&clusterName=${selectCluster?.label }`
      // query: { key: location?.query?.key, clusterCode: selectCluster?.value, clusterName: selectCluster?.label },
    });
  };

  return (
    <PageContainer className="cluster-main">
      <ContentCard>
        <div className="search-wrapper">
          <div>
            {' '}
            选择集群：
            <Select
              style={{ width: 200 }}
              size="small"
              value={selectCluster}
              onChange={selectChange}
              options={clusterOption}
              labelInValue
            ></Select>
          </div>
          <div>
            <span style={{ fontWeight: '600', fontSize: '16px', marginRight: '10px' }}>
              {selectCluster?.value || '---'}
            </span>
            <span style={{ color: '#776e6e', fontSize: '13px' }}>{selectCluster?.label || '---'}</span>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          // type='card'
          onChange={(key) => {
            setActiveTab(key);
            console.log("location.search",location.search)
            // console.log(query,"------------->")
            history.replace({
              pathname: `/matrix/pedestal/cluster-detail/${key}`,
              search:`clusterName=${clusterName}&clusterCode=${clusterCode}&key=${key}`
              // query: { clusterName, clusterCode, key: key },
            });
          }}
        >
          {TabList.map((item: any) => (
            <TabPane tab={item.label} key={item.key} />
          ))}
        </Tabs>
        <clusterContext.Provider
          value={{ clusterCode: selectCluster?.value || '', clusterName: selectCluster?.label || '' }}
        >
          <VCPermission code={window.location.pathname} isShowErrorPage>
            {selectCluster?.value ? <Outlet/> : <div className="tip-wrapper">请先选择集群</div>}
          </VCPermission>
        </clusterContext.Provider>
      </ContentCard>
    </PageContainer>
  );
}

import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Pagination, Empty, Spin } from 'antd';
import type { PaginationProps } from 'antd';
import Count from './component/count';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import ProgessComponent from './component/progress';
import { history } from 'umi';
import { STATUS_COLOR, STATUS_TEXT } from './type';
import { useClusterListData } from './hook';
import { getCluster } from './service';
import './index.less';

export default function clusterInfo() {
  const [visible, setVisble] = useState(false);
  const [form] = Form.useForm();
  const [searchCode, setSearchCode] = useState<string>('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [clusterDatas, total, loading, loadData] = useClusterListData({ pageIndex, pageSize });
  const [data, setData] = useState([]); //数据合集
  useEffect(() => {
    if (clusterDatas && clusterDatas.length !== 0) {
      setData(clusterDatas);
      getCluster({ needMetric: true, pageIndex, pageSize }).then((res: any) => {
        if (res?.success) {
          const data = res?.data?.dataSource || [];
          setData(data);
        }
      });
    } else {
      setData([]);
    }
  }, [clusterDatas]);

  const showTotal: PaginationProps['showTotal'] = (total) => `总共 ${total}条`;
  const pageChange = (page: number, pageSize: number) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };
  const handleSearch = () => {
    setPageIndex(1);
    const value = form.getFieldsValue();
    loadData({ ...value, pageIndex: 1 });
  };
  return (
    <PageContainer className="cluster-info">
      <ContentCard>
        <div className="search-wrapper">
          <Form layout="inline" form={form}>
            <Form.Item name="clusterCode">
              <Input placeholder="请输入集群code" allowClear style={{ width: 240 }} />
            </Form.Item>
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={handleSearch}>
              查询
            </Button>
          </Form>
        </div>
        <div className="flex-space-between" style={{ margin: '5px 0px' }}>
          <h3>集群概览</h3>
          <Button type="primary" disabled>
            新增集群
          </Button>
        </div>
        {data.length > 0 || loading ? (
          <Spin spinning={loading}>
            {data.map((item: any) => (
              <div className="list-wrapper">
                {/* 第一个单元格 */}
                <div className="list-wrapper-item">
                  <a
                    className="item-top"
                    style={{ color: '#5183e7' }}
                    onClick={() => {
                   
                      history.push({
                        pathname: `/matrix/pedestal/cluster-detail/resource-detail`,
                        search: `clusterCode=${item.clusterCode}&clusterName=${item.clusterName}`,
                      },
                        {
                          clusterInfo: item
                        });
                    }}
                  >
                    {item.clusterName || '----'}
                  </a>
                  <div className="display-item" style={{ justifyContent: 'flex-start' }}>
                    节点数：{item?.items?.length || 0}
                    <Count data={item?.items || []}></Count>
                  </div>
                </div>
                {/* 第二个单元格 */}
                <div className="list-wrapper-item">
                  <div className="item-top">CODE:{item.clusterCode}</div>
                  <div className="display-item">
                    <div className="bottom">
                      CPU:
                      {item?.metricInfo?.cpuInfo?.unit
                        ? `${item?.metricInfo?.cpuInfo?.usage}/${item?.metricInfo?.cpuInfo?.total}`
                        : '-'}
                      <span style={{ marginLeft: '2px' }}>{item?.metricInfo?.cpuInfo?.unit}</span>
                      <span style={{ marginLeft: '2px' }}>
                        {' '}
                        {item?.metricInfo?.cpuInfo?.percentage
                          ? `${((item?.metricInfo?.cpuInfo?.percentage || 0) * 100).toFixed(2)}%`
                          : ''}
                      </span>
                    </div>
                    {/* <ProgessComponent percent={(item?.metricInfo?.cpuInfo?.percentage) * 100 || 0} /> */}
                    <ProgessComponent percent={item?.metricInfo?.cpuInfo?.percentage * 100 || 0} />
                  </div>
                </div>
                {/* 第三个单元格 */}
                <div className="list-wrapper-item">
                  <div className="item-top">版本:{item.clusterVersion}</div>
                  <div className="display-item">
                    <div className="bottom">
                      内存:
                      {item?.metricInfo?.memoryInfo?.unit
                        ? `${item?.metricInfo?.memoryInfo?.usage}/${item?.metricInfo?.memoryInfo?.total}`
                        : '-'}
                      <span style={{ marginLeft: '2px' }}> {item?.metricInfo?.memoryInfo?.unit}</span>
                      <span style={{ marginLeft: '2px' }}>
                        {' '}
                        {item?.metricInfo?.memoryInfo?.percentage
                          ? `${((item?.metricInfo?.memoryInfo?.percentage || 0) * 100).toFixed(2)}%`
                          : ''}
                      </span>
                    </div>
                    <ProgessComponent percent={item?.metricInfo?.memoryInfo?.percentage * 100 || 0} />
                  </div>
                </div>
                {/* 第四个单元格 */}
                <div className="list-wrapper-item-last">
                  <div className="last-item" style={{ flex: '1' }}>
                    集群状态：
                    <span style={{ color: `${STATUS_COLOR[item?.status] || '#857878'}` }}>
                      {STATUS_TEXT[item?.status] || '-'}
                    </span>
                  </div>
                  <div className="last-item " style={{ flex: '1' }}>
                    集群类型：{item.clusterType}
                  </div>
                  <div className="last-item display-item" style={{ flex: '1' }}>
                    <span className="bottom">
                      磁盘：
                      {item?.metricInfo?.diskInfo?.unit
                        ? `${item?.metricInfo?.diskInfo?.usage}/${item?.metricInfo?.diskInfo?.total}`
                        : '-'}
                      <span style={{ marginLeft: '2px' }}> {item?.metricInfo?.diskInfo?.unit}</span>
                      <span style={{ marginLeft: '2px' }}>
                        {' '}
                        {item?.metricInfo?.diskInfo?.percentage
                          ? `${((item?.metricInfo?.diskInfo?.percentage || 0) * 100).toFixed(2)}%`
                          : ''}
                      </span>
                    </span>
                    <ProgessComponent percent={item?.metricInfo?.diskInfo?.percentage * 100 || 0} />
                  </div>
                </div>
              </div>
            ))}
            <div className="page-wrapper">
              {data.length > 0 && (
                <Pagination
                  size="small"
                  total={total}
                  showTotal={showTotal}
                  pageSize={pageSize}
                  current={pageIndex}
                  onChange={pageChange}
                />
              )}
            </div>
          </Spin>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
        )}
      </ContentCard>
    </PageContainer>
  );
}

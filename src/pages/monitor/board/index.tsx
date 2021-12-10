import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Tabs, Card, Form, Input, Spin, Select, Divider } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

import PageContainer from '@/components/page-container';
import VCCardLayout from '@cffe/vc-b-card-layout';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { queryEnvLists, queryResUseData, queryNodeUseDataApi, queryUseMarketData } from './service';
import { resUseTableSchema } from './schema';

import './index.less';
import { getColorByValue } from './../util';

type ITab = {
  /** key */
  key: string;

  /** title */
  title: string | React.ReactNode;
};

type ICard = {
  mode?: '1' | '2'; // 1 为资源使用率，2 为方块节点数
  /** 标题 */
  title?: string;
  /** 值 */
  value?: string;
  /** 单位 */
  unit?: string;
  /** 警示 */
  warn?: string;
  /** 颜色 */
  color?: string;
  /** 方块显示数据源 */
  dataSource?: ICard[];
};

const gridData = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 4,
  xxl: 4,
  xxxl: 4,
};

const { ColorContainer } = colorUtil.context;

// 大盘数据结构
type IMarket = {
  name: string;
  href: string;
};

/**
 * Board
 * @description 监控面板
 * @create 2021-04-12 19:13:58
 */
const Coms = (props: any) => {
  const [tabData, setTabData] = useState<ITab[]>();
  const [currentTab, setCurrentTab] = useState<string>('');
  const tabList = [
    { label: 'DEV', value: 'dev' },
    { label: 'PRE', value: 'pre' },
    { label: 'PROD', value: 'prod' },
  ];
  const [cardDataLists, setCardDataLists] = useState<ICard[]>([]);
  const [useMarket, setUseMarket] = useState<IMarket[]>([]);
  const [searchParams, setSearchParams] = useState<any>();
  // const [nodeDetailShow, setNodeDetailShow] = useState<boolean>(false);
  // const prevNode = useRef<INode>()
  const [resLoading, setResLoading] = useState<boolean>(false);
  const [searchField] = Form.useForm();

  // 查询机构列表
  const queryEnvList = () => {
    queryEnvLists().then((list) => {
      setTabData(list);
      if (list.length) {
        setCurrentTab(`${list[0].key}`);
      }
    });
  };

  // 查询资源使用情况
  const queryResData = () => {
    setResLoading(true);
    queryResUseData({ clusterId: currentTab })
      .then((res) => {
        setCardDataLists(res as ICard[]);
      })
      .finally(() => {
        setResLoading(false);
      });
  };

  // 查询节点使用率
  const {
    run: queryNodeList,
    reset,
    tableProps,
  } = usePaginated({
    requestUrl: queryNodeUseDataApi,
    requestMethod: 'GET',
    effectParams: searchParams,
    showRequestError: true,
    initPageInfo: {
      total: 0,
      pageSize: 20,
    },
    pagination: {
      showSizeChanger: true,
      pageSizeOptions: ['20', '50', '100', '1000'],
    },
    formatRequestParams: (params) => {
      return {
        ...params,
        clusterId: currentTab,
      };
    },
    formatResult: (resp) => {
      const { dataSource = [], pageInfo = {} } = resp.data;
      const result = dataSource.map((item: Record<string, object>) => {
        const key = Object.keys(item)[0];
        return {
          ip: key,
          ...item[key],
        };
      });

      return {
        dataSource: result,
        pageInfo,
      };
    },
  });

  // 查询已安装大盘
  const queryUseMarket = () => {
    queryUseMarketData({ clusterId: currentTab }).then((res) => {
      setUseMarket(res);
    });
  };

  useEffect(() => {
    queryEnvList();
  }, []);

  useEffect(() => {
    if (currentTab) {
      queryResData();
      reset();
      queryNodeList();
      queryUseMarket();
    }
  }, [currentTab]);

  const handleTabChange = (activeKey: string) => {
    setCurrentTab(activeKey);
  };

  // const handleIpClick = (record: INode) => {
  //   if (record.href) {
  //     prevNode.current = record;
  //     setNodeDetailShow(true);
  //   }
  // }

  // 页面刷新
  const handleRefresh = () => {
    queryResData();
    reset();
    queryNodeList();
    queryUseMarket();
  };

  // 获取资源使用率图
  const getChartOptions: any = useCallback((title: string, percent: number | string, color?: string) => {
    const percentNum = Number(percent);
    const options = {
      grid: {
        left: '0',
        right: '0',
        top: '0',
        bottom: '0',
      },
      tooltip: {
        trigger: 'item',
        formatter(param: any) {
          return `${param.name}<br/>${param.marker}${param.value}%`;
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '90%'],
          label: {
            show: false,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: percentNum,
              name: title,
              itemStyle: { color: color || '#439D75' },
            },
            {
              value: (100 - percentNum).toFixed(2),
              name: '空闲',
              itemStyle: { color: '#ddd' },
            },
          ],
        },
      ],
    };

    return options;
  }, []);

  const handleSearchRes = () => {
    setSearchParams(searchField.getFieldsValue());
  };

  // 顶部的 card
  const renderCard = (record: ICard) => {
    const { mode = '1', title, value = '-', unit = '', dataSource = [] } = record;

    return mode === '1' ? (
      <Card className="monitor-card-item">
        <h4 className="monitor-card-item-title">{title}</h4>
        <div className="monitor-card-item-content">
          <span className="monitor-card-item-val">
            {value || '-'}
            {unit || ''}
          </span>
          <div className="monitor-card-item-chart">
            <ColorContainer roleKeys={['color']}>
              <EchartsReact option={getChartOptions(title, value)} />
            </ColorContainer>
          </div>
        </div>
      </Card>
    ) : (
      <Card className="mode-table" bodyStyle={{ padding: '16px' }}>
        {dataSource.map((el) => (
          <div className="mode-table-item">
            <h4 className="title">{el.title}</h4>
            <div className="value" style={{ color: el.color }}>
              {el.value || '-'}
              {el.unit || ''}
            </div>
          </div>
        ))}
      </Card>
    );
  };

  return (
    <PageContainer className="monitor-board">
      <Card className="monitor-board-content">
        <Tabs activeKey={currentTab} type="card" className="monitor-tabs" onChange={handleTabChange}>
          {tabData?.map((el) => (
            <Tabs.TabPane key={el.key} tab={el.title} />
          ))}
        </Tabs>
        <div style={{ marginLeft: 28, fontSize: 16 }}>
          <span>选择集群:</span>
          <Select style={{ width: 140 }}></Select>
        </div>
        <Divider />
        <div className="monitor-tabs-content">
          <Spin spinning={resLoading}>
            <h3 className="monitor-tabs-content-title">
              集群资源概览
              <RedoOutlined className="monitor-tabs-content-title-btns" onClick={handleRefresh} />
            </h3>
            <div className="monitor-tabs-content-sec">
              <VCCardLayout grid={gridData}>{cardDataLists.map((el) => renderCard(el))}</VCCardLayout>
            </div>
          </Spin>

          <div className="table-caption" style={{ marginTop: 28 }}>
            <h3 className="monitor-tabs-content-title" style={{ margin: 0 }}>
              节点资源明细
            </h3>
            <Form form={searchField} layout="inline">
              <Form.Item name="keyword">
                <Input.Search placeholder="搜索主机名、IP" style={{ width: 320 }} onSearch={handleSearchRes} />
              </Form.Item>
            </Form>
          </div>
          <div className="monitor-tabs-content-sec">
            <HulkTable
              rowKey="id"
              size="small"
              columns={resUseTableSchema as any}
              scroll={{ y: 313 }}
              {...tableProps}
              customColumnMap={{
                // ip: (value, record) => {
                //   return <span className="monitor-tabs-content-ip" onClick={() => handleIpClick(record)}>{record.ip}</span>
                // },
                cpuUsageRate: (value, record) => {
                  return (
                    <span className="monitor-tabs-content-tag" style={{ backgroundColor: getColorByValue(value) }}>
                      {value}%
                    </span>
                  );
                },
                memoryUsageRate: (value, record) => {
                  return (
                    <span className="monitor-tabs-content-tag" style={{ backgroundColor: getColorByValue(value) }}>
                      {value}%
                    </span>
                  );
                },
                diskUsageRate: (value, record) => {
                  return (
                    <span className="monitor-tabs-content-tag" style={{ backgroundColor: getColorByValue(value) }}>
                      {value}%
                    </span>
                  );
                },
              }}
            />
          </div>

          <h3 className="monitor-tabs-content-title">已安装大盘</h3>
          <div className="monitor-tabs-content-sec">
            {useMarket.map((el) => (
              <span
                className="monitor-market-item"
                onClick={() => {
                  window.open(el.href, '_blank');
                }}
              >
                {el.name}
              </span>
            ))}
          </div>
        </div>
      </Card>
      {/* <Drawer
        title="节点明细"
        visible={nodeDetailShow}
        onClose={() => setNodeDetailShow(false)}
        width={'98%'}
      >
        {nodeDetailShow && <iframe style={{ width: '100%', height: '99%', border: 'none' }} src={prevNode.current?.href}></iframe>}
      </Drawer> */}
    </PageContainer>
  );
};

export default Coms;

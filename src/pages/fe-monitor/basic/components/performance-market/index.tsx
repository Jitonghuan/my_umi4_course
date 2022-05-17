import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Line, Bar, Column } from '@cffe/hulk-wave-chart';
import { getPerformanceDetail } from '../../server';
import moment from 'moment';
import { groupItem } from '../../const';
import './index.less';

interface IProps {
  url: string;
  param: any;
}

const performanceItem = ['tti', 'ttfb', 'lcp', 'fcp', 'fid', 'root-paint']; // 性能项

const PerformanceMarket = ({ url, param }: IProps) => {
  const [activeTab, setActiveTab] = useState<string>('tti');
  const [trendChart, setTrendChart] = useState<any>(null);
  const [distributedChart, setDistributedChart] = useState<any>(null);
  const [indicatorChart, setIndicatorChart] = useState<any>(null);
  const [waterfallChart, setWaterfallChart] = useState<any>(null);
  const [indicatorData, setIndicatorData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  // 载入时长趋势
  async function renderTrendChart() {
    if (!trendChart) {
      return;
    }
    setLoading(true);
    const res = await getPerformanceDetail({
      url,
      ...param,
      chartType: 'loadTimeTrend',
    });
    setLoading(false);
    const loadTimeTrend = res?.data?.loadTimeTrend;
    const data = [];
    if (loadTimeTrend?.avgTime?.length) {
      data.unshift(['日期', '平均载入时长(秒)', '最小载入时长(秒)', '最大载入时长(秒)']);
      for (let i = 0; i < loadTimeTrend.avgTime.length; i++) {
        data.push([
          moment(loadTimeTrend.avgTime[i][0]).format('YYYY-MM-DD HH:mm'),
          (loadTimeTrend.avgTime[i][1] / 1000).toFixed(2),
          (loadTimeTrend.minTime[i][1] / 1000).toFixed(2),
          (loadTimeTrend.maxTime[i][1] / 1000).toFixed(2),
        ]);
      }
    }
    trendChart.data(data);
    trendChart?.draw();
  }

  // 载入时长分布
  async function renderDistributedChart() {
    if (!distributedChart) {
      return;
    }
    const res = await getPerformanceDetail({
      url,
      ...param,
      chartType: 'loadTimeDistribution',
    });
    const data = res?.data?.loadTimeDistribution || [];
    let list = [];
    let arr = [];
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        for (const key in data[i]) {
          list.push([data[i][key], key]);
        }
      }
      for (const item of groupItem) {
        let val = list.find((val) => val[1] === item.key);
        if (val) {
          arr.push([val[0], item.name]);
        }
      }
    }
    distributedChart?.data(arr);
    distributedChart?.draw();
  }

  // 关键性能指标
  async function renderIndicatorChart() {
    if (!indicatorChart) {
      return;
    }
    const res = await getPerformanceDetail({
      url,
      ...param,
      chartType: 'keyPerformanceIndicator',
    });

    const indicator = res?.data?.keyPerformanceIndicator || {};
    setIndicatorData(indicator);
    drawIndicatorChart(indicator);
  }

  function drawIndicatorChart(indicator?: any) {
    const Obj = indicator || indicatorData;
    const data = [];
    if (Obj[activeTab]?.length) {
      data.push(['日期', '时长(毫秒)']);
      for (let i = 0; i < Obj[activeTab].length; i++) {
        let item: any = Obj[activeTab][i];
        data.push([moment(item[0]).format('YYYY-MM-DD HH:mm'), item[1].toFixed(2)]);
      }
    }
    indicatorChart?.data(data);
    indicatorChart?.draw();
  }

  // 页面加载瀑布图
  async function renderWaterfallChart() {
    if (!waterfallChart) {
      return;
    }
    const res = await getPerformanceDetail({
      url,
      ...param,
      chartType: 'pageLoadWaterfallChart',
    });
    const data = res?.data?.pageLoadWaterfallChart || [];
    const list = [];
    if (data.length) {
      list.push(['指标', '时长(秒)']);
      for (let i = 0; i < data.length; i++) {
        for (const key in data[i]) {
          list.push([key, (data[i][key] / 1000).toFixed(key === 'fid' ? 4 : 2)]);
        }
      }
    }
    waterfallChart?.data(list);
    waterfallChart?.draw();
  }

  useEffect(() => {
    setTrendChart(
      new Line({
        dom: document.querySelector('.trend-chart'),
        fieldMap: { x: ['日期'], y: ['平均载入时长(秒)', '最小载入时长(秒)', '最大载入时长(秒)'] },
        layout: {
          padding: [50, 20, 40, 40],
        },
        xAxis: {
          labelInterval: 2,
        },
        title: {
          isShow: false,
        },
        secondTitle: {
          isShow: false,
        },
        line: {
          isCustomColor: true,
          isShowLable: false,
          customColor: ['#657CA6', '#4BA2FF', '#54DA81'],
        },
        yAxis: {
          name: ' ',
        },
        tooltip: {
          isShow: true,
        },
      }),
    );

    setDistributedChart(
      new Bar({
        dom: document.querySelector('.distributed-chart'),
        fieldMap: {
          x: ['耗时'],
          y: ['20', '10,20', '5,10', '2,5', '1,2', '1'],
        },
        layout: {
          padding: [20, 40, 40, 120],
        },
        bar: {
          isCustomColor: true,
          customColor: ['#4BA2FF'],
        },
        title: {
          isShow: false,
        },
        secondTitle: {
          isShow: false,
        },
        xAxis: {
          name: '次数',
        },
        tooltip: {
          isShow: true,
        },
      }),
    );

    setIndicatorChart(
      new Line({
        dom: document.querySelector('.indicator-chart'),
        fieldMap: { x: ['日期'], y: ['时长(毫秒)'] },
        layout: {
          padding: [40, 20, 40, 40],
        },
        title: {
          isShow: false,
        },
        legend: {
          isShow: false,
        },
        secondTitle: {
          isShow: false,
        },
        line: {
          isCustomColor: true,
          isShowLable: false,
          customColor: ['#4ba2ff'],
        },
        yAxis: {
          name: '毫秒',
        },
        xAxis: {
          labelInterval: 2,
        },
        tooltip: {
          isShow: true,
        },
      }),
    );
    setWaterfallChart(
      new Column({
        dom: document.querySelector('.waterfall-chart'),
        fieldMap: {
          x: ['指标'],
          y: ['时长(秒)'],
        },
        bar: {
          isCustomColor: true,
          customColor: ['#4BA2FF'],
        },
        layout: {
          padding: [50, 40, 40, 50],
        },
        title: {
          isShow: false,
        },
        secondTitle: {
          isShow: false,
        },
        yAxis: {
          name: ' ',
        },
        xAxis: {
          name: '指标',
        },
        tooltip: {
          isShow: true,
        },
      }),
    );

    return () => {
      trendChart?.destroy();
      distributedChart?.destroy();
      indicatorChart?.destroy();
      waterfallChart?.destroy();
    };
  }, []);

  useEffect(() => {
    void renderTrendChart();
  }, [trendChart]);

  useEffect(() => {
    void renderDistributedChart();
  }, [distributedChart]);

  useEffect(() => {
    void renderIndicatorChart();
  }, [indicatorChart]);

  useEffect(() => {
    void renderWaterfallChart();
  }, [waterfallChart]);

  useEffect(() => {
    void drawIndicatorChart();
  }, [activeTab]);

  return (
    <div className="performance-market-wrapper">
      <Spin spinning={loading}>
        <div className="market-item">
          <div>
            <div className="chart-title">载入时长趋势</div>
            <div className="trend-chart chart-item"></div>
          </div>
          <div>
            <div className="chart-title">载入时长区间分布</div>
            <div className="distributed-chart chart-item"></div>
          </div>
        </div>
        <div className="market-item mar-t-12">
          <div>
            <div className="chart-title">关键性能指标趋势</div>
            <div className="chart-tab-wrapper">
              {performanceItem.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                  }}
                >
                  <span style={{ backgroundColor: activeTab === item ? '#4ba2ff' : '#ccc' }}></span>
                  {item}
                </div>
              ))}
            </div>
            <div className="indicator-chart chart-item"></div>
          </div>
          <div>
            <div className="chart-title">关键性能指标平均时长</div>
            <div className="waterfall-chart chart-item"></div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default PerformanceMarket;

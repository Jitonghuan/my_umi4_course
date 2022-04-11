import React, { useEffect, useState } from 'react';
import { Line, Bar } from '@cffe/hulk-wave-chart';
import './index.less';

const performanceItem = ['tti', 'ttfb', 'lcp', 'fcp', 'fid', 'root-paint']; // 性能项

const PerformanceMarket = () => {
  const [trendChart, setTrendChart] = useState<any>(null);
  const [distributedChart, setDistributedChart] = useState<any>(null);
  const [indicatorChart, setIndicatorChart] = useState<any>(null);

  function renderTrendChart() {
    trendChart?.data([
      ['日期', '平均载入时长（s）', '最小载入时长（s）', '最大载入时长（s）'],
      ['北京', '100', '200'],
      ['北京1', '200', '300'],
      ['北京2', '800', '400'],
      ['北京3', '500', '500'],
      ['北京4', '700', '600'],
      ['北京5', '400', '800'],
      ['北京6', '300', '200'],
    ]);
    trendChart?.draw();
  }

  function renderDistributedChart() {
    distributedChart?.data([
      ['日期', '1s≥载入时长', '2s≥载入时长>1s', '5s≥载入时长>2s', '10s≥载入时长>5s', '20s≥载入时长>10s'],
      ['北京', '100', '200', '100', '200', '100'],
      ['北京1', '200', '300', '100', '200', '200'],
      ['北京2', '800', '400'],
      ['北京3', '500', '500'],
      ['北京4', '700', '600'],
      ['北京5', '400', '800'],
      ['北京6', '300', '200'],
    ]);
    distributedChart?.draw();
  }

  function renderIndicatorChart() {
    indicatorChart?.data([
      ['日期'].concat(performanceItem),
      ['北京', '100', '200'],
      ['北京1', '200', '300'],
      ['北京2', '800', '400'],
      ['北京3', '500', '500'],
      ['北京4', '700', '600'],
      ['北京5', '400', '800'],
      ['北京6', '300', '200'],
    ]);
    indicatorChart?.draw();
  }

  useEffect(() => {
    setTrendChart(
      new Line({
        dom: document.querySelector('.trend-chart'),
        fieldMap: { x: ['日期'], y: ['平均载入时长（s）', '最小载入时长（s）', '最大载入时长（s）'] },
        layout: {
          padding: [80, 40, 40, 40],
        },
        title: {
          isShow: false,
        },
        secondTitle: {
          isShow: false,
        },
        line: {
          isCustomColor: true,
          customColor: ['#657CA6', '#4BA2FF', '#54DA81'],
        },
        yAxis: {
          name: '',
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
          x: ['日期'],
          y: ['1s≥载入时长', '2s≥载入时长>1s', '5s≥载入时长>2s', '10s≥载入时长>5s', '20s≥载入时长>10s'],
        },
        layout: {
          padding: [80, 40, 40, 40],
        },
        title: {
          isShow: false,
        },
        secondTitle: {
          isShow: false,
        },
        yAxis: {
          name: '',
        },
        tooltip: {
          isShow: true,
        },
      }),
    );

    setIndicatorChart(
      new Line({
        dom: document.querySelector('.indicator-chart'),
        fieldMap: { x: ['日期'], y: performanceItem },
        layout: {
          padding: [80, 40, 40, 40],
        },
        title: {
          isShow: false,
        },
        secondTitle: {
          isShow: false,
        },
        line: {
          isCustomColor: true,
          customColor: ['#657CA6', '#5C61F3', '#4BA2FF', '#54DA81', '#FFCB30'],
        },
        yAxis: {
          name: '',
        },
        tooltip: {
          isShow: true,
        },
      }),
    );
  }, []);

  useEffect(() => {
    renderTrendChart();
  }, [trendChart]);

  useEffect(() => {
    renderDistributedChart();
  }, [distributedChart]);

  useEffect(() => {
    renderIndicatorChart();
  }, [indicatorChart]);

  return (
    <div className="performance-market-wrapper">
      <div className="market-item">
        <div>
          <div className="chart-title">载入时长趋势</div>
          <div className="trend-chart chart-item"></div>
        </div>
        <div>
          <div className="chart-title">载入时长分布</div>
          <div className="distributed-chart chart-item"></div>
        </div>
      </div>
      <div className="market-item mar-t-12">
        <div>
          <div className="chart-title">关键性能指标</div>
          <div className="indicator-chart chart-item"></div>
        </div>
        <div>
          <div className="chart-title">页面加载瀑布图</div>
          <div className="waterfall-chart chart-item"></div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMarket;

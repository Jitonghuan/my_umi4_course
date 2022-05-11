import React, { useEffect, useState } from 'react';
import Header from '../header';
import { Line } from '@cffe/hulk-wave-chart';
import { now } from '../../const';
import moment from 'moment';
import { pvAndUvChart, queryOverview } from '../../server';
import './index.less';

interface IProps {
  appGroup: string;
  envCode: string;
}

const BasicOverview = ({ appGroup, envCode }: IProps) => {
  const [timeList, setTimeList] = useState<any>(now);
  const [feEnv, setFeEnv] = useState<string>('*');
  const [overviewList, setOverviewList] = useState<any[]>([]);
  const [chart, setChart] = useState<any>(null);

  function getParam() {
    let param: any = {
      envCode,
      feEnv,
      startTime: timeList[0] ? moment(timeList[0]).unix() : null,
      endTime: timeList[1] ? moment(timeList[1]).unix() : null,
    };
    if (appGroup) {
      param = {
        ...param,
        appGroup,
      };
    }
    return param;
  }

  // 汇总
  async function onOverview() {
    const res = await queryOverview(getParam());
    setOverviewList(res?.data || []);
  }

  // pv uv趋势图
  async function getPvUv() {
    if (!chart) {
      return;
    }
    const res = await pvAndUvChart(getParam());
    let data = [];
    if (res?.data) {
      data.push(['日期', 'PV', 'UV']);
      let len = Math.max(res.data.pv.length, res.data.uv.length) || 0;
      for (let i = 0; i < len; i++) {
        data.push([res.data.pv[i][0] || res.data.uv[i][0], res.data.pv[i][1] || 0, res.data.uv[i][1] || 0]);
      }
    }
    chart.data(data);
    chart.draw();
  }

  useEffect(() => {
    void onOverview();
    void getPvUv();
  }, [timeList, appGroup, feEnv]);

  useEffect(() => {
    setChart(
      new Line({
        dom: document.querySelector('.line-chart'),
        fieldMap: { x: ['日期'], y: ['PV', 'UV'] },
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
        line: {
          isCustomColor: true,
          customColor: ['#4BA2FFFF', '#54DA81FF'],
        },
        tooltip: {
          isShow: true,
        },
      }),
    );
  }, []);

  useEffect(() => {
    void getPvUv();
  }, [chart]);

  return (
    <div className="basic-overview-wrapper">
      <Header defaultTime={timeList} onChange={setTimeList} envChange={setFeEnv} />
      <div className="performance-wrapper">
        <div className="overview-wrapper">
          <div className="l">
            {overviewList.map(
              (item, i) =>
                i < 2 && (
                  <div key={i}>
                    <b>{item[1]}</b>
                    <span>{item[0]}</span>
                  </div>
                ),
            )}
          </div>
          <div className="l">
            {overviewList.map(
              (item, i) =>
                i > 1 && (
                  <div key={i}>
                    <b>{item[1]}</b>
                    <span>{item[0]}</span>
                  </div>
                ),
            )}
          </div>
        </div>
        <div className="line-chart-wrapper">
          <div className="chart-title">PV/UV对比图</div>
          <div className="line-chart"></div>
        </div>
      </div>
    </div>
  );
};

export default BasicOverview;

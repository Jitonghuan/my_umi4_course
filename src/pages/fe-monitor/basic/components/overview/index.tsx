import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Line } from '@cffe/hulk-wave-chart';
import moment from 'moment';
import { pvAndUvChart, queryOverview } from '../../server';
import './index.less';

interface IProps {
  timeList: any;
  appGroup: string;
  envCode: string;
  feEnv: string;
}

const BasicOverview = ({ appGroup, envCode, feEnv, timeList }: IProps) => {
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

      let arrTimes: any[] = [];
      for (const item of res.data.pv) {
        if (!arrTimes.find((val) => val === item[0])) {
          arrTimes.push(item[0]);
        }
      }

      for (const item of res.data.uv) {
        if (!arrTimes.find((val) => val === item[0])) {
          arrTimes.push(item[0]);
        }
      }

      for (let i = 0; i < arrTimes.length; i++) {
        let pv = res.data.pv.find((val: any) => val[0] === arrTimes[i]);
        let uv = res.data.uv.find((val: any) => val[0] === arrTimes[i]);
        data.push([moment(arrTimes[i]).format('YYYY-MM-DD HH:mm'), pv ? pv[1] : 0, uv ? uv[1] : 0]);
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
        xAxis: {
          labelInterval: 2,
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
      <div className="performance-wrapper">
        <div className="overview-wrapper">
          <div className="l">
            {overviewList.map(
              (item, i) =>
                i < 2 && (
                  <div
                    key={i}
                    onClick={() => {
                      history.push({
                        pathname:location.pathname,
                        search: '?appGroup=&tab=4',
                      });
                    }}
                  >
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
                    <b>{item[0] === '首次可交互时间' ? (item[1] / 1000).toFixed(3) : item[1]}</b>
                    <span>{item[0] === '首次可交互时间' ? '首次可交互时间(秒)' : item[0]}</span>
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

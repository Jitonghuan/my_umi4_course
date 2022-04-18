import React, { useEffect, useState } from 'react';
import Header from '../header';
import { Line } from '@cffe/hulk-wave-chart';
import moment from 'moment';
import { queryOverview } from '../server';
import './index.less';

interface IProps {
  appGroup: string;
}

const now = [moment(moment().format('YYYY-MM-DD 00:00:00')), moment()];

const BasicOverview = ({ appGroup }: IProps) => {
  const [timeList, setTimeList] = useState<any>(now);

  async function onSearch() {
    const res = await queryOverview({
      appGroup,
      startTime: timeList[0] ? moment(timeList[0]).format('YYYY-MM-DD HH:mm:ss') : null,
      endTime: timeList[1] ? moment(timeList[1]).format('YYYY-MM-DD HH:mm:ss') : null,
    });
  }

  useEffect(() => {
    void onSearch();
  }, [timeList, appGroup]);

  useEffect(() => {
    const chart = new Line({
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
    });
    chart.data([
      ['日期', 'PV', 'UV'],
      ['日期', '100', '200'],
      ['日期1', '200', '300'],
      ['日期2', '800', '400'],
      ['日期3', '500', '500'],
      ['日期4', '700', '600'],
      ['日期5', '400', '800'],
      ['日期6', '300', '200'],
    ]);
    chart.draw();
  }, []);

  return (
    <div className="basic-overview-wrapper">
      <Header defaultTime={timeList} onChange={setTimeList} />
      <div className="performance-wrapper">
        <div className="overview-wrapper">
          <div className="l">
            <div>
              <b>72</b>
              <span>JS错误数</span>
            </div>
            <div className="dividing-line">
              <b>72</b>
              <span>资源错误数</span>
            </div>
          </div>
          <div className="l">
            <div>
              <b>356ms</b>
              <span>首次可交互</span>
            </div>
            <div className="dividing-line">
              <b>356ms</b>
              <span>API错误数</span>
            </div>
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

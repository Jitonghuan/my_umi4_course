import React, { useState } from 'react';
import { DatePicker, Radio } from 'antd';
import moment from 'moment';
import './index.less';

const { RangePicker } = DatePicker;

const ranges = [
  {
    value: [moment().subtract(7, 'days'), moment()],
    label: '最近7天',
  },
  {
    value: [moment().subtract(30, 'days'), moment()],
    label: '最近30天',
  },
];

const BasicFeMonitor = () => {
  const [timeList, setTimeList] = useState<any>([]);

  return (
    <div className="basic-fe-monitor-wrapper">
      <div className="basic-header flex-row-center">
        <span>性能监测</span>
        <div className="flex-row-center">
          <Radio.Group style={{ marginRight: 16 }}>
            {ranges.map((item, i) => (
              <Radio.Button onClick={() => setTimeList(item.value)} key={i} value={item.value}>
                {item.label}
              </Radio.Button>
            ))}
          </Radio.Group>
          <RangePicker value={timeList} onChange={(val) => setTimeList(val)} />
        </div>
      </div>
      <div className="performance-wrapper">
        <div className="l">
          <div>
            <span>JS错误数</span>
            <b>9</b>
          </div>
          <div>
            <span>JS错误率</span>
            <b>22.98%</b>
          </div>
          <div>
            <span>首次可交互</span>
            <b>256mms</b>
          </div>
          <div>
            <span>资源错误数</span>
            <b>9</b>
          </div>
          <div>
            <span>资源错误率</span>
            <b>22.98%</b>
          </div>
          <div>
            <span>API错误率</span>
            <b>22.98%</b>
          </div>
          <div>
            <span>总PV</span>
            <b>9</b>
          </div>
          <div>
            <span>总UV</span>
            <b>122</b>
          </div>
        </div>
        <div className="r"></div>
      </div>
    </div>
  );
};

export default BasicFeMonitor;

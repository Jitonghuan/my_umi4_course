import React, { useState } from 'react';
import { DatePicker, Radio } from 'antd';
import moment from 'moment';

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

interface IProps {
  onChange?: (time: any[]) => void;
  defaultTime?: any[];
}

const Header = ({ onChange, defaultTime }: IProps) => {
  const [timeList, setTimeList] = useState<any>(defaultTime || []);

  const onTimeChange = (time: any) => {
    setTimeList(time);
    onChange && onChange(time);
  };

  return (
    <div className="basic-header flex-row-center">
      <div className="flex-row-center">
        <Radio.Group style={{ marginRight: 16 }}>
          {ranges.map((item, i) => (
            <Radio.Button onClick={() => onTimeChange(item.value)} key={i} value={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
        <RangePicker value={timeList} showTime onChange={(val) => onTimeChange(val)} />
      </div>
    </div>
  );
};

export default Header;

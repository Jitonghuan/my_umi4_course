import React, { useState } from 'react';
import { DatePicker, Radio } from '@cffe/h2o-design';
import moment from 'moment';

const { RangePicker } = DatePicker;

const ranges = [
  {
    value: [moment(moment().format('YYYY-MM-DD 00:00:00')), moment()],
    label: '今日',
  },
  {
    value: [moment().subtract(7, 'days'), moment()],
    label: '最近7天',
  },
];

interface IProps {
  onChange?: (time: any[]) => void;
  defaultTime?: any[];
}

const Header = ({ onChange, defaultTime }: IProps) => {
  const [timeList, setTimeList] = useState<any>(defaultTime || []);
  const [active, setActive] = useState<any>(ranges[0].value);

  const onTimeChange = (time: any) => {
    setTimeList(time);
    onChange && onChange(time);
  };

  return (
    <div className="basic-header flex-row-center">
      <div className="flex-row-center">
        <Radio.Group style={{ marginRight: 16 }} value={active}>
          {ranges.map((item, i) => (
            <Radio.Button
              onClick={() => {
                onTimeChange(item.value);
                setActive(item.value);
              }}
              key={i}
              value={item.value}
            >
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
        <RangePicker
          clearIcon={false}
          value={timeList}
          showTime={{ format: 'HH:mm' }}
          onChange={(val) => {
            onTimeChange(val);
            setActive(null);
          }}
          ranges={{
            最近15分钟: [moment().subtract(15, 'minute'), moment()],
            最近30分钟: [moment().subtract(30, 'minute'), moment()],
            最近1小时: [moment().subtract(60, 'minute'), moment()],
          }}
        />
      </div>
    </div>
  );
};

export default Header;

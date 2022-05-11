import React, { useState } from 'react';
import { DatePicker, Radio, Select } from 'antd';
import appConfig from '@/app.config';
import moment from 'moment';
import { envList } from '../../const';

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
  envChange?: (env: string) => void;
  defaultTime?: any[];
}

const Header = ({ onChange, defaultTime, envChange }: IProps) => {
  const [timeList, setTimeList] = useState<any>(defaultTime || []);
  const [active, setActive] = useState<any>(ranges[0].value);
  const [feEnv, setFeEnv] = useState<string>('*');

  const onTimeChange = (time: any) => {
    setTimeList(time);
    onChange && onChange(time);
  };

  const onEnvChange = (env: string) => {
    setFeEnv(env);
    envChange && envChange(env);
  };

  return (
    <div className="basic-header flex-row-center">
      {appConfig.IS_Matrix === 'public' && (
        <div className="env-select-wrapper">
          <span>域名：</span>
          <Select value={feEnv} clearIcon={false} style={{ width: '120px' }} onChange={onEnvChange}>
            {envList.map((item) => (
              <Select.Option value={item.key} key={item.key}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
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

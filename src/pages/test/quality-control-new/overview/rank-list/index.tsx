import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { Radio, List } from 'antd';
import './index.less';

const { ColorContainer } = colorUtil.context;

export interface RankListProps {
  loading?: boolean;
}

const optionsWithDisabled = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
];

export default function RankList(props: RankListProps) {
  return (
    <div className="rank-list">
      <Radio.Group options={optionsWithDisabled} value="Pear" optionType="button" buttonStyle="solid" />
      <List />
    </div>
  );
}

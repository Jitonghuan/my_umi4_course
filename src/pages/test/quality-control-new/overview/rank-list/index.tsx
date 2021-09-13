import React, { useState } from 'react';
import { Radio, List, Typography } from 'antd';
import './index.less';

export interface RankListProps {
  leftLabel: string;
  rightLabel: string;
  leftDataSource: any[];
  rightDataSource: any[];
}

export default function RankList(props: RankListProps) {
  const { leftDataSource, leftLabel, rightDataSource, rightLabel } = props;
  const [swichValue, setSwichValue] = useState<string>('left');

  return (
    <div className="rank-list">
      <Radio.Group
        options={[
          { label: leftLabel, value: 'left' },
          { label: rightLabel, value: 'right' },
        ]}
        value={swichValue}
        onChange={(e) => {
          setSwichValue(e.target.value);
        }}
        optionType="button"
        buttonStyle="solid"
      />
      <List
        dataSource={swichValue === 'left' ? leftDataSource : rightDataSource}
        renderItem={(item, index) => (
          <List.Item>
            <span>{index + 1}</span>
            <Typography.Text>{item[Object.keys(item).filter((s) => s != 'app' && s != 'id')[0]]}</Typography.Text>
            <Typography.Text>{item.app}</Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
}

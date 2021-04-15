/**
 * LaunchParameters
 * @description 启动参数
 * @author moting.nq
 * @create 2021-04-14 14:16
 */

import React from 'react';
import { Button } from 'antd';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import List from './list';
import { IProps } from './types';
import './index.less';

const rootCls = 'launch-parameters-compo';
const contentHeight = 400;

const LaunchParameters = (props: IProps) => {
  return (
    <ContentCard className={rootCls}>
      <List
        title="DEV"
        footer={<Button type="primary">提交</Button>}
        contentHeight={contentHeight}
        dataSource={[
          { name: 'key', value: 'value' },
          { name: 'key2', value: 'value2' },
          { name: 'key3', value: 'value3' },
          { name: 'key4', value: 'value3' },
          { name: 'key5', value: 'value3' },
          { name: 'key6', value: 'value3' },
          { name: 'key7', value: 'value3' },
          { name: 'key8', value: 'value3' },
        ]}
      />
      <List
        className="m_l-1"
        title="DEV"
        footer={<Button type="primary">提交</Button>}
        contentHeight={contentHeight}
        dataSource={[
          { name: 'key', value: 'value' },
          { name: 'key2', value: 'value2' },
          { name: 'key3', value: 'value3' },
        ]}
      />
    </ContentCard>
  );
};

LaunchParameters.defaultProps = {};

export default LaunchParameters;

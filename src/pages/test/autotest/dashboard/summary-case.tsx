// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React from 'react';
import { Spin } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2486191_bmiy8l0nqn.js',
  extraCommonProps: {
    style: { fontSize: 18 },
  },
});

export interface SummaryCaseProps {
  data: any;
  loading?: boolean;
}

export default function SummaryCase(props: SummaryCaseProps) {
  const { data, loading } = props;

  // if (loading) {
  //   return <div className="loading-wrapper"><Spin /></div>
  // }

  return (
    <>
      <section>
        <h3>覆盖应用</h3>
        <div className="info-row">
          <b>658</b>
          <div className="icon-wrap" style={{ backgroundColor: '#4BA2FF' }}>
            <IconFont type="icon-dataset" />
          </div>
        </div>
      </section>
      <section>
        <h3>接口总数</h3>
        <div className="info-row">
          <b>658</b>
          <div className="icon-wrap" style={{ backgroundColor: '#54DA81' }}>
            <IconFont type="icon-table_settings" />
          </div>
        </div>
      </section>
      <section>
        <h3>用例总数</h3>
        <div className="info-row">
          <b>658</b>
          <div className="icon-wrap" style={{ backgroundColor: '#657CA6' }}>
            <IconFont type="icon-instructions" />
          </div>
        </div>
      </section>
      <section>
        <h3>今日用例执行率</h3>
        <div className="info-row">
          <b>62.1%</b>
          <div className="icon-wrap" style={{ backgroundColor: '#5C61F3' }}>
            <IconFont type="icon-trend" />
          </div>
        </div>
      </section>
    </>
  );
}

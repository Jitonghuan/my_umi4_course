// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React from 'react';
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

  return (
    <>
      <section data-loading={loading}>
        <h3>覆盖应用</h3>
        <div className="info-row">
          <b>{data.appNum ?? '--'}</b>
          <div className="icon-wrap" style={{ backgroundColor: '#4BA2FF' }}>
            <IconFont type="icon-dataset" />
          </div>
        </div>
      </section>
      <section data-loading={loading}>
        <h3>接口总数</h3>
        <div className="info-row">
          <b>{data.apiNum ?? '--'}</b>
          <div className="icon-wrap" style={{ backgroundColor: '#54DA81' }}>
            <IconFont type="icon-table_settings" />
          </div>
        </div>
      </section>
      <section data-loading={loading}>
        <h3>用例总数</h3>
        <div className="info-row">
          <b>{data.caseNum ?? '--'}</b>
          <div className="icon-wrap" style={{ backgroundColor: '#657CA6' }}>
            <IconFont type="icon-instructions" />
          </div>
        </div>
      </section>
      <section data-loading={loading}>
        <h3>今日用例执行率</h3>
        <div className="info-row">
          <b>{typeof data.execRate === 'number' ? `${data.execRate * 100}%` : '--'}</b>
          <div className="icon-wrap" style={{ backgroundColor: '#5C61F3' }}>
            <IconFont type="icon-trend" />
          </div>
        </div>
      </section>
    </>
  );
}

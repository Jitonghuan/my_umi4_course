// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React from 'react';
import IconFailSvg from '@/assets/imgs/icon_fail.svg';
import IconPassSvg from '@/assets/imgs/icon_pass.svg';

export interface SummaryExecProps {
  data: any;
  loading?: boolean;
}

export default function SummaryExec(props: SummaryExecProps) {
  const { data, loading } = props;

  return (
    <section style={{ width: 376 }} data-loading>
      <div className="info-row">
        {/* <img src={IconFailSvg} alt="" /> */}
        <img src={IconPassSvg} alt="" />
        <div className="info-list">
          <p>
            <span>上次执行完成时间：</span>
            <b>2021.07.21 16:03:06</b>
          </p>
          <p>
            <span>上次执行任务名称：</span>
            <b>全量用例测试任务全集长长长长的文字</b>
          </p>
        </div>
      </div>
    </section>
  );
}

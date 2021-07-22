// dashboard section
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 17:42

import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import IconFailSvg from '@/assets/imgs/icon_fail.svg';
import IconPassSvg from '@/assets/imgs/icon_pass.svg';

export interface SummaryExecProps {
  data: any;
  loading?: boolean;
}

export default function SummaryExec(props: SummaryExecProps) {
  const { data, loading } = props;

  return (
    <section style={{ width: 376 }} data-loading={loading}>
      <div className="info-row">
        <img src={loading ? '' : data.error > 0 ? IconFailSvg : IconPassSvg} width="60" height="60" alt="" />
        <div className="info-list">
          <p>
            <span>上次执行完成时间：</span>
            <b>{data.endTime ? moment(data.endTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</b>
          </p>
          <p>
            <span>上次执行任务名称：</span>
            <Tooltip title={data.taskName}>
              <b>{data.taskName || '--'}</b>
            </Tooltip>
          </p>
        </div>
      </div>
    </section>
  );
}

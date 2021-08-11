// autotest dashboard
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { useLastTaskExecution, useCaseStats, useWeeklyTaskExecution, useMonthlyCaseIncrement } from './hooks';
import SummaryCase from './summary-case';
import SummaryExec from './summary-exec';
import ChartCaseList from './chart-case-list';
import ChartCaseMonthly from './chart-case-monthly';
import ChartLastExec from './chart-last-exec';
import ChartTaskWeekly from './chart-task-weekly';
import './index.less';

export default function Dashboard() {
  const [lastTaskData, lastTaskLoading] = useLastTaskExecution();
  const [caseOverview, caseStatsData, caseStatsLoading] = useCaseStats();
  const [taskExeData, taskExeLoading] = useWeeklyTaskExecution();
  const [caseIncData, caseIncLoading] = useMonthlyCaseIncrement();

  return (
    <ContentCard className="page-autotest-dashboard">
      <div className="section-group summary-group">
        <SummaryExec data={lastTaskData} loading={lastTaskLoading} />
        <SummaryCase data={caseOverview} loading={caseStatsLoading} />
      </div>

      <div className="section-group">
        <ChartLastExec data={lastTaskData} loading={lastTaskLoading} />
        <ChartCaseList data={caseStatsData} loading={caseStatsLoading} />
      </div>

      <ChartTaskWeekly data={taskExeData} loading={taskExeLoading} />

      <ChartCaseMonthly data={caseIncData} loading={caseIncLoading} />
    </ContentCard>
  );
}

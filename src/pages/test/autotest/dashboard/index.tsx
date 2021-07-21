// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../components/header-tabs';
import { useLastTaskExecution, useCaseStats, useWeeklyTaskExecution, useMonthlyCaseIncrement } from './hooks';
import SummaryCase from './summary-case';
import SummaryExec from './summary-exec';
import ChartCaseList from './chart-case-list';
import ChartCaseMonthly from './chart-case-monthly';
import ChartLastExec from './chart-last-exec';
import ChartTaskWeekly from './chart-task-weekly';
import './index.less';

export default function Dashboard(props: any) {
  const [lastTaskData, lastTaskLoading] = useLastTaskExecution();
  const [caseOverview, caseStatsData, caseStatsLoading] = useCaseStats();
  const [taskExeData, taskExeLoading] = useWeeklyTaskExecution();
  const [caseIncData, caseIncLoading] = useMonthlyCaseIncrement();

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="dashboard" history={props.history} />
      <ContentCard className="page-autotest-dashboard">
        <div className="section-group summary-group">
          <SummaryExec data={lastTaskData} loading={lastTaskLoading} />
          <SummaryCase data={caseOverview} loading={caseStatsLoading} />
        </div>

        <div className="section-group">
          <ChartLastExec data={lastTaskData} loading={lastTaskLoading} />
          <ChartTaskWeekly data={taskExeData} loading={taskExeLoading} />
        </div>

        <ChartCaseList data={caseStatsData} loading={caseStatsLoading} />

        <ChartCaseMonthly data={caseIncData} loading={caseIncLoading} />
      </ContentCard>
    </MatrixPageContent>
  );
}

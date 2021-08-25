import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { useCaseInfoChartOptions } from './formatter';

const { ColorContainer } = colorUtil.context;

export interface UserCaseInfoExecProps {
  data: any;
  loading?: boolean;
}

export default function UserCaseInfoExec(props: UserCaseInfoExecProps) {
  const { data, loading } = props;

  const chartOptions = useMemo(() => {
    return useCaseInfoChartOptions(data);
  }, [data]);

  return (
    <section style={{ width: 272 }} data-loading={loading}>
      {/* <header>
        <h3>已测用例情况</h3>
      </header> */}
      <div style={{ height: 174, background: '#fff' }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={chartOptions} />
        </ColorContainer>
      </div>
    </section>
  );
}

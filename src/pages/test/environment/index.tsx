// 环境管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/26 15:07

import React, { useState, useMemo } from 'react';
import Emitter from 'events';
import MatrixPageContent from '@/components/matrix-page-content';
import { CardRowGroup } from '@/components/vc-page-content';
import EnvList from './env-list';
import EnvDetail from './env-detail';
import { EnvItemVO } from './interfaces';
import './index.less';

export default function EnvironmentManager() {
  const [current, setCurrent] = useState<EnvItemVO>(null as any);

  const emitter = useMemo(() => {
    return new Emitter();
  }, []);

  return (
    <MatrixPageContent isFlex>
      <CardRowGroup>
        <EnvList onItemClick={(item) => setCurrent(item)} emitter={emitter} />
        <EnvDetail current={current} emitter={emitter} />
      </CardRowGroup>
    </MatrixPageContent>
  );
}

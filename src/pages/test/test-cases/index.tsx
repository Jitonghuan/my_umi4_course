// 用例管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useRef, useState } from 'react';
import Emitter from 'events';
import MatrixPageContent from '@/components/matrix-page-content';
import { CardRowGroup } from '@/components/vc-page-content';
import LeftTree from './left-tree';
import RightDetail from './right-detail';
import { APIItemVO } from './interfaces';
import './index.less';

export default function TestCaseManager() {
  const [current, setCurrent] = useState<APIItemVO>(null as any);
  const emitterRef = useRef(new Emitter());

  return (
    <MatrixPageContent isFlex>
      <CardRowGroup>
        <LeftTree
          onItemClick={(item) => setCurrent(item)}
          emitter={emitterRef.current}
        />
        <RightDetail current={current} emitter={emitterRef.current} />
      </CardRowGroup>
    </MatrixPageContent>
  );
}

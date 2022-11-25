import React from 'react';
import PageContainer from '@/components/page-container';
import BoardCardList from './component/board-card';
import './index.less';

const rootCls = 'monitor-board';

export default function Board() {
  return (
    <PageContainer className={rootCls}>
      <div className="app-group-content-wrapper">
        <BoardCardList />
      </div>
    </PageContainer>
  );
}

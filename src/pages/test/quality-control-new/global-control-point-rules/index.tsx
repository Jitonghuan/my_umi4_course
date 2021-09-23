import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import ConfigurePointRulesForm from '../_components/configure-point-rules-form';
import { Button, Typography } from 'antd';

export default function GlobalControlPointRules(props: any) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <PageContainer className="quality-control-global-control-point-rules">
      <HeaderTabs activeKey="global-control-point-rules" history={props.history} />
      <ContentCard>
        <div style={{ marginBottom: '12px' }}>
          <Typography.Text strong>发布卡点全局规则</Typography.Text>
          {isEdit ? (
            <Button type="link" onClick={() => setIsEdit(false)}>
              保存
            </Button>
          ) : (
            <Button type="link" onClick={() => setIsEdit(true)}>
              编辑
            </Button>
          )}
        </div>
        <ConfigurePointRulesForm
          isGlobal
          isEdit={isEdit}
          onChange={(formValues: any) => {
            console.log('formValues :>> ', formValues);
          }}
        />
      </ContentCard>
    </PageContainer>
  );
}

import React, { useState, useEffect, useContext } from 'react';
import { postRequest } from '@/utils/request';
import { ContentCard } from '@/components/vc-page-content';
import { useGlobalConf } from '../hooks';
import { Button, Typography, Form, message } from 'antd';
import FELayout from '@cffe/vc-layout';
import HeaderTabs from '../_components/header-tabs';
import PageContainer from '@/components/page-container';
import ConfigurePointRulesForm from '../_components/configure-point-rules-form';
import * as APIS from '../service';

export default function GlobalControlPointRules(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [globalConf] = useGlobalConf();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(globalConf);
  }, [globalConf]);

  const handleOptBtnClick = () => {
    if (isEdit) {
      form.validateFields().then((vals: any) => {
        postRequest(APIS.updateConf, {
          data: {
            ...vals,
            modifyUser: userInfo.userName,
            id: globalConf.id,
          },
        }).then((res) => {
          if (res.success) {
            message.success('保存成功');
            setIsEdit(!isEdit);
          } else {
            message.error('保存失败');
          }
        });
      });
    } else {
      setIsEdit(!isEdit);
    }
  };

  return (
    <PageContainer className="quality-control-global-control-point-rules">
      <HeaderTabs activeKey="global-control-point-rules" history={props.history} />
      <ContentCard>
        <div style={{ marginBottom: '12px' }}>
          <Typography.Text strong>发布卡点全局规则</Typography.Text>
          {isEdit ? (
            <Button type="link" onClick={handleOptBtnClick}>
              保存
            </Button>
          ) : (
            <Button type="link" onClick={handleOptBtnClick}>
              编辑
            </Button>
          )}
        </div>
        <ConfigurePointRulesForm
          form={form}
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

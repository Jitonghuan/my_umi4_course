import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import FELayout from '@cffe/vc-layout';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import { Form, Table, InputNumber, Button, Typography, message } from 'antd';
import { useGradeInfo } from '../hooks';
import './index.less';
import { postRequest } from '@/utils/request';
import * as APIS from '../service';

const qualityScoringRules = [
  {
    title: '单元测试覆盖率',
    name: 'utCovRateGrade',
  },
  {
    title: '单元测试通过率',
    name: 'utPassRateGrade',
  },
  {
    title: '代码重复度',
    name: 'codeCoverageGrade',
  },
  {
    title: '代码复杂度',
    name: 'codeComplexityGrade',
  },
  {
    title: '代码异味',
    name: 'codeSmellGrade',
  },
  {
    title: '代码BUG',
    name: 'codeBugGrade',
  },
  {
    title: '代码漏洞',
    name: 'codeVulnerabilityGrade',
  },
];

export default function QualityScoringRules(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [gradeInfo] = useGradeInfo();

  useEffect(() => {
    if (gradeInfo) {
      form.setFieldsValue(gradeInfo);
    }
  }, [gradeInfo]);

  const handleClickOptBtn = () => {
    if (isEdit) {
      form.validateFields().then((values: any) => {
        postRequest(APIS.updateGradeInfo, {
          data: { ...values, id: gradeInfo.id, modifyUser: userInfo.userName },
        }).then((res) => {
          if (res.success) {
            message.success('保存成功');
            setIsEdit(!isEdit);
            return;
          }

          message.warning('保存失败');
        });
      });
    } else {
      setIsEdit(!isEdit);
    }
  };

  return (
    <PageContainer className="quality-control-quality-scoring-rules">
      <HeaderTabs activeKey="quality-scoring-rules" history={props.history} />
      <ContentCard>
        <div className="title-header">
          <Typography.Text strong>质量分规则</Typography.Text>
          <Button type="link" onClick={handleClickOptBtn}>
            {isEdit ? '保存' : '编辑'}
          </Button>
        </div>
        <Form form={form}>
          <Table dataSource={qualityScoringRules} pagination={false}>
            <Table.Column title="指标" dataIndex="title" />
            <Table.Column
              title="权重"
              dataIndex="name"
              render={(name) => (
                <Form.Item name={name} rules={[{ type: 'number', min: 0 }]}>
                  <InputNumber className="score-input" disabled={!isEdit} />
                </Form.Item>
              )}
            />
          </Table>
        </Form>
      </ContentCard>
    </PageContainer>
  );
}

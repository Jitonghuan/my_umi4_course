import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import { Form, Table, InputNumber, Button, Typography } from 'antd';
import './index.less';

const qualityScoringRules = [
  {
    title: '单元测试覆盖率',
    name: 'a',
  },
  {
    title: '单元测试通过率',
    name: 'b',
  },
  {
    title: '代码重复度',
    name: 'c',
  },
  {
    title: '代码复杂度',
    name: 'd',
  },
  {
    title: '代码异味',
    name: 'e',
  },
  {
    title: '代码BUG',
    name: 'f',
  },
  {
    title: '代码漏洞',
    name: 'g',
  },
];

export default function QualityScoringRules(props: any) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // 点击保存 isEdit 变为 false
    if (!isEdit) {
      console.log('form. :>> ', form.getFieldsValue());
    }
  }, [isEdit]);

  return (
    <PageContainer className="quality-control-quality-scoring-rules">
      <HeaderTabs activeKey="quality-scoring-rules" history={props.history} />
      <ContentCard>
        <div className="title-header">
          <Typography.Text strong>质量分规则</Typography.Text>
          <Button type="link" onClick={() => setIsEdit(!isEdit)}>
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
                <Form.Item name={name}>
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

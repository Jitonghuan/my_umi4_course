import React, { useState, useEffect } from 'react';
import { Form, Button, Steps, Space } from 'antd';
import { history } from 'umi';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import StepOne from './step-one';
import StepTwo from './step-two';
import './index.less';

const { Step } = Steps;

const stepOption = [
  {
    key: '1',
    title: '添加监控对象',
  },
  {
    key: '2',
    title: '新增报警规则',
  },
  {
    key: '3',
    title: '完成',
  },
];

const PrometheusForm: React.FC = () => {
  const [current, setCurrent] = useState(1);
  const [form] = Form.useForm();

  const pre = () => {
    setCurrent(current - 1);
  };

  const next = () => {
    form.validateFields().then((value) => {
      console.log(value, 'value');
      setCurrent(current + 1);
    });
    // setCurrent(current + 1);
  };

  const cancel = () => {
    history.goBack();
  };
  const isFirstCurrent = current === 0;

  const renderDom = [
    {
      current: 0,
      dom: <StepOne />,
    },
    {
      current: 1,
      dom: <StepTwo />,
    },
  ];

  return (
    <MatrixPageContent>
      <ContentCard style={{ background: '#F7F8FA' }}>
        <div className="step-style">
          <Steps current={current}>
            {stepOption.map((v) => (
              <Step key={v.key} title={v.title} />
            ))}
          </Steps>
        </div>
        <Form className="form" requiredMark={false} form={form}>
          {renderDom.find((v) => v.current === current)?.dom}

          {current !== 2 && (
            <Form.Item wrapperCol={{ span: 20 }}>
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button type="primary" onClick={next}>
                    下一步
                  </Button>
                  <Button onClick={isFirstCurrent ? cancel : pre}>
                    {isFirstCurrent ? '取消' : '上一步'}
                  </Button>
                </Space>
              </div>
            </Form.Item>
          )}
        </Form>
      </ContentCard>
    </MatrixPageContent>
  );
};

export default PrometheusForm;

import React, { useState, useEffect } from 'react';
import { Form, Button, Steps, Space } from 'antd';
import { history } from 'umi';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import useRequest from '@/utils/useRequest';
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import { createPrometheus } from '../../service';
import { Item } from '../../typing';
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
  const [formList, setFormList] = useState({});
  const [current, setCurrent] = useState(0);
  const [stepOneTable, setStepOneTable] = useState<Item[]>([]);
  const [stepTwoTable, setStepTwoTable] = useState<Record<string, Item[]>>({});
  const [form] = Form.useForm();

  const pathName = history.location.pathname;

  const { run: createPrometheusFun } = useRequest({
    api: 'createPrometheus',
    method: 'POST',
    successText: '提交成功',
  });

  const stepTableMap = (data: Item[]) => {
    const obj: Record<string, string> = {};
    console.log(Object.keys(data), '999');
    data.forEach((item) => {
      const str = item.key;
      if (str) {
        obj[str] = item.value as string;
      }
    });
    return obj;
  };

  const pre = () => {
    setCurrent(current - 1);
  };

  const next = () => {
    stepTableMap(stepOneTable);

    form.validateFields().then((value) => {
      createPrometheusFun({ ...value, labels: stepTableMap(stepOneTable) });
      setFormList({ ...formList, ...stepOneTable, ...value });
      setCurrent(current + 1);
    });
    // setCurrent(current + 1);
  };

  const cancel = () => {
    history.goBack();
  };

  const reset = () => {
    setCurrent(0);
    form.resetFields();
  };

  const stepOneTableFun = (value: Item[]) => {
    console.log(value, 'one');
    setStepOneTable(value);
  };

  const stepTwoTableFun = (value: Record<string, Item[]>) => {
    console.log(value, 'two');
    setStepTwoTable(value);
  };

  const isFirstCurrent = current === 0;

  const renderDom = [
    {
      current: 0,
      dom: <StepOne getTableData={stepOneTableFun} />,
    },
    {
      current: 1,
      dom: <StepTwo getTableData={stepTwoTableFun} />,
    },
    {
      current: 2,
      dom: <StepThree reset={reset} />,
    },
  ];

  useEffect(() => {
    if (pathName.indexOf('edit') > -1) {
      //...
    }
  }, []);

  return (
    <MatrixPageContent>
      <ContentCard style={{ background: '#F7F8FA' }}>
        <div className="step-style">
          <Steps
            current={current}
            onChange={
              pathName.indexOf('edit') > -1
                ? (current) => setCurrent(current)
                : undefined
            }
          >
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

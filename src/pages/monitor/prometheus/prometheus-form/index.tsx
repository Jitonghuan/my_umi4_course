import React, { useState, useEffect } from 'react';
import { Form, Button, Steps, Space } from 'antd';
import { history } from 'umi';
import ds from '@config/defaultSettings';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import useRequest from '@/utils/useRequest';
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import {
  createPrometheus,
  updatePrometheus,
  queryPrometheusList,
} from '../../service';
import { Item } from '../../typing';
import { stepTableMap } from '../../util';
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
  const [serviceId, setServiceId] = useState('');
  const [matchlabels, setMatchlabels] = useState<Item[]>([]);
  const [form] = Form.useForm();

  const {
    location: { query },
  } = history;

  const isEdit = Object.keys(query as object).length > 0;

  const { run: queryPrometheusListFun } = useRequest({
    api: queryPrometheusList,
    method: 'GET',
    onSuccess: (data) => {
      console.log(data, 'uuu');
      if (!data) return;
      form?.setFieldsValue({
        ...data.dataSource[0],
      });

      const item = data.dataSource[0]?.labels;
      const labels = Object.keys(item).map((v, i) => {
        return {
          id: i,
          key: v,
          value: item[v],
        };
      });
      setMatchlabels(labels);
      setServiceId(data.dataSource[0]?.id);
    },
  });

  const { run: createPrometheusFun } = useRequest({
    api: createPrometheus,
    method: 'POST',
    successText: '提交成功',
    isSuccessModal: true,
    onSuccess: (data) => {
      setServiceId(data?.id);
      setCurrent(current + 1);
    },
  });

  const { run: updatePrometheusFun } = useRequest({
    api: updatePrometheus,
    method: 'POST',
    successText: '更新成功',
    isSuccessModal: true,
    onSuccess: (data) => {
      setServiceId(data?.id);
      setCurrent(current + 1);
    },
  });

  const pre = () => {
    setCurrent(current - 1);
  };

  const next = () => {
    if (current === 0) {
      form.validateFields().then(async (value) => {
        if (isEdit) {
          updatePrometheusFun({ ...value, labels: stepTableMap(stepOneTable) });
        } else {
          createPrometheusFun({ ...value, labels: stepTableMap(stepOneTable) });
        }

        setFormList({ ...formList, ...stepOneTable, ...value });
      });
    } else {
      setCurrent(current + 1);
    }

    // setCurrent(current + 1);
  };

  const cancel = () => {
    history.goBack();
  };

  const reset = () => {
    setCurrent(0);
    history.push(`${ds.pagePrefix}/monitor/prometheus/prometheus-add`);
    form.resetFields();
  };

  const stepOneTableFun = (value: Item[]) => {
    setStepOneTable(value);
  };

  const stepTwoTableFun = (value: Record<string, Item[]>) => {
    setStepTwoTable(value);
  };

  const isFirstCurrent = current === 0;

  useEffect(() => {
    if (isEdit) {
      queryPrometheusListFun({ ...query });
    }
  }, []);

  const renderDom = [
    {
      current: 0,
      dom: (
        <StepOne
          getTableData={stepOneTableFun}
          form={form}
          matchlabelsList={matchlabels}
        />
      ),
    },
    {
      current: 1,
      dom: <StepTwo getTableData={stepTwoTableFun} serviceId={serviceId} />,
    },
    {
      current: 2,
      dom: <StepThree reset={reset} />,
    },
  ];

  return (
    <MatrixPageContent>
      <ContentCard style={{ background: '#F7F8FA' }}>
        <div className="step-style">
          <Steps
            current={current}
            onChange={isEdit ? (current) => setCurrent(current) : undefined}
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

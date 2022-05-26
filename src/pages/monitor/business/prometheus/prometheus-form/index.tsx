import React, { useState, useEffect } from 'react';
import { Form, Button, Steps, Space } from '@cffe/h2o-design';
import { history } from 'umi';
import { ContentCard } from '@/components/vc-page-content';
import useRequest from '@/utils/useRequest';
import StepMonitor from './step-monitor';
import StepTwo from '../../../component/rules-table';
import StepComplate from './step-complate';
import { createPrometheus, updatePrometheus, queryPrometheusList } from '../../../service';
import { Item } from '../../../typing';
import { stepTableMap } from '../../../util';
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
    onSuccess: () => {
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
    history.push('./prometheus-add');
    form.resetFields();
  };

  const stepOneTableFun = (value: Item[]) => {
    setStepOneTable(value);
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
      dom: <StepMonitor getTableData={stepOneTableFun} matchlabelsList={matchlabels} form={form} />,
    },
    {
      current: 1,
      dom: <StepTwo serviceId={serviceId} />,
    },
    {
      current: 2,
      dom: <StepComplate reset={reset} />,
    },
  ];

  return (
    <ContentCard style={{ background: '#F7F8FA' }}>
      <div className="step-style">
        <Steps current={current} onChange={isEdit ? (current) => setCurrent(current) : undefined}>
          {stepOption.map((v) => (
            <Step key={v.key} title={v.title} />
          ))}
        </Steps>
      </div>
      <Form className="form" requiredMark={false} form={form}>
        <Form.Item>{renderDom.find((v) => v.current === current)?.dom}</Form.Item>
        {current !== 2 && (
          <Form.Item wrapperCol={{ span: 20 }}>
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" onClick={next}>
                  下一步
                </Button>
                <Button onClick={isFirstCurrent ? cancel : pre}>{isFirstCurrent ? '取消' : '上一步'}</Button>
              </Space>
            </div>
          </Form.Item>
        )}
      </Form>
    </ContentCard>
  );
};

export default PrometheusForm;

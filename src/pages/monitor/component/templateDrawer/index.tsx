import React, { useState, useEffect, useMemo } from 'react';
import { Button, Space, Drawer, Form, Select, TimePicker } from 'antd';
import moment from 'moment';
import { renderForm } from '@/components/table-search/form';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import useRequest from '@/utils/useRequest';
import EditTable from '../editTable';
import { Item } from '../../typing';
import { stepTableMap } from '../../util';
import { queryRuleTemplatesList, queryGroupList } from '../../service';
import './index.less';

interface TemplateDrawerProps {
  visible: boolean;
  drawerTitle: string;
  drawerType?: 'rules' | 'template';
  onClose: () => void;
  type?: 'add' | 'edit';
  record?: Item;
  onSubmit?: (value: Record<string, string>) => void;
}

const ALERT_LEVEL: Record<string, string> = {
  '2': '警告',
  '3': '严重',
  '4': '灾难',
};

const TemplateDrawer: React.FC<TemplateDrawerProps> = ({
  visible,
  onClose,
  drawerTitle,
  record,
  type,
  drawerType,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [labelTableData, setLabelTableData] = useState<Item[]>([]);
  const [annotationsTableData, setAnnotationsTableData] = useState<Item[]>([]);
  const [groupData, setGroupData] = useState<OptionProps[]>([]);
  const [ruleTemplate, setRuleTemplate] = useState('');

  //分类
  const { run: groupList } = useRequest({
    api: queryGroupList,
    method: 'GET',
    onSuccess: (data) => {
      setGroupData(
        data?.map((v: any) => {
          return {
            key: v,
            value: v,
          };
        }),
      );
    },
  });

  //获取模板列表
  const {
    data: ruleTemplatesList,
    run: queryRuleTemplatesListFun,
  } = useRequest({
    api: queryRuleTemplatesList,
    method: 'GET',
    formatData: (data) => {
      return data?.dataSource.map((v: any) => {
        return {
          ...v,
          key: v.name,
          value: v.name,
        };
      });
    },
  });

  const labelFun = (value: Item[]) => {
    setLabelTableData(value);
  };

  const annotationsFun = (value: Item[]) => {
    setAnnotationsTableData(value);
  };

  //数组转map
  const formatTableDataMap = (value: Item = {}) => {
    const item = value?.labels ?? {};
    const labels = Object.keys(item).map((v, i) => {
      return {
        id: i,
        key: v,
        value: item[v],
      };
    });
    return labels;
  };

  //编辑情况
  const editDataDetail = (record: Item = {}) => {
    const list = record?.duration?.split('') ?? [];
    form.setFieldsValue({
      ...record,
      duration: list.slice(0, list.length - 1).join(''),
      timeType: list[list?.length - 1],
      level: ALERT_LEVEL[record.level as string],
    });
    setLabelTableData(
      formatTableDataMap(record?.labels as Record<string, string>),
    );
    setAnnotationsTableData(
      formatTableDataMap(record?.annotations as Record<string, string>),
    );
  };

  //打开抽屉在请求
  useEffect(() => {
    if (!visible) return;
    groupList();
  }, [visible]);

  useEffect(() => {
    //报警规则
    if (drawerType === 'rules') {
      queryRuleTemplatesListFun({ pageIndex: -1 });
    }
  }, [drawerType]);

  useEffect(() => {
    //报警模板回显数据
    if (!visible) return;
    const findRecord =
      (ruleTemplatesList as Item[])?.find((v) => v.name === ruleTemplate) ?? {};
    editDataDetail(findRecord);
  }, [visible, ruleTemplate]);

  useEffect(() => {
    //编辑
    if (type === 'edit') {
      editDataDetail(record);
    }
  }, [type, record]);

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '报警模版',
      dataIndex: 'ruleTemplate',
      placeholder: '选择告警模版，根据模版自动填充以下内容',
      required: true,
      // option: ruleTemplatesList as OptionProps[],
      rules: [],
      option: [
        {
          key: 1,
          value: '1',
        },
        {
          key: 2,
          value: '2',
        },
        {
          key: 3,
          value: '3',
        },
      ],
      onChange: (e: string) => {
        setRuleTemplate(e);
      },
    },
    {
      key: '2',
      type: 'input',
      label: '规则名称',
      dataIndex: 'name',
      placeholder: '请输入(最多253字符，暂不支持中文)',
      required: true,
      disable: type === 'edit',
      rules: [
        {
          whitespace: true,
          required: true,
          message: '请输入正确的名称',
          pattern: /^\d+$|^\d[(a-z\d\-\.)]*\d$|^\d+$/,
          type: 'string',
          max: 253,
        },
      ],
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '分类',
      dataIndex: 'group',
      placeholder: '请选择',
      required: true,
      option: groupData,
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'area',
      label: '告警表达式(PromQL)',
      dataIndex: 'expression',
      placeholder: '请输入',
      required: true,
      option: [
        {
          key: '1',
          value: 'kkkk节点',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '5',
      type: 'inputNumber',
      label: '持续时间',
      dataIndex: 'duration',
      placeholder: '请输入',
      width: '90%',
      required: true,
      style: { marginRight: 10 },
      className: 'extraStyleTime',
      extraForm: (
        <Form.Item name="timeType" noStyle initialValue="m">
          <Select style={{ width: '90%' }} placeholder="选择时间单位">
            <Select.Option value="h">小时</Select.Option>
            <Select.Option value="m">分钟</Select.Option>
            <Select.Option value="s">秒</Select.Option>
          </Select>
        </Form.Item>
      ),
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '6',
      type: 'input',
      label: '告警消息',
      dataIndex: 'message',
      // width: '144px',
      placeholder: '请输入',
      required: true,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '7',
      type: 'select',
      label: '告警级别',
      dataIndex: 'level',
      // width: '144px',
      placeholder: '请输入',
      required: true,
      option: [
        {
          key: '2',
          value: '警告',
        },
        {
          key: '3',
          value: '严重',
        },
        {
          key: '4',
          value: '灾难',
        },
      ],
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '8',
      type: 'other',
      label: '高级配置',
      dataIndex: '',
      // width: '144px',
      placeholder: '请输入',
      itemStyle: { marginBottom: 0 },
      extraForm: (
        <Form.Item noStyle>
          <Form.Item name="labels" label="标签（Labels)" className="table-item">
            <EditTable onTableChange={labelFun} initData={labelTableData} />
          </Form.Item>
          <Form.Item
            name="annotations"
            label="注释（Annotations)"
            className="table-item"
          >
            <EditTable
              onTableChange={annotationsFun}
              initData={annotationsTableData}
            />
          </Form.Item>
        </Form.Item>
      ),
    },
    {
      key: '9',
      type: 'select',
      label: '通知对象',
      dataIndex: 'receiver',
      placeholder: '请选择',
      required: true,
      mode: 'multiple',
      option: [
        {
          key: '东来',
          value: '东来',
        },
        {
          key: '羁绊',
          value: '羁绊',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '10',
      type: 'select',
      label: '通知方式',
      dataIndex: 'receiverType',
      placeholder: '请选择',
      required: true,
      mode: 'multiple',
      option: [
        {
          key: '钉钉',
          value: '钉钉',
        },
        {
          key: '电话',
          value: '电话',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '11',
      type: 'radio',
      label: '是否静默',
      dataIndex: 'silence',
      placeholder: '请选择',
      required: true,
      defaultValue: 0,
      style: { verticalAlign: 'sub' },
      option: [
        {
          key: 1,
          value: '是',
        },
        {
          key: 0,
          value: '否',
        },
      ],
      extraForm: (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            prevValues.isSilence !== curValues.isSilence
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('isSilence') === 1 ? (
              <Form.Item
                name="silenceTime"
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}
              >
                <TimePicker.RangePicker
                  format="HH:mm"
                  style={{ width: '100%', marginTop: 8 }}
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>
      ),
      onChange: (e: string) => {
        console.log(e);
      },
    },
  ];

  formOptions.forEach((v) => {
    v.labelCol = { span: 6 };
    v.wrapperCol = { span: 17 };
  });

  const formList = useMemo(() => {
    //模板
    if (drawerType === 'template') {
      return formOptions.slice(1, 8);
    }

    return formOptions;
  }, [drawerType, groupData]);

  //收集数据
  const onFinish = () => {
    form.validateFields().then((value) => {
      console.log(value, '99999');
      console.log(labelTableData, 'labelTableData');
      const obj = {
        ...value,
        labels: stepTableMap(labelTableData),
        annotations: stepTableMap(annotationsTableData),
        duration: `${value.duration}${value.timeType}`,
      };
      if (value?.silence) {
        obj.silenceStart = moment(value.silenceTime[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        obj.silenceEnd = moment(value.silenceTime[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      }
      delete obj.timeType;
      console.log(obj, 'oooooo');
      onSubmit && onSubmit(obj);
    });
  };

  return (
    <Drawer
      title={drawerTitle}
      onClose={() => {
        onClose();
        form.resetFields();
      }}
      visible={visible}
      width={700}
      bodyStyle={{ paddingRight: 0 }}
      footer={
        <Space>
          <Button type="primary" onClick={onFinish}>
            确认
          </Button>
          <Button
            onClick={() => {
              onClose();
              form.resetFields();
            }}
          >
            取消
          </Button>
        </Space>
      }
      footerStyle={{ textAlign: 'right' }}
      destroyOnClose
    >
      <Form form={form}>{renderForm(formList)}</Form>
    </Drawer>
  );
};

export default TemplateDrawer;

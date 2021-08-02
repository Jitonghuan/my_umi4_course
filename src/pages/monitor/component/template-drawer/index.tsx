import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Button, Space, Drawer, Form, Select, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { renderForm } from '@/components/table-search/form';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import useRequest from '@/utils/useRequest';
import EditTable from '@/components/edit-table';
import { editColumns } from './colunms';
import { Item } from '../../typing';
import { stepTableMap } from '../../util';
import { queryRuleTemplatesList, queryGroupList } from '../../service';
import './index.less';

interface IRef {
  setTreeData: (data: any) => void;
}

interface TemplateDrawerProps {
  visible: boolean;
  drawerTitle: string;
  drawerType?: 'rules' | 'template';
  onClose: () => void;
  type?: 'add' | 'edit';
  record?: Item;
  onSubmit?: (value: Record<string, string>) => void;
}

const ALERT_LEVEL: Record<string, { text: string; value: number }> = {
  '2': { text: '警告', value: 2 },
  '3': { text: '严重', value: 3 },
  '4': { text: '灾难', value: 4 },
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
  const [ruleTemplatesList, setRuleTemplatesList] = useState<Item[]>([]);

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
  const { run: queryRuleTemplatesListFun } = useRequest({
    api: queryRuleTemplatesList,
    method: 'GET',
    onSuccess: (data) => {
      setRuleTemplatesList(
        data?.dataSource.map((v: any) => {
          return {
            ...v,
            key: v.name,
            value: v.name,
          };
        }),
      );
    },
  });

  const labelFun = (value: Item[]) => {
    setLabelTableData(value);
  };

  const annotationsFun = (value: Item[]) => {
    setAnnotationsTableData(value);
  };

  //数组转map
  const formatTableDataMap = (value: Record<string, string> = {}) => {
    const item = value ?? {};

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
    if (Object.keys(record).length === 0) return;
    const list = record?.duration?.split('') ?? [];
    // let receiver: string[] | undefined = [];
    // let receiverType: string[] | undefined = [];
    let silenceTime: Moment[] = [];

    //回显数据
    const setValues = {
      ...record,
      duration: list.slice(0, list.length - 1).join(''),
      timeType: list[list?.length - 1],
      level: ALERT_LEVEL[record.level as number]?.value,
    };

    //规则情况
    if (drawerType === 'rules') {
      //回显时间
      if (record?.silence) {
        silenceTime[0] = moment(record?.silenceStart, 'HH:mm');
        silenceTime[1] = moment(record?.silenceEnd, 'HH:mm');
      }

      setValues.silenceTime = silenceTime;
    }

    form.setFieldsValue({
      ...setValues,
    });

    setLabelTableData(formatTableDataMap(record?.labels as Record<string, string>));
    setAnnotationsTableData(formatTableDataMap(record?.annotations as Record<string, string>));
  };

  //打开抽屉在请求
  useEffect(() => {
    if (!visible) {
      onCancel();
      return;
    }
    groupList();
  }, [visible]);

  useEffect(() => {
    //报警规则
    if (drawerType === 'rules') {
      queryRuleTemplatesListFun({ pageIndex: -1, status: 0 });
    }
  }, [drawerType]);

  useEffect(() => {
    //报警模板回显数据
    if (!visible) {
      onCancel();
      return;
    }
    const findRecord = (ruleTemplatesList as Item[])?.find((v) => v.name === ruleTemplate) ?? {};
    editDataDetail(findRecord);
  }, [visible, ruleTemplate]);

  useEffect(() => {
    //编辑
    if (type === 'edit' && visible) {
      editDataDetail(record);
    }
  }, [type, record, visible]);

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '报警模版',
      dataIndex: 'ruleTemplate',
      placeholder: '选择告警模版，根据模版自动填充以下内容',
      required: true,
      option: ruleTemplatesList as OptionProps[],
      rules: [],
      onChange: (e: string) => {
        setRuleTemplate(e);
      },
    },
    {
      key: '2',
      type: 'input',
      label: drawerType === 'rules' ? '规则名称' : '模板名称',
      dataIndex: 'name',
      placeholder: '请输入',
      required: true,
      disable: type === 'edit',
      rules: [
        {
          whitespace: true,
          required: true,
          message: '请输入正确的名称',
          // message: "请输入正确的名称(字母数字开头、结尾，支持 '-' , '.')",
          // pattern: /^[\d|a-z]+$|^[\d|a-z][(a-z\d\-\.)]*[\d|a-z]$|^[\d|a-z]+$/,
          type: 'string',
          max: 200,
        },
      ],
    },
    {
      key: '3',
      type: 'select',
      label: '分类',
      dataIndex: 'group',
      placeholder: '请选择',
      required: true,
      option: groupData,
    },
    {
      key: '4',
      type: 'area',
      label: '告警表达式(PromQL)',
      dataIndex: 'expression',
      placeholder: '请输入',
      required: true,
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
      min: 1,
      extraForm: (
        <Form.Item name="timeType" noStyle initialValue="m">
          <Select style={{ width: '90%' }} placeholder="选择时间单位">
            <Select.Option value="h">小时</Select.Option>
            <Select.Option value="m">分钟</Select.Option>
            <Select.Option value="s">秒</Select.Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      key: '6',
      type: 'input',
      label: '告警消息',
      dataIndex: 'message',
      // width: '144px',
      placeholder: '请输入',
      required: true,
    },
    {
      key: '7',
      type: 'select',
      label: '告警级别',
      dataIndex: 'level',
      // width: '144px',
      placeholder: '请选择',
      required: true,
      rules: [
        {
          required: true,
          message: '请选择',
          type: 'number',
        },
      ],
      option: [
        {
          key: 2,
          value: '警告',
          label: '警告',
        },
        {
          key: 3,
          value: '严重',
          label: '严重',
        },
        {
          key: 4,
          value: '灾难',
          label: '灾难',
        },
      ],
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
          <EditTable
            onTableChange={labelFun}
            initData={labelTableData}
            headerTitle="标签（Labels):"
            style={{ marginBottom: 8 }}
            columns={editColumns}
            handleAddItem={() => {
              return {
                id: labelTableData.length,
                key: 'key',
                value: 'value',
              };
            }}
          />
          <EditTable
            onTableChange={annotationsFun}
            initData={annotationsTableData}
            headerTitle="注释（Annotations):"
            style={{ marginBottom: 16 }}
            columns={editColumns}
            handleAddItem={() => {
              return {
                id: annotationsTableData.length,
                key: 'key',
                value: 'value',
              };
            }}
          />
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
          label: '东来',
        },
        {
          key: '羁绊',
          value: '羁绊',
          label: '羁绊',
        },
      ],
      rules: [
        {
          required: true,
          message: '请选择',
          type: 'array',
        },
      ],
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
          key: 'dingding',
          value: '钉钉',
          label: '钉钉',
        },
        {
          key: 'phone',
          value: '电话',
          label: '电话',
        },
      ],
      rules: [
        {
          required: true,
          message: '请选择',
          type: 'array',
        },
      ],
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
          label: '是',
        },
        {
          key: 0,
          value: '否',
          label: '否',
        },
      ],
      extraForm: (
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.silence !== curValues.silence}>
          {({ getFieldValue }) => {
            return getFieldValue('silence') === 1 ? (
              <Form.Item
                name="silenceTime"
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}
              >
                <TimePicker.RangePicker format="HH:mm" style={{ width: '100%', marginTop: 8 }} />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
      ),
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
  }, [drawerType, groupData, labelTableData, annotationsTableData]);

  //收集数据
  const onFinish = () => {
    form.validateFields().then((value) => {
      const obj = {
        ...value,
        labels: stepTableMap(labelTableData),
        annotations: stepTableMap(annotationsTableData),
        duration: `${value.duration}${value.timeType}`,
      };
      if (value?.silence) {
        obj.silenceStart = moment(value.silenceTime[0]).format('HH:mm');
        obj.silenceEnd = moment(value.silenceTime[1]).format('HH:mm');
        delete obj.silenceTime;
      }
      if (type === 'edit') {
        obj.id = record?.id;
      }
      delete obj.timeType;
      onSubmit && onSubmit(obj);
    });
  };

  const onCancel = () => {
    setLabelTableData([]);
    setAnnotationsTableData([]);
    setRuleTemplate('');
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={drawerTitle}
      onClose={onCancel}
      visible={visible}
      width={700}
      bodyStyle={{ paddingRight: 0 }}
      maskClosable={false}
      footer={
        <Space>
          <Button type="primary" onClick={onFinish}>
            确认
          </Button>
          <Button onClick={onCancel}>取消</Button>
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

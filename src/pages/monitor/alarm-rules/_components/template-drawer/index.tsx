// fork from business/component/template-drawer

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Button, Space, Drawer, Form, Select, TimePicker, Input, InputNumber, Radio, Row, Col } from 'antd';
import moment, { Moment } from 'moment';
import { OptionProps } from '@/components/table-search/typing';
import useRequest from '@/utils/useRequest';
import EditorTable from '@cffe/pc-editor-table';
import { editColumns } from './colunms';
import { Item } from '../../../basic/typing';
import { stepTableMap } from '../../../basic/util';
import { getRequest } from '@/utils/request';
import { useAppOptions } from '../../hooks';
import { queryRuleTemplatesList, queryGroupList, getEnvCodeList } from '../../../basic/services';
import { getCluster} from '../../../../monitor/current-alarm/service';
import { useUserOptions } from './hooks';
import './index.less';
import UserSelector from "@/components/user-selector";

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
  const [appOptions] = useAppOptions();
  const [labelTableData, setLabelTableData] = useState<Item[]>([]);
  const [annotationsTableData, setAnnotationsTableData] = useState<Item[]>([]);
  const [groupData, setGroupData] = useState<OptionProps[]>([]);
  const [ruleTemplate, setRuleTemplate] = useState('');
  const [envTypeCode, setEnvTypeCode] = useState('');
  const [ruleTemplatesList, setRuleTemplatesList] = useState<Item[]>([]);
  const [userOptions] = useUserOptions();
  const [clusterList, setClusterList] = useState<any>([]);
  const [getSilenceValue, setGetSilenceValue] = useState(0);
  
  
  const envTypeData = [
    {
      key: 'dev',
      label: 'DEV',
      value: 'dev',
    },
    {
      key: 'test',
      label: 'TEST',
      value: 'test',
    },
    {
      key: 'pre',
      label: 'PRE',
      value: 'pre',
    },
    {
      key: 'prod',
      label: 'PROD',
      value: 'prod',
    },
  ]; //环境大类
  const silenceOptions = [
    {
      key: 1,
      value: 1,
      label: '是',
    },
    {
      key: 0,
      value: 0,
      label: '否',
    },
  ];
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
  //集群环境 下拉选择数据
  let envOptions: any = [];
  const [clusterEnvOptions, setClusterEnvOptions] = useState<any[]>([]);
  const queryEnvCodeList = async (envTypeCode: string) => {
    await getRequest(getEnvCodeList, {
      data: { envTypeCode },
    }).then((resp) => {
      if (resp?.success) {
        let data = resp?.data;
        data?.map((item: any) => {
          envOptions.push({
            label: item.envCode,
            value: item.envCode,
          });
        });
        // const next = (data || []).map((n: any) => ({
        //   label: n.envCode,
        //   value: n.envCode,
        // }));
        setClusterEnvOptions(envOptions);
      }
    });
  };

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
    let silenceStart: any;
    let silenceEnd: any;
    let currentReceiver: any = [];
    if (!record?.receiver) {
      currentReceiver = [];
    } else {
      currentReceiver = record?.receiver?.split(',');
    }
    //回显数据
    const setValues = {
      ...record,
      receiver: currentReceiver,
      duration: list.slice(0, list.length - 1).join(''),
      timeType: list[list?.length - 1],
      level: ALERT_LEVEL[record.level as number]?.value,
    };

    //规则情况
    if (drawerType === 'rules') {
      //回显时间

      if (record?.silence) {
        silenceStart = moment(record?.silenceStart, 'HH:mm');
        silenceEnd = moment(record?.silenceEnd, 'HH:mm');
        setGetSilenceValue(record.silence);
      } else {
        setGetSilenceValue(0);
      }

      setValues.silenceStart = silenceStart;
      setValues.silenceEnd = silenceEnd;
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
    getCluster().then((res)=>{
      if(res?.success){
        const data=res?.data?.map((item: any)=>{
          return {
            label: item.clusterName,
            value: item.id,
          }
        })
        setClusterList(data);

      }

    })
  }, [visible]);

  useEffect(() => {
    //报警规则
    if (drawerType === 'rules') {
      queryRuleTemplatesListFun({ pageSize: -1, status: 0 });
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
  const rulesOptions = [
    {
      key: 2,
      value: 2,
      label: '警告',
    },
    {
      key: 3,
      value: 3,
      label: '严重',
    },
    {
      key: 4,
      value: 4,
      label: '灾难',
    },
  ];

  //收集数据
  const onFinish = () => {
    form.validateFields().then((value) => {
      const obj = {
        ...value,
        receiver: (value?.receiver || []).join(','),
        labels: stepTableMap(labelTableData),
        annotations: stepTableMap(annotationsTableData),
        duration: `${value.duration}${value.timeType}`,
      };

      if (value?.silence) {
        obj.silenceStart = moment(value.silenceStart).format('HH:mm');
        obj.silenceEnd = moment(value.silenceEnd).format('HH:mm');
        delete obj.silenceTime;
      }
      if (type === 'edit') {
        obj.id = record?.id;
        obj.bizMonitorId = record?.bizMonitorId;
        obj.bizMonitorType = record?.bizMonitorType;
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
      className="rulesEdit"
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
      <Form form={form} labelCol={{ flex: '150px' }}>
        {/* {renderForm(formList)} */}
        <Form.Item label="报警模版" name="ruleId">
          <Select
            style={{ width: '400px' }}
            allowClear
            showSearch
            options={ruleTemplatesList as OptionProps[]}
            onChange={(e: string) => {
              setRuleTemplate(e);
            }}
            placeholder="选择告警模版，根据模版自动填充以下内容"
          />
        </Form.Item>
        <Form.Item
          label={drawerType === 'rules' ? '规则名称' : '模板名称'}
          name="name"
          rules={[
            {
              whitespace: true,
              required: true,
              message: '请输入正确的名称',
              type: 'string',
              max: 200,
            },
          ]}
        >
          <Input placeholder="请输入" style={{ width: '400px' }} />
        </Form.Item>
        <Form.Item label="报警分类" name="group" required={true}>
          <Select options={groupData} placeholder="请选择" style={{ width: '400px' }} allowClear />
        </Form.Item>
        <Form.Item label="集群选择"  name="clusterId">
          <Select style={{ width: '400px' }} showSearch allowClear options={clusterList}/>

        </Form.Item>
        {/* <Form.Item label="环境分类" name="envTypeCode" required={true}>
          <Select
            showSearch
            allowClear
            options={envTypeData}
            style={{ width: '400px' }}
            onChange={(e: string) => {
              setEnvTypeCode(e);
              queryEnvCodeList(e);
            }}
          />
        </Form.Item>
        <Form.Item label="选择环境" name="envCode" rules={[{ required: true, message: '请选择集群环境！' }]}>
          <Select
            options={clusterEnvOptions}
            style={{ width: '400px' }}
            placeholder="选择监控的集群环境"
            showSearch
            allowClear
          />
        </Form.Item> */}
        <Form.Item label="Namespace" name="namespace">
          <Input style={{ width: '400px' }} placeholder="输入Namespace名称" />
        </Form.Item>

        <Form.Item label="关联应用" name="appCode">
          <Select
            options={appOptions}
            style={{ width: '400px' }}
            placeholder="选择关联应用"
            showSearch
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="告警表达式(PromQL)"
          name="expression"
          rules={[{ required: true, message: '请输入告警表达式!' }]}
        >
          <Input.TextArea placeholder="请输入" style={{ width: '400px' }} />
        </Form.Item>
        <Row>
          <Form.Item label="报警持续时间" name="duration" rules={[{ required: true, message: '请输入报警持续时间!' }]}>
            <InputNumber style={{ width: '290px' }} />
          </Form.Item>
          <Form.Item name="timeType" noStyle initialValue="m" className="extraStyleTime">
            <Select style={{ width: '20%' }} placeholder="选择时间单位" allowClear>
              <Select.Option value="h">小时</Select.Option>
              <Select.Option value="m">分钟</Select.Option>
              <Select.Option value="s">秒</Select.Option>
            </Select>
          </Form.Item>
        </Row>

        <Form.Item label="告警级别" name="level" rules={[{ required: true, message: '请选择告警级别!' }]}>
          <Select options={rulesOptions} placeholder="请选择" style={{ width: '400px' }} allowClear />
        </Form.Item>
        <Form.Item label="报警消息" name="message" required={true}>
          <Input placeholder="消息便于更好识别报警" style={{ width: '400px' }} />
        </Form.Item>
        <Form.Item label="通知对象" name="receiver">
          <UserSelector style={{ width: '400px' }} />
        </Form.Item>
        <Form.Item label="通知组" name="groupName">
          <Select  style={{ width: '400px' }}  allowClear showSearch/>
        </Form.Item>
        
        {/* <Form.Item label="DingToken" name="dingToken">
          <Input />
        </Form.Item> */}
        <Form.Item
          label="是否静默"
          name="silence"
          style={{ verticalAlign: 'sub' }}
          rules={[{ required: true, message: '请选择是否静默!' }]}
        >
          <Radio.Group
            options={silenceOptions}
            value={getSilenceValue}
            onChange={(e) => {
              setGetSilenceValue(e.target.value);
            }}
          />
        </Form.Item>
        <Row>
          <Col span={5}></Col>
          <Col span={19}>
            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.silence !== curValues.silence}>
              {getSilenceValue === 1 ? (
                <div>
                  <Form.Item label="开始时间" name="silenceStart" rules={[{ required: true, message: '请选择' }]}>
                    <TimePicker format="HH:mm" style={{ width: '40%', marginTop: 8 }} />
                  </Form.Item>
                  <Form.Item label="结束时间" name="silenceEnd" rules={[{ required: true, message: '请选择' }]}>
                    <TimePicker format="HH:mm" style={{ width: '40%', marginTop: 8 }} />
                  </Form.Item>
                </div>
              ) : null}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="高级配置" rules={[{ required: true, message: '请填写高级配置!' }]}>
          <Form.Item noStyle>
            <span>标签（Labels):</span>
            <EditorTable
              columns={editColumns}
              onChange={labelFun}
              value={labelTableData}
              style={{ width: '90%' }}
            />
            <span>注释（Annotations):</span>
            <EditorTable
              columns={editColumns}
              onChange={annotationsFun}
              value={annotationsTableData}
              style={{ width: '90%' }}
            />
          </Form.Item>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default TemplateDrawer;

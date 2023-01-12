import React, {useEffect, useState} from "react";
import { Button, Col, Drawer, Form, Input, InputNumber, message, Radio, Row, Select, Space, TimePicker } from 'antd'
import UserSelector from "@/components/user-selector";
import EditorTable from "@cffe/pc-editor-table";
import { rulesCreate, rulesUpdate, queryGroupList } from '@/pages/monitor/business/service';
import { getRequest, postRequest, putRequest } from "@/utils/request";
import { stepTableMap, formatTableDataMap } from "@/pages/monitor/basic/util";
import { getEnvCodeList ,getPromQLApi} from '../../basic/services';
import moment from "moment";
import {envTypeData,rulesOptions,silenceOptions,editColumns,ALERT_LEVEL} from './type'

const { TextArea } = Input;

interface IPros {
  type: string;
  onCancel: () => void;
  onConfirm: () => void;
  visible: boolean;
  record?: any;
  entryType?:string;
  bizMonitorId: string | number;
  bizMonitorType: string;
  envCode: string;
  probeName?:string
  monitorName?:string;
  uniquelyIdentify?:string
}



const RulesEdit = (props: IPros) => {
  const { type = 'add', onCancel, onConfirm, visible,probeName,uniquelyIdentify,entryType,monitorName, record = {}, bizMonitorId, bizMonitorType, envCode } = props;
  const [unit, setUnit] = useState('m'); // 单位
  const [getSilenceValue, setGetSilenceValue] = useState(0);
  const [labelTableData, setLabelTableData] = useState<any[]>([]);
  const [annotationsTableData, setAnnotationsTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [groupData, setGroupData] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [clusterEnvOptions, setClusterEnvOptions] = useState<any[]>([]);
  const [promQL,setPromQL]=useState<string>("")
  //getPromQLApi
  const getPromQL=()=>{
    getRequest(getPromQLApi,{data:{probeName}}).then((res)=>{
      if(res?.success){
        setPromQL(res?.data||"")
        form.setFieldsValue({
          expression:res?.data||""
        })

      }

    })
  }
  useEffect(()=>{
    if(probeName&&visible){

      getPromQL()
      
    }
  },[visible])

  const getGroupList = async () => {
    const res = await getRequest(queryGroupList);
    if (res?.data) {
      setGroupData(
        res.data?.map((v: any) => {
          return {
            key: v,
            value: v,
          };
        }),
      );

      if(uniquelyIdentify&&uniquelyIdentify==="business"){
        form.setFieldsValue({
          group:"业务监控"
        })


      }
    }
  }

  const labelFun = (value: any[]) => {
    setLabelTableData(value);
  };

  const annotationsFun = (value: any[]) => {
    setAnnotationsTableData(value);
  };
  

  const onFinish = async () => {
    const params = await form.validateFields();
    const data = {
      ...params,
      receiver: (params?.receiver || []).join(','),
      labels:Object.assign(stepTableMap(labelTableData) ,{type:entryType},{monitorName}),
      //labels: stepTableMap(labelTableData),
      annotations: stepTableMap(annotationsTableData),
      duration: `${params.duration}${unit}`,
      bizMonitorId,
      bizMonitorType,
      envCode:bizMonitorType==="netProbe"?params?.envCode:envCode
    }
    if (params?.silence) {
      data.silenceStart = moment(params.silenceStart).format('HH:mm');
      data.silenceEnd = moment(params.silenceEnd).format('HH:mm');
      delete data.silenceTime;
    }
    delete data.timeType;

    let res = null;
    setLoading(true);
    if (type === 'add') {
      res = await postRequest(rulesCreate, {
        data
      })
    } else {
      data.id = record?.id;
      res = await putRequest(rulesUpdate, {
        data
      })
    }
    setLoading(false);
    if (res?.success) {
      message.success(type === 'add' ? '新增成功' : '修改成功');
      onConfirm();
    }
  }

  useEffect(() => {
    if (visible) {
     
      if (type === 'add') {
        setLabelTableData([]);
        setAnnotationsTableData([]);
        form.resetFields();
      } else {
        const list = record?.duration?.split('') ?? [];
        let silenceStart: any;
        let silenceEnd: any;
        let currentReceiver: any = [];
        if (!record?.receiver) {
          currentReceiver = [];
        } else {
          currentReceiver = record?.receiver?.split(',');
        }

        const setValues = {
          ...record,
          receiver: currentReceiver,
          duration: list.slice(0, list.length - 1).join(''),
          timeType: list[list?.length - 1],
          level: ALERT_LEVEL[record.level as number]?.value,
        };
        if (record?.silence) {
          silenceStart = moment(record?.silenceStart, 'HH:mm');
          silenceEnd = moment(record?.silenceEnd, 'HH:mm');
          setGetSilenceValue(record.silence);
        } else {
          setGetSilenceValue(0);
        }

        setValues.silenceStart = silenceStart;
        setValues.silenceEnd = silenceEnd;
        form.setFieldsValue({
          ...setValues,
        });

        setLabelTableData(formatTableDataMap(record?.labels as Record<string, string>));
        setAnnotationsTableData(formatTableDataMap(record?.annotations as Record<string, string>));
      }
      void getGroupList();
    }
  }, [visible]);
  const queryEnvCodeList = async (envTypeCode: string) => {
    await getRequest(getEnvCodeList, {
      data: { envTypeCode },
    }).then((resp) => {
      if (resp?.success) {
        let data = resp?.data;
        let envOptions: any = [];
        data?.map((item: any) => {
          envOptions.push({
            label: item.envCode,
            value: item.envCode,
          });
        });
        setClusterEnvOptions(envOptions);
      }
    });
  };

  return (
    <Drawer
      className="rulesEdit"
      title={type === 'edit' ? '编辑告警规则' : '新增报警规则'}
      onClose={onCancel}
      visible={visible}
      width={700}
      bodyStyle={{ paddingRight: 0 }}
      maskClosable={false}
      footer={
        <Space>
          <Button type="primary" onClick={onFinish} loading={loading}>
            确认
          </Button>
          <Button onClick={onCancel} loading={loading}>取消</Button>
        </Space>
      }
      footerStyle={{ textAlign: 'right' }}
      destroyOnClose
    >
      <Form form={form} labelCol={{ flex: '150px' }} style={{ paddingRight: '15px' }}>
        <Form.Item label="规则名称" name="name" rules={[{ required: true, message: '请填写' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="告警分类" name="group" required={false} rules={[{ required: true, message: '请选择告警分类' }]}>
          <Select placeholder="请选择" options={groupData} disabled={uniquelyIdentify==="business"} />
        </Form.Item>
        {bizMonitorType==="netProbe"&&( <Form.Item label="环境分类" name="envTypeCode" required={true}>
          <Select
            showSearch
            allowClear
            options={envTypeData}
            style={{ width: '400px' }}
            onChange={(e: string) => {
             // setEnvTypeCode(e);
              queryEnvCodeList(e);
            }}
          />
        </Form.Item>)}
        {bizMonitorType==="netProbe"&&(  <Form.Item label="选择环境" name="envCode" rules={[{ required: true, message: '请选择集群环境！' }]}>
          <Select
            options={clusterEnvOptions}
            style={{ width: '400px' }}
            placeholder="选择监控的集群环境"
            showSearch
            allowClear
          />
        </Form.Item>)}
        <Form.Item
          label="告警表达式(PromQl)"
          name="expression"
          rules={[{ required: true, message: '请输入' }]}
        >
          <TextArea
            rows={2}
          />
        </Form.Item>
        <Form.Item name="duration" label="持续时间" rules={[{ required: true, message: '请填写持续时间' }]}>
          <InputNumber
            step={1}
            min={1}
            addonAfter={(
              <Select defaultValue="m" value={unit} onChange={setUnit} style={{ width: 80 }}>
                <Select.Option value="m">分钟</Select.Option>
                <Select.Option value="h">小时</Select.Option>
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item label="告警消息" name="message" rules={[{ required: true, message: '请填写' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="告警级别" name="level" rules={[{ required: true, message: '请选择告警级别!' }]}>
          <Select options={rulesOptions} placeholder="请选择" style={{ width: '400px' }} allowClear />
        </Form.Item>
        <Form.Item label="通知对象" name="receiver" rules={[{ required: true, message: '请填写' }]}>
          <UserSelector />
        </Form.Item>
        <Form.Item
          label="是否静默"
          name="silence"
          style={{ verticalAlign: 'sub' }}
          rules={[{ required: true, message: '请选择是否静默!' }]}
        >
          <Radio.Group
            options={silenceOptions}
            value={getSilenceValue}
            onChange={(e) => setGetSilenceValue(e.target.value)}
          />
        </Form.Item>
        <Row>
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
  )
}

export default RulesEdit;

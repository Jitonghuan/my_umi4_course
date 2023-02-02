import React, {useEffect, useState} from "react";
import { Button, Col, Drawer, Form, Input, InputNumber, message, Radio, Row, Select, Space, TimePicker } from 'antd'
import UserSelector from "@/components/user-selector";
import EditorTable from "@cffe/pc-editor-table";
import { rulesCreate, rulesUpdate, queryGroupList } from '@/pages/monitor/business/service';
import { getRequest, postRequest, putRequest } from "@/utils/request";
import { stepTableMap, formatTableDataMap } from "@/pages/monitor/basic/util";
import { getEnvCodeList ,getPromQLApi} from '../../basic/services';
import { getCluster} from '../../../monitor/current-alarm/service';
import moment from "moment";
import {useGroupOptions} from '../../alarm-rules/_components/template-drawer/hooks'
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
  uniquelyIdentify?:string;
  appCode?:string
}



const RulesEdit = (props: IPros) => {
  const { type = 'add', onCancel, onConfirm, visible,probeName,uniquelyIdentify,entryType,monitorName, record = {}, bizMonitorId, bizMonitorType, envCode,appCode =""} = props;
  const [unit, setUnit] = useState('m'); // 单位
  const [getSilenceValue, setGetSilenceValue] = useState(0);
  const [labelTableData, setLabelTableData] = useState<any[]>([]);
  const [annotationsTableData, setAnnotationsTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [groupData, setGroupData] = useState<any[]>([]);
  const [clusterList, setClusterList] = useState<any>([]);
  const [form] = Form.useForm();
  const [promQL,setPromQL]=useState<string>("")
  const [groupOptions]=useGroupOptions()
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
  useEffect(()=>{
    if(visible){
      getCluster().then((res)=>{
        if(res?.success){
          const data=res?.data?.map((item: any)=>{
            return {
              label: item.clusterName,
              value: item.clusterName,
            }
          })
          setClusterList(data);
  
        }
  
      })
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
      envCode:bizMonitorType==="netProbe"?params?.envCode:envCode,
      receiverGroup: (params?.receiverGroup || []).join(','),
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
          receiverGroup: record?.receiverGroup?record?.receiverGroup?.split(','):[],
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
//as Record<string, string>
        setLabelTableData(formatTableDataMap({...record?.labels,appCode:appCode }));
        setAnnotationsTableData(formatTableDataMap(record?.annotations as Record<string, string>));
      }
      void getGroupList();
    }
  }, [visible]);
  

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
        {bizMonitorType==="netProbe"&&(   <Form.Item label="集群选择"  name="clusterName">
          <Select style={{ width: '400px' }} showSearch allowClear options={clusterList}/>

        </Form.Item>)}
        {bizMonitorType==="netProbe"&&(  <Form.Item label="Namespace" name="namespace">
          <Input style={{ width: '400px' }} placeholder="输入Namespace名称" />
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
        {bizMonitorType==="netProbe"&&(  <Form.Item label="通知组" name="receiverGroup" initialValue={['默认组']}>
          <Select  style={{ width: '400px' }} options={groupOptions} defaultValue={['默认组']}  allowClear showSearch mode="multiple"/>
        </Form.Item>)}
        
        
        {uniquelyIdentify&&uniquelyIdentify==="business"&& <Form.Item label="通知组" name="receiverGroup" initialValue={['默认组']}>
          <Select  style={{ width: '400px' }} options={groupOptions} defaultValue={['默认组']}  allowClear showSearch mode="multiple"/>
        </Form.Item>}
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

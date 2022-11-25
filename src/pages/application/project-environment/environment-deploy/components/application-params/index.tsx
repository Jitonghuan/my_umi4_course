// 上下布局页面 应用模版
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20--2022/11/24 15:47

import React, { useContext, useRef } from 'react';
import { Button, Row, Col, Form, Select, Space, message, Spin, Modal, Radio} from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest,putRequest} from '@/utils/request';
import { useLocation} from 'umi';
import { useState, useEffect } from 'react';
import AceEditor from '@/components/ace-editor';
import { parse } from 'query-string';
import DetailContext from '../../context';
import EditorTable from '@cffe/pc-editor-table';
import * as APIS from '@/pages/application/service';
import './index.less';

export default function ApplicationParams(props: any) {
  let location:any = useLocation();
  const query :any= parse(location.search);
  const { envCode,benchmarkEnvCode } = query || {};
  const { appData,projectEnvCode } = useContext(DetailContext);
  const { appCode } = appData || {};
  const [appTmplForm] = Form.useForm();
  const [restarForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tmplTypeOptions,setTmplTypeOptions]=useState<any>([]);
  const [infoLoading, setInfoloading] = useState<boolean>(false);
  const [value, setValue] = useState<number>(1);
  const [initTmplType,setInitTmplType]=useState<string>("")
  const [ensureDisable, setEnsureDisable] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(0);
  const [tmplId,setTmplId]=useState<number>();
  const [isDeployment, setIsDeployment] = useState<string>();
  const appEnvOptions=[{
    label:projectEnvCode,
    value:projectEnvCode
  }]
  
  
  useEffect(() => {
    getTmplType()
    appTmplForm.setFieldsValue({
      appEnvCode: appEnvOptions[0]?.value,
    });
  }, []);

  useEffect(() => {
    if (modalVisible) {
      restarForm.setFieldsValue({
        restartPolicy: 1,
      });
    }
  }, [modalVisible]);
  const getTmplType=()=>{
    getRequest(APIS.tmplType).then((result) => {
      const listTmplType = (result.data || []).map((n: any) => ({
        label: n,
        value: n,
      }));
      setTmplTypeOptions(listTmplType)
      let tmplType = '';
      if(listTmplType?.length>0){
        listTmplType.forEach((element: any) => {
          if (element?.value === 'deployment') {
            tmplType = element.value;
          } else if (element?.value === 'service') {
            tmplType = element.value;   
          }else{
            tmplType = listTmplType[0]?.value
          }
        });
        appTmplForm.setFieldsValue({
          tmplType: tmplType,
        });
        setInitTmplType(tmplType)
        getAppTmpl(tmplType)

      }
     
    
      
    })

  }
  const getAppTmpl=(templateType?:string)=>{
    setInfoloading(true);
     getRequest(APIS.paramsList, {
      data: {
        envCode:projectEnvCode,
        appCode,
        templateType,
      },
    })
      .then((result) => {
        if (result.data.length > 0) {
          const appTmpl = result.data[0];
          // setInitTmplInfo(appTmpl)
          setTmplId(appTmpl?.id)
          setIsDeployment(appTmpl?.templateType);
          let tmplConfigArr = [];
          let jvm = '';
          for (const key in appTmpl.tmplConfigurableItem) {
            if (key === 'jvm') {
              jvm = appTmpl.tmplConfigurableItem[key];
            } else {
              tmplConfigArr.push({
                key: key,
                value: appTmpl.tmplConfigurableItem[key],
              });
            }
          }
          appTmplForm.setFieldsValue({
            appEnvCode: appTmpl.envCode,
            tmplType: appTmpl.templateType,
            value: appTmpl.value,
            tmplConfigurableItem: tmplConfigArr,
            jvm: jvm,
          });
          setIsDeployment(appTmpl.templateType);
          setLimit(tmplConfigArr.length);
        } else {
          message.info(`${projectEnvCode}环境的${templateType}类型模版为空`);
        }
      })
      .finally(() => {
        setInfoloading(false); 
      });

  }
  const resetData=()=>{

     getAppTmpl(initTmplType)
     //initTmplType
     appTmplForm.setFieldsValue({
      tmplType:initTmplType
     })
  }
  const onChangeTmplType=(value:string)=>{
    getAppTmpl(value)
    setEnsureDisable(false);

  }

  //编辑应用模版
  const updateTmpl = async () => {
    const params = await restarForm.validateFields();
    const values = appTmplForm.getFieldsValue();
    const tmplConfigurableItem = values.tmplConfigurableItem?.reduce((prev: any, el: any) => {
      prev[el.key] = el.value;
      return prev;
    }, {} as any);
    const value = values.value;
    putRequest(APIS.editParams, {
      data: { id:tmplId, value, jvm: values?.jvm, tmplConfigurableItem, restartPolicy: params?.restartPolicy },
    }).then((result) => {
      if (result.success) {
        message.success('提交成功！');
        setModalVisible(false);
       
        setTimeout(() => {
          getAppTmpl(values?.tmplType)
        }, 200);
      }
    });
  };

  return (
    <ContentCard>
      <Form
        form={appTmplForm}
        onFinish={() => {
          setModalVisible(true);
        }}
      >
        <Row>
          <div>
            <Form.Item label=" 应用环境：" name="appEnvCode">
              <Select showSearch style={{ width: 200 }} options={appEnvOptions} disabled={true} />
            </Form.Item>
          </div>
          <div style={{ marginLeft: 16 }}>
            <Form.Item label=" 模版类型" name="tmplType">
              <Select showSearch style={{ width: 200 }} options={tmplTypeOptions} onChange={onChangeTmplType} />
            </Form.Item>
          </div>
          <div style={{ marginLeft: 6 }}>
            <Button onClick={resetData}>
              重置
            </Button>
          </div>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col span={10}>
            <div
              style={{
                fontSize: 15,
                color: '#696969',
              }}
            >
              模版详情：
            </div>
            <Spin spinning={infoLoading}>
              <Form.Item name="value">
                <AceEditor mode="yaml" height={600} />
              </Form.Item>
            </Spin>
          </Col>
          <Col span={10} offset={2}>
            <div
              style={{
                fontSize: 15,
                color: '#696969',
              }}
            >
              可配置项：
            </div>
            <Spin spinning={infoLoading}>
              <Form.Item name="tmplConfigurableItem">
                <EditorTable
                  readOnly
                  limit={limit}
                  columns={[
                    {
                      title: 'Key',
                      dataIndex: 'key',
                      fieldType: 'readonly',
                      colProps: { width: 240 },
                    },
                    {
                      title: 'Value',
                      dataIndex: 'value',
                      colProps: { width: 280 },
                      fieldProps: {
                        readOnly: false,
                      },
                    },
                  ]}
                />
              </Form.Item>
            </Spin>
            {isDeployment == 'deployment' && appData?.appDevelopLanguage === 'java' && <span>JVM参数:</span>}
            {isDeployment == 'deployment' && appData?.appDevelopLanguage === 'java' && (
              <Spin spinning={infoLoading}>
                <Form.Item name="jvm">
                  <AceEditor mode="yaml" height={300} />
                </Form.Item>
              </Spin>
            )}
          </Col>
        </Row>
        <Form.Item>
          <Space size="small" style={{ float: 'right' }}>
            <Button onClick={resetData}>
              重置
            </Button>
            <Button type="primary" htmlType="submit" disabled={ensureDisable}>
              提交
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal
        title="请选择生效策略"
        visible={modalVisible}
        onOk={updateTmpl}
        onCancel={() => {
          setModalVisible(false);
        }}
        width={550}
        bodyStyle={{ minHeight: '150px' }}
      >
        <Form layout="inline" form={restarForm} labelCol={{ flex: '150px' }}>
          <Form.Item
            label="生效策略："
            name="restartPolicy"
            style={{ width: '100%' }}
            rules={[
              {
                required: true,
                message: '这是必选项',
              },
            ]}
          >
            <Radio.Group
              onChange={(e) => {
                setValue(e.target.value);
              }}
              value={value}
            >
              <Radio value={1}>下次发布生效</Radio>
              <Radio value={2}>立即生效</Radio>
            </Radio.Group>
          </Form.Item>
        
        </Form>
      </Modal>
    </ContentCard>
  );
}

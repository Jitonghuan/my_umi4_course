import React, { useState, useRef, useEffect } from 'react';
import { Form, Select, Input, Radio, InputNumber, Segmented, Drawer, Button, message, } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { frequencyOptions, questConfigOptions, tcpQuestConfig, dnsTypeOptions, visitAgreementOption, probeUrlOptions } from './type'
import EditorTable from '@cffe/pc-editor-table';
import './index.less'
import { createNetworkProbe, CreateNeworkProbeItems, updateNetworkProbe, UpdateNeworkProbeItems, useGetNetworkProbeType, useGetCluster, } from './hook'



interface Iprops {
  mode: EditorMode;
  onSave: (clusterName: string) => any;
  onClose: () => any;
  curRecord: any;
}
export default function EditDail(props: Iprops) {
  const { mode, curRecord, onSave, onClose } = props;
  const [form] = Form.useForm()
  const [dailTypesLoading, dailTypeOptions, getNetworkProbeProbeType] = useGetNetworkProbeType()
  const [clusterLoading, clusterData, getCluster] = useGetCluster()
  const [questConfigType, setQuestConfigType] = useState<string>(questConfigOptions[0]?.value)
  const [dailType, setDailType] = useState<string>("http");
  const [headersData, setHeadersData] = useState<any>([])
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const formDetailRef = useRef<any>(null);
  // const getData = () => formDetailRef?.current?.getData();
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getNetworkProbeProbeType()
    getCluster()
  }, [])

  useEffect(() => {
    if (mode === "HIDE") return
    if (dailTypeOptions?.length > 0 && mode === "ADD") {
     
      form.setFieldsValue({
        probeType: dailTypeOptions[0]?.value,
        probeConfig:"headers"
        
      })
      setDailType(dailTypeOptions[0]?.value)
      setQuestConfigType("headers")
    }



  }, [dailTypeOptions, mode])
  useEffect(() => {
    if (mode === "EDIT" && Object.keys(curRecord)?.length > 0) {
      const probeConfig = JSON.parse(curRecord?.probeConfig || "{}")
    
      const keyData = Object.keys(probeConfig)?.length > 0 ? Object.keys(probeConfig) : []
      let headersList: any = []
      let basicAuth: any = {}
      let queryResponseList: any = []
      setDailType(curRecord?.probeType)
      let dnsConfig = {}
      if (curRecord?.probeType === "dns") {

        dnsConfig = probeConfig
      }
      if (curRecord?.probeType === "http") {
        setQuestConfigType("headers")
        form.setFieldsValue({
          probeConfig:"headers"
        })
      }
      if (curRecord?.probeType === "tcp") {
        setQuestConfigType("queryResponse")
        form.setFieldsValue({
          probeConfig:"queryResponse"
        })
      }
      if (curRecord?.probeType === "http" && keyData?.includes("headers")) {
        headersList = Object.keys(probeConfig?.headers || {}).map((key) => ({
          httpKey: key,
          httpValue: probeConfig?.headers?.[key],
        }));
        setHeadersData(headersList)
     

      }
      if (curRecord?.probeType === "http" && keyData?.includes("basicAuth")) {
      
        basicAuth = probeConfig?.basicAuth
        setUsername(basicAuth?.username)
        setPassword( basicAuth?.password)
      }
      if (curRecord?.probeType === "tcp" && keyData?.includes("queryResponse")) {
        queryResponseList = Object.keys(probeConfig?.queryResponse || {}).map((key) => ({
          expect: key,
          send: probeConfig?.queryResponse?.[key],
        }));


      }

      form.setFieldsValue({
        ...curRecord,
        headers: headersList,
        probeTimeout: curRecord?.probeTimeout.substr(0, curRecord?.probeTimeout.length - 1),
        username: basicAuth?.username,
        password: basicAuth?.password,
        queryResponse: queryResponseList,
        ...dnsConfig

      })



    }
    return () => {
     // form.resetFields()


    }

  }, [mode])


  const onChangeType = ({ target: { value } }: RadioChangeEvent) => {
    setDailType(value)
    if (value === "http") {
      form.setFieldsValue({
        probeConfig: questConfigOptions[0]?.value
      })
      setQuestConfigType(questConfigOptions[0]?.value)

    }
    if (value === "tcp") {
      form.setFieldsValue({
        probeConfig: tcpQuestConfig[0]?.value
      })


    }

  };
  const handleSubmit = async() => {
    const payload = await form.validateFields();
    let dataParams: any = {}
    if (payload?.probeType === "http") {
      //如果类型是http配置格式：
      let configObj = {}
    
      const getData={
        headersData:form.getFieldValue("headers")||headersData,
        username:form.getFieldValue("username")||username,
        password:form.getFieldValue("password")||password

    }


      if (getData?.headersData?.length > 0) {

        const headersList = (getData?.headersData || []).reduce((prev: any, curr: any) => {
          prev[curr.httpKey] = curr.httpValue;
          return prev;
        }, {} as Record<string, any>);
        configObj = {
          headers: headersList,


        }
      }
      if (getData?.username && getData?.password) {

        let username = getData?.username
        Object.assign(configObj, {
          basicAuth: {
            username,
            password: getData?.password
          }
        })

      }



      dataParams = {
        ...payload,
        // clusterName:payload?.clusterName,
        // probeInterval:payload?.probeInterval,
        // probeName:payload?.probeName,
        // probeType:payload?.probeType,
        // probeUrl: payload?.probeUrl, 
        probeTimeout: `${payload?.probeTimeout}s`,
        probeConfig: JSON.stringify(configObj)
      }
    }


    if (payload?.probeType === "tcp") {
      const queryResponseList = (payload?.queryResponse || []).reduce((prev: any, curr: any) => {
        prev[curr.expect] = curr.send;
        return prev;
      }, {} as Record<string, any>);

      dataParams = {
        ...payload,
        probeTimeout: `${payload?.probeTimeout}s`,
        probeConfig: JSON.stringify({ queryResponse: queryResponseList })
      }
    }


    let dnsConfig = {}
    if (payload?.probeType === "dns") {
      dnsConfig = {
        dnsType: payload?.dnsType,
        dnsProtocol: payload?.dnsProtocol,
        dnsServer: payload?.dnsServer,


      }
      dataParams = {
        ...payload,
        probeTimeout: `${payload?.probeTimeout}s`,
        probeConfig: JSON.stringify(dnsConfig)

      }

    }
    if (payload?.probeType !== "tcp" && payload?.probeType !== "http" && payload?.probeType !== "dns") {
      dataParams = {
        ...payload,
        probeTimeout: `${payload?.probeTimeout}s`,

      }

    }

    setLoading(true)
    if (mode === "ADD") {
      createNetworkProbe(dataParams).then((resp) => {
        if (resp?.success) {
          const payload = form.getFieldsValue();
          onSave(payload?.clusterName)
          message.success("创建成功！")

        }

      }).finally(() => {
        setLoading(false)
      })


    }
    if (mode === "EDIT") {
      updateNetworkProbe({ ...dataParams, id: curRecord?.id, status: curRecord?.status, graphUrl: curRecord?.graphUrl, }).then((resp) => {
        if (resp?.success) {
          const payload = form.getFieldsValue();
          onSave(payload?.clusterName)
          message.success("编辑成功！")

        }

      }).finally(() => {
        setLoading(false)
      })


    }

  }

  return (
    <>

      <Drawer
        title={mode === "ADD" ? "拨测新增" : "拨测编辑"}
        visible={mode !== 'HIDE'}
        width={"50%"}
        onClose={onClose}
        footer={<div className="drawer-footer">
          <Button type="primary" loading={loading} onClick={handleSubmit} >
            保存
      </Button>
          <Button type="default" onClick={onClose}>
            取消
      </Button>
        </div>}
        destroyOnClose

      >

        <Form labelCol={{ flex: '110px' }} form={form} preserve={false}>
          <Form.Item label="集群选择" name="clusterName" rules={[{ required: true, message: '请填写' }]}>
            <Select style={{ width: 320 }} options={clusterData} loading={clusterLoading} />
          </Form.Item>
          <Form.Item label="拨测类型" name="probeType" rules={[{ required: true, message: '请填写' }]}  >
            <Radio.Group options={dailTypeOptions} onChange={onChangeType} value={dailType} optionType="button" />
          </Form.Item>
          <Form.Item label="拨测名称" name="probeName" rules={[{ required: true, message: '请填写' }]}>
            <Input style={{ width: 320 }} />
          </Form.Item>

          <Form.Item label="拨测地址" name="probeUrl" rules={[{ required: true, message: '请填写' }]}>
            <Input style={{ width: 320 }} />
          </Form.Item>

          <Form.Item label="拨测频率" name="probeInterval" rules={[{ required: true, message: '请填写' }]}>
            <Radio.Group options={frequencyOptions} />
          </Form.Item>
          <Form.Item label="拨测超时(s)" name="probeTimeout" rules={[{ required: true, message: '请填写' }]}>
            <InputNumber style={{ width: 320 }} min={1} />
          </Form.Item>
          {dailType === "http" && (
            <>
          
              <Form.Item label="请求配置" name="probeConfig" initialValue={questConfigOptions[0]?.value} rules={[{ required: true, message: '请填写' }]}>
                <Segmented options={questConfigOptions} defaultValue={questConfigOptions[0]?.value} value={questConfigType} onChange={(value: any) => {
                  setQuestConfigType(value)
                  if (form.getFieldValue("headers")?.length > 0) {
                    setHeadersData(form.getFieldValue("headers"))
                  }
                  if (form.getFieldValue("username")) {
                    setUsername(form.getFieldValue("username"))
                  }
                  if (form.getFieldValue("password")) {
                    setPassword(form.getFieldValue("password"))
                  }
                  if (value === "headers") {
                    form.setFieldsValue({
                      headers: headersData
                    })

                  }
                  if (value === "basicAuth") {
                    form.setFieldsValue({
                      username,
                      password
                    })

                  }

                }} />
              </Form.Item>

              {questConfigType === "headers" && <Form.Item
                name="headers"
                style={{ marginLeft: 110 }}
                rules={[
                  {
                    validator: async (_, value: any) => {
                      if (!value?.length) {
                        throw new Error('关联信息至少填写一组');
                      }
                      if (value.find((n: any) => !(n.httpKey && n.httpValue))) {
                        throw new Error('Key 和 Value不能为空!');
                      }
                      // 去重校验
                      const httpKey = value.map((n: any) => n.httpKey);
                      if (httpKey.length > [...new Set(httpKey)].length) {
                        throw new Error('请勿重复Key!');
                      }
                    },
                    validateTrigger: [],
                  },
                ]}>
                <EditorTable
                  columns={[
                    {
                      dataIndex: 'httpKey',
                      title: 'Key',
                      fieldType: 'input',

                      colProps: { width: 200 },
                    },
                    { dataIndex: 'httpValue', title: 'Value', fieldType: 'input', colProps: { width: 200 }, },
                  ]}
                //limit={10}
                />
              </Form.Item>}

              {questConfigType === "basicAuth" &&
                <>
                  <Form.Item label="账号" name="username" rules={[{ required: true, message: '请填写' }]}>
                    <Input style={{ width: 320 }} />
                  </Form.Item>
                  <Form.Item label="密码" name="password" rules={[{ required: true, message: '请填写' }]}>
                    <Input.Password style={{ width: 320 }} />
                  </Form.Item>
                </>
              }
            </>
          )}
          {dailType === "dns" && (
            <Form.Item label="类型" name="dnsType" rules={[{ required: true, message: '请填写' }]}>
              <Radio.Group options={dnsTypeOptions} />
            </Form.Item>
          )}
          {dailType === "dns" && (
            <Form.Item label="DNS 访问协议" name="dnsProtocol" rules={[{ required: true, message: '请填写' }]}>
              <Radio.Group options={visitAgreementOption} />
            </Form.Item>
          )}
          {dailType === "dns" && (
            <Form.Item label="DNS 服务器" name="dnsServer" rules={[{ required: true, message: '请填写' }]}>
              <Input style={{ width: 320 }} />
            </Form.Item>
          )}
          {dailType === "tcp" && (
            <>
              <Form.Item rules={[{ required: true, message: '请填写' }]} name="probeConfig" label="请求配置" initialValue={tcpQuestConfig[0]?.value}> <Radio.Group options={tcpQuestConfig} optionType="button" defaultValue={tcpQuestConfig[0]?.value} /></Form.Item>
              <Form.Item name="queryResponse" style={{ marginLeft: 110 }} rules={[
                {
                  validator: async (_, value: any) => {
                    if (!value?.length) {
                      throw new Error('关联信息至少填写一组');
                    }
                    if (value.find((n: any) => !(n.expect && n.send))) {
                      throw new Error('Key 和 Value不能为空!');
                    }
                    // 去重校验
                    const expect = value.map((n: any) => n.expect);
                    if (expect.length > [...new Set(expect)].length) {
                      throw new Error('请勿重复Key!');
                    }
                  },
                  validateTrigger: [],
                },
              ]}>
                <EditorTable
                  columns={[
                    {
                      dataIndex: 'expect',
                      title: 'Key',
                      fieldType: 'input',

                      colProps: { width: 200 },
                    },
                    { dataIndex: 'send', title: 'Value', fieldType: 'input', colProps: { width: 200 }, },
                  ]}
                  limit={10}
                />
              </Form.Item>

            </>

          )}




        </Form>





      </Drawer>
    </>
  );
}


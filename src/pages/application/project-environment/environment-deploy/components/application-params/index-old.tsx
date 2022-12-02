
// 上下布局页面 应用模版
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React, { useContext, useRef } from 'react';
import { Button, Row, Col, Form, Select, Space, message, Spin, Modal, Radio} from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, putRequest } from '@/utils/request';
import { useLocation} from 'umi';
import { useState, useEffect } from 'react';
import AceEditor from '@/components/ace-editor';
import { parse } from 'query-string';
import DetailContext from '../../context';
import EditorTable from '@cffe/pc-editor-table';
import * as APIS from '@/pages/application/service';
import './index.less';
import moment from 'moment';

export default function ApplicationParams(props: any) {
  const { appData } = useContext(DetailContext);
  const [applicationForm] = Form.useForm();
  const [restarForm] = Form.useForm();
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [selectEnvData, setSelectEnvData] = useState<string>(''); //下拉选择应用环境
  const [selectTmpl, setSelectTmpl] = useState<string>(''); //下拉选择应用模版
  const [applicationlist, setApplicationlist] = useState<any>([]); //获取到的结果
  const [inintDatas, setInintDatas] = useState<any>([]); //初始化的数据
  const [id, setId] = useState<string>();
  const [isDeployment, setIsDeployment] = useState<string>();
  const [ensureDisable, setEnsureDisable] = useState<boolean>(false);
  const [infoLoading, setInfoloading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [value, setValue] = useState<number>(1);
  const [limit, setLimit] = useState<number>(0);
  // 进入页面显示结果
  const { appCode, appCategoryCode } = appData || {};
  let location:any = useLocation();
  const query :any= parse(location.search);
  const { templateType, envCode,benchmarkEnvCode } = query || {};
  let firstEnvChoose = useRef<string>('');
  let firstTmplType = useRef<string>('');
  useEffect(() => {
    selectAppEnv().then((result) => {
      let dataArry: any = [];
      if (result.success) {
        result.data?.map((n: any) => {
          if (n.proEnvType === 'benchmark' && n.envName.search('前端') === -1&&n?.envCode===benchmarkEnvCode) {
            dataArry.push({
              value: n?.envCode,
              label: n?.envName,
              data: n,
            });
          }
        });
      }
      setEnvDatas(dataArry);
      setSelectEnvData(dataArry[0]?.value);
      firstEnvChoose.current = dataArry[0]?.value;
      getRequest(APIS.tmplType).then((result) => {
        const listTmplType = (result.data || []).map((n: any) => ({
          label: n,
          value: n,
          data: n,
        }));
        setTemplateTypes(listTmplType);

        let tmplType = '';
        listTmplType.forEach((element: any) => {
          if (element.value === 'deployment') {
            tmplType = element.value;
            applicationForm.setFieldsValue({
              appEnvCode: dataArry[0]?.value,
              tmplType: tmplType,
            });
            setSelectTmpl(element.value);
            firstTmplType.current = element.value;
          } else if (element.value === 'service') {
            tmplType = element.value;
            applicationForm.setFieldsValue({
              appEnvCode: dataArry[0]?.value,
              tmplType: tmplType,
            });
            setSelectTmpl(element.value);
            firstTmplType.current = element.value;
          }
        });
        getAppTempl(dataArry[0]?.value, appData?.appCode, tmplType, appCategoryCode);
      });
    });
  }, []);

  useEffect(() => {
    if (modalVisible) {
      restarForm.setFieldsValue({
        restartPolicy: 1,
      });
    }
  }, [modalVisible]);

  //通过appCategoryCode查询环境信息
  const selectAppEnv = () => {
    return getRequest(APIS.listAppEnv, {
      data: { appCode, proEnvType: 'benchmark', envModel: 'currency-deploy' },
    });
  };

  //查询当前模版信息  一进入页面加载
  const getAppTempl = (envCode: string, appCode: any, templateType: string, appCategoryCode?: string) => {
    setInfoloading(true);
    return getRequest(APIS.paramsList, {
      data: {
        envCode,
        appCode,
        templateType,
        appCategoryCode,
      },
    })
      .then((result) => {
        if (result.data.length > 0) {
          const appTmpl = result.data[0];
          setId(appTmpl.id);
          setInintDatas(appTmpl);
          showAppList(envCode, templateType);
          setIsDeployment(appTmpl.templateType);
        } else {
          message.info(`${envCode}环境的${templateType}类型模版为空`);
        }
      })
      .finally(() => {
        setInfoloading(false); //
      });
  };
  //重置时恢复初始化数据
  const inintData = () => {
    let arr1 = [];
    let jvm = '';
    if (inintDatas.length === 0) {
      applicationForm.setFieldsValue({
        appEnvCode: firstEnvChoose.current,
        tmplType: firstTmplType.current,
        value: '',
        tmplConfigurableItem: [],
        jvm: '',
      });
      setLimit(0);
    }
    for (const key in inintDatas.tmplConfigurableItem) {
      if (key === 'jvm') {
        jvm = inintDatas.tmplConfigurableItem[key];
      } else {
        arr1.push({
          key: key,
          value: inintDatas.tmplConfigurableItem[key],
        });
      }
      applicationForm.setFieldsValue({
        appEnvCode: inintDatas.envCode,
        tmplType: inintDatas.templateType,
        value: inintDatas.value,
        tmplConfigurableItem: arr1,
        jvm: jvm,
      });
      setLimit(arr1.length);
      setIsDeployment(inintDatas.templateType);
    }
  };

  const showAppList = (envCode: string, templateType: string) => {
    setInfoloading(true);
    getRequest(APIS.paramsList, {
      data: {
        appCode,
        templateType: templateType,
        envCode: envCode,
      },
    })
      .then((result) => {
        if (result.data.length > 0) {
          const applicationlist = result.data[0];
          setApplicationlist(applicationlist);
          let arr1 = [];
          let jvm = '';
          for (const key in applicationlist.tmplConfigurableItem) {
            if (key === 'jvm') {
              jvm = applicationlist.tmplConfigurableItem[key];
            } else {
              arr1.push({
                key: key,
                value: applicationlist.tmplConfigurableItem[key],
              });
            }
          }
          applicationForm.setFieldsValue({
            appEnvCode: applicationlist.envCode,
            tmplType: applicationlist.templateType,
            value: applicationlist.value,
            tmplConfigurableItem: arr1,
            jvm: jvm,
          });
          // changeEnvCode(applicationlist.envCode);
          // changeTmplType(applicationlist.templateType);
          setIsDeployment(applicationlist.templateType);
          setLimit(arr1.length);
        } else {
          message.info(`${envCode}的${templateType}类型模版为空`);
        }

        //处理添加进表格的数据
        let arr = [];
        for (const key in applicationlist.tmplConfigurableItem) {
          arr.push({
            key: key,
            value: applicationlist.tmplConfigurableItem[key],
          });
        }
      })
      .finally(() => {
        setInfoloading(false);
      });
  };

  //改变下拉选择后查询结果
  const changeEnvCode = (getEnvCode: string) => {
    setSelectEnvData(getEnvCode);
    setEnsureDisable(false);
    queryTmpl(getEnvCode, selectTmpl);
  };
  const changeTmplType = (getTmplType: string) => {
    setSelectTmpl(getTmplType);
    setIsDeployment(getTmplType);
    queryTmpl(selectEnvData || envCode, getTmplType);
    setEnsureDisable(false);
  };

  //点击查询回调
  const queryTmpl = async (envCodeCurrent: string, templateTypeCurrent: string) => {
    setInfoloading(true);
    // data里的参数是根据下拉选项来查询配置项和模版详情的
    await getRequest(APIS.paramsList, {
      // data: { envCode: selectEnvData || envCode, appCode, templateType: selectTmpl || {} },
      data: {
        envCode: envCodeCurrent || envCode,
        appCode,
        templateType: templateTypeCurrent || '',
      },
    })
      .then((result) => {
        const applicationlist = result.data[0];
        if (result.data.length !== 0) {
          let arr = [];
          let jvm = '';
          for (const key in applicationlist.tmplConfigurableItem) {
            if (key === 'jvm') {
              jvm = applicationlist.tmplConfigurableItem[key];
            } else {
              arr.push({
                key: key,
                value: applicationlist.tmplConfigurableItem[key],
              });
            }
          }
          setId(applicationlist?.id);
          setIsDeployment(applicationlist.templateType);
          applicationForm.setFieldsValue({
            // templateValue:list.templateValue,
            tmplConfigurableItem: arr,
            appEnvCode: applicationlist.envCode,
            tmplType: applicationlist.templateType,
            value: applicationlist.value,
            jvm: jvm,
          });
          setLimit(arr.length);
        } else {
          applicationForm.setFieldsValue({
            tmplConfigurableItem: [],
            jvm: '',
            value: '',
          });
          setEnsureDisable(true);
          setLimit(0);
          message.error(`${envCodeCurrent}环境的${templateTypeCurrent}类型模版不存在,请先推送模板！`);
        }
      })
      .finally(() => {
        setInfoloading(false);
      });
  };
  // 禁止选用今日之前的日期
  const disabledDate = (current: any) => {
    return current && current < moment().subtract(1, 'day');
  };

  function range(start: any, end: any) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  // 只能选择当前时间之后的时间点
  const disabledDateTime = (date: any) => {
    let hours = moment().hours();
    let minutes = moment().minutes();
    let seconds = moment().seconds();
    if (date && moment(date).date() === moment().date()) {
      return {
        disabledHours: () => range(0, 24).splice(0, hours),
        disabledMinutes: () => range(0, 60).splice(0, minutes + 1),
        disabledSeconds: () => range(0, 60).splice(0, seconds + 1),
      };
    }
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  };
  //编辑应用模版
  const setApplication = async () => {
    const params = await restarForm.validateFields();
    const values = applicationForm.getFieldsValue();
    const tmplConfigurableItem = values.tmplConfigurableItem?.reduce((prev: any, el: any) => {
      prev[el.key] = el.value;
      return prev;
    }, {} as any);
    const value = values.value;
    putRequest(APIS.editParams, {
      data: { id, value, jvm: values?.jvm, tmplConfigurableItem, restartPolicy: params?.restartPolicy },
    }).then((result) => {
      if (result.success) {
        message.success('提交成功！');
        setModalVisible(false);
        // window.location.reload();
        applicationForm.setFieldsValue({
          tmplConfigurableItem: [],
          jvm: '',
          value: '',
        });
        setTimeout(() => {
          showAppList(selectEnvData, selectTmpl);
        }, 200);
      }
    });
  };

  return (
    <ContentCard>
      <Form
        form={applicationForm}
        onFinish={() => {
          setModalVisible(true);
        }}
      >
        <Row>
          <div>
            <Form.Item label=" 应用环境：" name="appEnvCode">
              <Select showSearch style={{ width: 200 }} options={envDatas} onChange={changeEnvCode} />
            </Form.Item>
          </div>
          <div style={{ marginLeft: 16 }}>
            <Form.Item label=" 模版类型" name="tmplType">
              <Select showSearch style={{ width: 200 }} options={templateTypes} onChange={changeTmplType} />
            </Form.Item>
          </div>
          <div style={{ marginLeft: 6 }}>
            {/* <Button type="primary" onClick={queryTmpl}>
              查询
            </Button> */}
            <Button onClick={inintData}>
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
                {/* <TextArea rows={18} disabled /> */}
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
            <Button onClick={inintData}>
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
        onOk={setApplication}
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
              {/* <Radio value={3}>定时生效</Radio> */}
              <Radio value={1}>下次发布生效</Radio>
              <Radio value={2}>立即生效</Radio>
            </Radio.Group>
          </Form.Item>
          {/* {value === 3 && (
            <Form.Item
              label="生效时间："
              name="TakeEffectTime"
              style={{ width: '100%', marginTop: '15px' }}
              rules={[{ required: true, message: '这是必选项' }]}
            >
              <DatePicker showTime allowClear disabledDate={disabledDate}  disabledTime={disabledDateTime}/>
            </Form.Item>
          )} */}
        </Form>
      </Modal>
    </ContentCard>
  );
}



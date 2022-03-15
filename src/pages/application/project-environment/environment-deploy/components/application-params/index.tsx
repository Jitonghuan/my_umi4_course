// 上下布局页面 应用模版
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React, { useContext } from 'react';
import { Button, Row, Col, Form, Select, Space, message, Spin } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import AceEditor from '@/components/ace-editor';
import DetailContext from '../../context';
import EditorTable from '@cffe/pc-editor-table';
import * as APIS from '@/pages/application/service';
import './index.less';

export default function ApplicationParams() {
  const { appData, projectEnvCode } = useContext(DetailContext);
  const [applicationForm] = Form.useForm();
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [selectTmpl, setSelectTmpl] = useState<string>(''); //下拉选择应用模版
  const [applicationlist, setApplicationlist] = useState<any>([]); //获取到的结果
  const [inintDatas, setInintDatas] = useState<any>([]); //初始化的数据
  const [id, setId] = useState<string>();
  const [isDeployment, setIsDeployment] = useState<string>();
  const [ensureDisable, setEnsureDisable] = useState<boolean>(false);
  const [infoLoading, setInfoloading] = useState<boolean>(false);
  // 进入页面显示结果
  const { appCode, appCategoryCode } = appData || {};
  useEffect(() => {
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
          applicationForm.setFieldsValue({ tmplType: tmplType });
          setSelectTmpl(element.value);
        } else if (element.value === 'service') {
          tmplType = element.value;
          applicationForm.setFieldsValue({ tmplType: tmplType });
          setSelectTmpl(element.value);
        }
      });
      getAppTempl(appData?.appCode, tmplType, appCategoryCode);
    });
  }, []);

  //查询当前模版信息  一进入页面加载
  const getAppTempl = (appCode: any, templateType: string, appCategoryCode?: string) => {
    setInfoloading(true);
    return getRequest(APIS.paramsList, { data: { envCode: projectEnvCode, appCode, templateType, appCategoryCode } })
      .then((result) => {
        if (result.data.length > 0) {
          const appTmpl = result.data[0];
          setId(appTmpl.id);
          setInintDatas(appTmpl);
          setIsDeployment(appTmpl.templateType);
          showAppList(templateType);
        } else {
          message.info(`${projectEnvCode}环境的${templateType}类型模版为空`);
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
        tmplType: inintDatas.templateType,
        value: '',
        tmplConfigurableItem: [],
        jvm: '',
      });
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
        tmplType: inintDatas.templateType,
        value: inintDatas.value,
        tmplConfigurableItem: arr1,
        jvm: jvm,
      });
      setIsDeployment(inintDatas.templateType);
    }
  };

  const showAppList = (templateType: string) => {
    setInfoloading(true);
    getRequest(APIS.paramsList, { data: { appCode, templateType: templateType, envCode: projectEnvCode } })
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
            tmplType: applicationlist.templateType,
            value: applicationlist.value,
            tmplConfigurableItem: arr1,
            jvm: jvm,
          });
          setIsDeployment(applicationlist.templateType);
        } else {
          message.info(`${projectEnvCode}的${templateType}类型模版为空`);
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

  const changeTmplType = (getTmplType: string) => {
    setEnsureDisable(false);
    setSelectTmpl(getTmplType);
    setIsDeployment(getTmplType);
    queryTmpl(getTmplType);
  };

  //点击查询回调
  const queryTmpl = async (templateTypeCurrent: string) => {
    setInfoloading(true);
    // data里的参数是根据下拉选项来查询配置项和模版详情的
    await getRequest(APIS.paramsList, {
      // data: { envCode: selectEnvData || envCode, appCode, templateType: selectTmpl || {} },
      data: { envCode: projectEnvCode, appCode, templateType: templateTypeCurrent || '' },
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
        } else {
          applicationForm.setFieldsValue({
            tmplConfigurableItem: [],
            jvm: '',
            value: '',
          });
          setEnsureDisable(true);
          message.error(`${projectEnvCode}环境的${templateTypeCurrent}类型模版不存在,请先推送模板！`);
        }
      })
      .finally(() => {
        setInfoloading(false);
      });
  };
  //编辑应用模版
  const editApplication = (values: any) => {
    const tmplConfigurableItem = values.tmplConfigurableItem.reduce((prev: any, el: any) => {
      prev[el.key] = el.value;
      return prev;
    }, {} as any);
    const value = values.value;
    putRequest(APIS.editParams, { data: { id, value, jvm: values?.jvm, tmplConfigurableItem } }).then((result) => {
      if (result.success) {
        message.success('提交成功！');
        applicationForm.setFieldsValue({
          tmplConfigurableItem: [],
          jvm: '',
          value: '',
        });
        setTimeout(() => {
          showAppList(selectTmpl);
        }, 200);
      }
    });
  };

  return (
    <ContentCard>
      <Form form={applicationForm} onFinish={editApplication}>
        <Row>
          <div style={{ marginLeft: 12 }}>
            <Form.Item label=" 模版类型" name="tmplType">
              <Select showSearch style={{ width: 200 }} options={templateTypes} onChange={changeTmplType} />
            </Form.Item>
          </div>
          <div style={{ marginLeft: 6 }}>
            {/* <Button type="primary" onClick={queryTmpl}>
              查询
            </Button> */}
            <Button type="default" onClick={inintData}>
              重置
            </Button>
          </div>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col span={10}>
            <div style={{ fontSize: 15, color: '#696969' }}>模版详情：</div>
            <Spin spinning={infoLoading}>
              <Form.Item name="value">
                {/* <TextArea rows={18} disabled /> */}
                <AceEditor mode="yaml" height={600} />
              </Form.Item>
            </Spin>
          </Col>
          <Col span={10} offset={2}>
            <div style={{ fontSize: 15, color: '#696969' }}>可配置项：</div>
            <Spin spinning={infoLoading}>
              <Form.Item name="tmplConfigurableItem">
                <EditorTable
                  readOnly
                  columns={[
                    { title: 'Key', dataIndex: 'key', fieldType: 'readonly', colProps: { width: 240 } },
                    {
                      title: 'Value',
                      dataIndex: 'value',
                      colProps: { width: 280 },
                      fieldProps: { readOnly: false },
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
            <Button type="ghost" onClick={inintData}>
              重置
            </Button>
            <Button type="primary" htmlType="submit" disabled={ensureDisable}>
              提交
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </ContentCard>
  );
}
// 上下布局页面 应用模版
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React, { useContext } from 'react';
import { Button, Row, Col, Form, Select, Space, message } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import AceEditor from '@/components/ace-editor';
import DetailContext from '@/pages/application/application-detail/context';
import EditorTable from '@cffe/pc-editor-table';
import * as APIS from '@/pages/application/service';
import './index.less';

export default function ApplicationParams(props: any) {
  const { appData } = useContext(DetailContext);
  const [applicationForm] = Form.useForm();
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [selectEnvData, setSelectEnvData] = useState<string>(''); //下拉选择应用环境
  const [selectTmpl, setSelectTmpl] = useState<string>(''); //下拉选择应用模版
  const [applicationlist, setApplicationlist] = useState<any>([]); //获取到的结果
  const [inintDatas, setInintDatas] = useState<any>([]); //初始化的数据
  const [id, setId] = useState<string>();
  const [isDeployment, setIsDeployment] = useState<string>();
  // 进入页面显示结果
  const { appCode, appCategoryCode } = appData || {};
  const { templateType, envCode } = props?.history.location?.query || {};
  useEffect(() => {
    selectAppEnv().then((result) => {
      const listEnv = result.data?.map((n: any) => ({
        value: n?.envCode,
        label: n?.envName,
        data: n,
      }));
      setEnvDatas(listEnv);

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
          } else if (element.value === 'service') {
            tmplType = element.value;
          }
        });
        getAppTempl(listEnv[0]?.value, appData?.appCode, tmplType, appCategoryCode);
      });
    });
  }, []);
  // 查询应用环境数据
  const queryAppEnvData = (value: any) => {
    getRequest(APIS.listAppEnv, {
      data: {
        appCode,
        envTypeCode: value?.envTypeCode,
        envCode: value?.envCode,
        envName: value?.envName,
        categoryCode: value?.categoryCode,
      },
    }).then((result) => {
      if (result?.success) {
        // setAppEnvDataSource(result?.data);
      }
    });
  };

  //通过appCategoryCode查询环境信息
  const selectAppEnv = () => {
    return getRequest(APIS.listAppEnv, { data: { appCode } });
  };

  //查询当前模版信息  一进入页面加载
  const getAppTempl = (envCode: string, appCode: any, templateType: string, appCategoryCode?: string) => {
    return getRequest(APIS.paramsList, { data: { envCode, appCode, templateType, appCategoryCode } }).then((result) => {
      if (result.data.length > 0) {
        const appTmpl = result.data[0];
        setId(appTmpl.id);
        setInintDatas(appTmpl);
        showAppList(envCode, templateType);
        setIsDeployment(appTmpl.templateType);
      } else {
        message.error('应用模版为空');
      }
    });
  };

  //重置时恢复初始化数据
  const inintData = () => {
    let arr1 = [];
    let jvm = '';
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
      setIsDeployment(inintDatas.templateType);
    }
  };

  const showAppList = (envCode: string, templateType: string) => {
    getRequest(APIS.paramsList, { data: { appCode, templateType: templateType, envCode: envCode } }).then((result) => {
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

        changeEnvCode(applicationlist.envCode);
        changeTmplType(applicationlist.templateType);
        setIsDeployment(applicationlist.templateType);
      } else {
        message.error('应用模版为空');
      }

      //处理添加进表格的数据
      let arr = [];
      for (const key in applicationlist.tmplConfigurableItem) {
        arr.push({
          key: key,
          value: applicationlist.tmplConfigurableItem[key],
        });
      }
    });
  };

  //改变下拉选择后查询结果
  const changeEnvCode = (getEnvCode: string) => {
    setSelectEnvData(getEnvCode);
    // queryTmpl(getEnvCode,selectTmpl);
  };
  const changeTmplType = (getTmplType: string) => {
    setSelectTmpl(getTmplType);
    setIsDeployment(getTmplType);
    queryTmpl(selectEnvData || envCode, getTmplType);
  };
  //点击查询回调
  const queryTmpl = (envCodeCurrent: string, templateTypeCurrent: string) => {
    // data里的参数是根据下拉选项来查询配置项和模版详情的
    getRequest(APIS.paramsList, {
      // data: { envCode: selectEnvData || envCode, appCode, templateType: selectTmpl || {} },
      data: { envCode: envCodeCurrent || envCode, appCode, templateType: templateTypeCurrent || {} },
    }).then((result) => {
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
        message.error('应用模版不存在');
      }
    });
  };
  //编辑应用模版
  const setApplication = (values: any) => {
    const tmplConfigurableItem = values.tmplConfigurableItem.reduce((prev: any, el: any) => {
      prev[el.key] = el.value;
      return prev;
    }, {} as any);
    const value = values.value;
    putRequest(APIS.editParams, { data: { id, value, jvm: values?.jvm, tmplConfigurableItem } }).then((result) => {
      if (result.success) {
        message.success('提交成功！');
        // window.location.reload();
        showAppList(selectEnvData, selectTmpl);
      }
    });
  };

  return (
    <ContentCard>
      <Form form={applicationForm} onFinish={setApplication}>
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
            <Button type="dashed" onClick={inintData}>
              重置
            </Button>
          </div>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col span={10}>
            <div style={{ fontSize: 15, color: '#696969' }}>模版详情：</div>
            <Form.Item name="value">
              {/* <TextArea rows={18} disabled /> */}
              <AceEditor mode="yaml" height={600} />
            </Form.Item>
          </Col>
          <Col span={10} offset={2}>
            <div style={{ fontSize: 15, color: '#696969' }}>可配置项：</div>
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
            {isDeployment == 'deployment' && appData?.appDevelopLanguage === 'java' && <span>JVM参数:</span>}
            {isDeployment == 'deployment' && appData?.appDevelopLanguage === 'java' && (
              <Form.Item name="jvm">
                <AceEditor mode="yaml" height={300} />
              </Form.Item>
            )}
          </Col>
        </Row>
        <Form.Item>
          <Space size="small" style={{ float: 'right' }}>
            <Button type="ghost" onClick={inintData}>
              重置
            </Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </ContentCard>
  );
}

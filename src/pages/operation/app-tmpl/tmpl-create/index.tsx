// 上下布局页面 应用模版复制页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/31 17:00

import React from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, postRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import AceEditor from '@/components/ace-editor';
import EditorTable from '@cffe/pc-editor-table';
import { Input, Button, Form, Row, Col, Select, Space,message } from 'antd';
import {appDevelopLanguageOptions} from '../tmpl-list/schema'
import './index.less';

export default function DemoPageTb(props: any) {
  const { Option } = Select;
  const flag = props.history.location.query.type;
  const categoryCodes=props.history.location.state?.categoryCodes;
  const templateCode: string = props.history.location.query.templateCode;
  const languageCode = props.history.location.query.languageCode;
  const [createTmplForm] = Form.useForm();
  const [categoryData, setCategoryData] = useState<any>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [source, setSource] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
  const [isDeployment, setIsDeployment] = useState<string>();
  const [languageCurrent, setLanguageCurrent] = useState<string>('');
  const handleChange = (next: any[]) => {
    setSource(next);
  };

  useEffect(() => {
    selectTmplType();
    selectCategory();
    changeAppCategory();
   
    if (flag == 'copy'&&templateCode) {
      tmplDetialResult(templateCode);
      setIsdisabled(true);
    } else {
      setIsdisabled(false);
    }
    if(flag==="copy"&&languageCode){
      setLanguageCurrent(languageCode)
    }
    if(flag==="add"){
      createTmplForm.resetFields();

    }
  }, []);
  //进入页面加载信息
 
  const tmplDetialResult = (templateCode: string) => {
    getRequest(APIS.tmplList, { data: { templateCode } }).then((res: any) => {
      if (res.success) {
        const tmplresult = res.data.dataSource[0];
        let arr = [];
        let jvm = '';
        for (const key in tmplresult.tmplConfigurableItem) {
          if (key === 'jvm') {
            jvm = tmplresult.tmplConfigurableItem[key];
          } else {
            arr.push({
              key: key,
              value: tmplresult.tmplConfigurableItem[key],
            });
          }
        }

        // let envCode = tmplresult.envCode;
        // if (envCode == '') {
        //   envCode = [];
        // }
        let appCategoryCodeArry:any=[]
       if(categoryCodes.length>0){
        categoryCodes?.map((item:any)=>{
          appCategoryCodeArry.push(item?.appCategoryCode)
         })
       

       }
       let oldCategoryCodes=[...new Set(appCategoryCodeArry)]
      //  else{
      //   appCategoryCodeArry=tmplresult?.appCategoryCode
      //  }

        createTmplForm.setFieldsValue({
          ...tmplresult,
          envCodes:tmplresult.envCode==""?[]:tmplresult.envCode,
          tmplConfigurableItem: arr,
          jvm: jvm,
          appCategoryCode:oldCategoryCodes[0]?oldCategoryCodes:undefined      
        });
       
        setIsDeployment(tmplresult.templateType);
       
      }
    });
  };

  //加载模版类型下拉选择
  const selectTmplType = () => {
    getRequest(APIS.tmplType).then((result) => {
      const list = (result.data || []).map((n: any) => ({
        label: n,
        value: n,
        data: n,
      }));
      setTemplateTypes(list);
    });
  };

  const selectTemplType = (value: any) => {
    setIsDeployment(value);
  };
  //加载应用分类下拉选择
  const selectCategory = () => {
    getRequest(APIS.appTypeList).then((result) => {
      const list = (result.data.dataSource || []).map((n: any) => ({
        label: n.categoryName,
        value: n.categoryCode,
        data: n,
      }));
      setCategoryData(list);
    });
  };

  const selectLanguage = (values: any) => {
    setLanguageCurrent(values);
  };
  // 查询环境
  const changeAppCategory = () => {
    //调用接口 查询env
    setEnvDatas([]);
    getRequest(APIS.envList, { data: { pageSize: -1 } }).then((resp: any) => {
      if (resp.success) {
        const datas =
          resp?.data?.dataSource?.map((el: any) => {
            return {
              ...el,
              value: el?.envCode,
              label: el?.envName,
            };
          }) || [];
        setEnvDatas(datas);
      }
    });
  };
  //提交模版
  const createTmpl = (value: any) => {
    const tmplConfigurableItem = value?.tmplConfigurableItem?.reduce((prev: any, el: any) => {
      prev[el.key] = el?.value;
      return prev;
    }, {} as any);
    let appCategoryCode=value?.appCategoryCode||[];
    let length=appCategoryCode?.length;
    appCategoryCode?.map((item:string,index:number)=>{
   
        postRequest(APIS.create, {
          data: {
           ...value,
            appCategoryCode:item || '',
            envCodes: value.envCodes || [],
            tmplConfigurableItem: tmplConfigurableItem || {},
           
          },
        }).then((resp: any) => {
          if (resp.success &&length-1===index) {
            message.success("模版新增成功！")
            history.push({
              pathname: 'tmpl-list',
            });   
          }
        });
    }) 
  };

  //提交复制模版
  const copyCreateTmpl = (value: any) => {
    const tmplConfigurableItem = value?.tmplConfigurableItem?.reduce((prev: any, el: any) => {
      prev[el.key] = el?.value;
      return prev;
    }, {} as any);

    let valArr:any = [];
    if (Array.isArray(value.envCodes)) {
      valArr = value.envCodes;
    } else {
      valArr.push(value.envCodes);
    }
    let appCategoryCode=value?.appCategoryCode||[];
    let length=appCategoryCode?.length;
    appCategoryCode?.map((item:string,index:number)=>{
    
        postRequest(APIS.create, {
          data: {
            ...value,
            appCategoryCode: item || '',
            envCodes: valArr || [],
            tmplConfigurableItem: tmplConfigurableItem || {},
            
          },
        }).then((resp: any) => {
          if (resp.success &&length-1===index) {
            message.success("模版复制成功！")
            history.push({
              pathname: 'tmpl-list',
            });
          }
        });
    })
   
  };

  return (
    <PageContainer className="tmpl-create">
      <ContentCard>
        <Form form={createTmplForm} onFinish={flag==="add"?createTmpl:copyCreateTmpl}>
          <Row>
            <div>
              <Form.Item label="模版类型：" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
                <Select
                  showSearch
                  style={{ width: 150 }}
                  options={templateTypes}
                  disabled={isDisabled}
                  onChange={selectTemplType}
                />
              </Form.Item>
            </div>
            <div style={{ paddingLeft: 12 }}>
              <Form.Item label="模版语言：" name="languageCode" rules={[{ required: true, message: '这是必选项' }]}>
              <Select
                  showSearch
                  style={{ width: 150 }}
                  options={appDevelopLanguageOptions}
                  onChange={selectLanguage}
                  disabled={flag==="add"?false:true}
                />
              </Form.Item>
            </div>
            <div style={{ paddingLeft: 12 }}>
              <Form.Item label="模版名称：" name="templateName" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入" ></Input>
              </Form.Item>
            </div>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={10}>
              <div style={{ fontSize: 15, color: '#696969' }}>模版详情：</div>

              <Form.Item name="templateValue" rules={[{ required: true, message: '这是必填项' }]}>
                {/* <TextArea rows={18} disabled={isDisabled} /> */}
                <AceEditor mode="yaml" height={600} />
              </Form.Item>
            </Col>

            <Col span={10} offset={2}>
              <div style={{ fontSize: 15, color: '#696969' }}>可配置项：</div>
              <Form.Item name="tmplConfigurableItem">
                <EditorTable
                  value={source}
                  onChange={handleChange}
                  columns={[
                    { title: 'Key', dataIndex: 'key', colProps: { width: 240 } },
                    {
                      title: '缺省值',
                      dataIndex: 'value',
                      colProps: { width: 280 },
                    },
                  ]}
                
                />
              </Form.Item>
              {isDeployment === 'deployment' && languageCurrent === 'java' ? <span>JVM参数:</span> : ''}
              {isDeployment === 'deployment' && languageCurrent === 'java' ? (
                <Form.Item name="jvm">
                  <AceEditor mode="yaml" height={300} />
                </Form.Item>
              ) : (
                ''
              )}
              <Form.Item
                label="选择默认应用分类："
                labelCol={{ span: 8 }}
                name="appCategoryCode"
                style={{ marginTop: '50px' }}
               
              >
                <Select showSearch  mode="multiple" style={{ width: 220 }}  options={categoryData} />
              </Form.Item>
              <Form.Item label="选择默认环境：" labelCol={{ span: 8 }} name="envCodes">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: 220 }}
                  showSearch
                  placeholder="支持通过envCode搜索环境"
                  options={envDatas}
                 

                />
              </Form.Item>

              <div style={{ fontSize: 15, color: '#696969', marginTop: 20 }}>备注：</div>
              <Form.Item name="remark">
                <Input.TextArea placeholder="请输入" style={{ width: 660, height: 220 }}></Input.TextArea>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space size="small" style={{ float: 'right' }}>
              <Button
                type="ghost"
                htmlType="reset"
                danger
                onClick={() =>
                  history.push({
                    pathname: 'tmpl-list',
                  })
                }
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" >
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ContentCard>
    </PageContainer>
  );
}

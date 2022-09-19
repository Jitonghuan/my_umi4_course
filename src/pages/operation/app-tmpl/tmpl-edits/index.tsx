// 应用模版编辑页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, putRequest,postRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { TmplEdit } from '../tmpl-list/schema';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { Drawer, Input, Button, Form, Row, Col, Select, Space, message, Divider } from 'antd';

export interface TmplListProps {
  mode?: EditorMode;
  initData?: TmplEdit;
  onClose?: () => any;
  onSave?: () => any;
}

export default function TaskEditor(props: TmplListProps) {
  const [createTmplForm] = Form.useForm();
  const children: any = [];
  const { mode, initData, onClose, onSave } = props;
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [source, setSource] = useState<any[]>([]);
  const [isDeployment, setIsDeployment] = useState<string>();
  const categoryCodes=initData?.categoryCodes;
  let oldAppCategoryCodes:any=[];
  if(categoryCodes?.length>0){
    categoryCodes?.map((item:any)=>{
      oldAppCategoryCodes.push(item?.appCategoryCode)

    })
  }
  let oldCategoryCodes=[...new Set(oldAppCategoryCodes)]

  const handleChange = (next: any[]) => {
    setSource(next);
  };

  const clickChange = () => {};

  useEffect(() => {
    if (mode === 'HIDE') return;
    createTmplForm.resetFields();
    //进入页面加载信息
    const initValues :any= {
      ...initData,
      envCodes: initData?.envCode || [],
    };


    let arr = [];
    let jvm = '';

    for (const key in initValues.tmplConfigurableItem) {
      if (key === 'jvm') {
        jvm = initValues.tmplConfigurableItem[key];
      } else {
        arr.push({
          key: key,
          value: initValues.tmplConfigurableItem[key],
        });
      }
    }
    let envCodeArry:any=[];
    initValues.envCodes?.map((item:string|null)=>{
      if(item!==""){
        envCodeArry.push(item)
      }

    })
   
    createTmplForm.setFieldsValue({
      ...initValues,
      envCodes: initValues.envCodes==""?[]:envCodeArry,
      jvm: jvm,
      tmplConfigurableItem: arr,
      appCategoryCode:!categoryCodes[0]?.appCategoryCode?undefined:oldCategoryCodes
    });
    changeAppCategory();
    setIsDeployment(initValues.templateType);
    selectTmplType();
    selectCategory(initValues?.appCategoryCode);
  }, [mode]);

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
  //加载应用分类下拉选择
  const selectCategory = (appCategoryCode?:any) => {
    getRequest(APIS.appTypeList).then((result) => {
      const list = (result.data.dataSource || []).map((n: any) => ({
        label: n.categoryName,
        value: n.categoryCode,
        data: n,
        // disabled:false
      }));
      setCategoryData(list);
      // if(appCategoryCode?.length>0){
      //     let obj:any=new Set(appCategoryCode);
      //     let disabledArryData:any=[]
      //     for (const iterator of obj) {
      //       disabledArryData.push(iterator)
            
      //     }
      //      let arryData:any=[];
      //      let selectedArry:any=[]
         
      //      list?.filter((item:any,index:number,self:any)=>{
      //        if(disabledArryData?.indexOf(item?.value)!==-1){
      //         selectedArry.push({...item,disabled:true})
      //        }else{
      //         arryData.push(item)
      //        }
      //       })
      //     setCategoryData(arryData.concat(selectedArry))
      //   }else{
      //   setCategoryData(list);
      // }
      
    });
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
  //保存编辑模版

  const createTmpl = (value: any) => {
    let envCodesArry :any= [];
    if (Array.isArray(value?.envCodes)) {
      envCodesArry = value?.envCodes;
    } else {
      envCodesArry = [value?.envCodes];
    }
    const tmplConfigurableItem = value?.tmplConfigurableItem?.reduce((prev: any, el: any) => {
      prev[el.key] = el?.value;
      return prev;
    }, {} as any);
    let appCategoryCodeArry=value?.appCategoryCode||[""];
    putRequest(APIS.update, {
      data: {
        ...value,
        oldCategoryCodes:oldCategoryCodes,
        newCategoryCodes: appCategoryCodeArry,
        envCodes: envCodesArry,
        tmplConfigurableItem: tmplConfigurableItem || {},
        templateCode:initData?. templateCode,
       
      },
    }).then((resp: any) => {
      if (resp.success) {
        message.success('保存成功！');
        onSave?.();
      } 
    });
    
     
  };

  const changeTmplType = (value: any) => {
    setIsDeployment(value);
  };
  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑模版' : '查看模版'}
      maskClosable={false}
      onClose={onClose}
      width={'70%'}
    >
      <ContentCard className="tmpl-edits">
        <Form form={createTmplForm} onFinish={createTmpl}>
          <Row>
            <div>
              <Form.Item label="模版类型：" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
                <Select
                  showSearch
                  style={{ width: 150 }}
                  options={templateTypes}
                  onChange={changeTmplType}
                  disabled={true}
                />
              </Form.Item>
            </div>

            <div style={{ marginLeft: 10 }}>
              <Form.Item label="模版语言：" name="languageCode" rules={[{ required: true, message: '这是必选项' }]}>
                <Select showSearch style={{ width: 150 }} disabled={true} />
              </Form.Item>
            </div>
            <div style={{ marginLeft: 10 }}>
              <Form.Item label="模版名称：" name="templateName" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入" disabled={true}></Input>
              </Form.Item>
            </div>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={12}>
              <div style={{ fontSize: 15, color: '#696969' }}>模版详情：</div>

              <Form.Item name="templateValue" rules={[{ required: true, message: '这是必填项' }]}>
                <AceEditor mode="yaml" height={700} />
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
              {isDeployment == 'deployment' && initData?.languageCode === 'java' ? <span>JVM参数:</span> : null}
              {isDeployment == 'deployment' && initData?.languageCode === 'java' ? (
                <Form.Item name="jvm">
                  <AceEditor mode="yaml" height={300} readOnly={mode==="VIEW"} />
                </Form.Item>
              ) : null}
              <Form.Item
                label="选择默认应用分类："
                labelCol={{ span: 8 }}
                name="appCategoryCode"
                style={{ marginTop: '30px' }}
              >
                <Select
                  showSearch
                  mode="multiple"
                  className="multiple-select-appCategoryCode"
                  style={{ width: 220 }}
                  options={categoryData}
                  disabled={mode==="VIEW"}
                  // onSelect={(value:any,option: any)=>{
                  //  const sourceArry= categoryData?.filter((item,index:number,self)=>item?.value!==value
                  //   )
                  //  setCategoryData(sourceArry.concat([{...option,disabled:true}]))
                  // }}
                  
                />
              </Form.Item>

              <Form.Item label="选择默认环境：" labelCol={{ span: 8 }} name="envCodes" style={{ marginTop: '20px' }}>
                <Select
                  allowClear
                  mode="multiple"
                  showSearch
                  style={{ width: 220 }}
                  placeholder="支持通过envCode搜索环境"
                  onChange={clickChange}
                  options={envDatas}
                  
                >
                  {children}
                </Select>
              </Form.Item>

              <div style={{ fontSize: 15, color: '#696969', marginTop: 20 }}>备注：</div>
              <Form.Item name="remark">
                <Input.TextArea placeholder="请输入" style={{ width: 520, height: 220 }}></Input.TextArea>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space size="small" style={{ float: 'right' }}>
              <Button type="ghost" htmlType="reset" danger onClick={onClose}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" disabled={mode==="VIEW"}>
                保存编辑
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ContentCard>
    </Drawer>
  );
}




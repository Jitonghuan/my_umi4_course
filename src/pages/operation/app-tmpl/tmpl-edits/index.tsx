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
  const broSource=initData?.broSource
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

    let envCodeCurrent: any = [];
    if (initData?.envCode.indexOf('') === 0) {
      envCodeCurrent = [];
    } else if (initData?.envCode.indexOf('') === -1) {
      envCodeCurrent = initValues.envCodes;
    }

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
    let appCategoryCodeArry:any=[];
    if(initValues?.appCategoryCode.length>0){
      let obj:any=new Set(initValues?.appCategoryCode)
      for (const iterator of obj) {
        appCategoryCodeArry.push(iterator);
       
      }
    }
    
    createTmplForm.setFieldsValue({
      ...initValues,
      envCodes: envCodeCurrent,
      jvm: jvm,
      tmplConfigurableItem: arr,
      appCategoryCode:initValues?.appCategoryCode[0]===""?undefined:appCategoryCodeArry
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
        disabled:false
      }));
     
      if(appCategoryCode?.length>0){
          let obj:any=new Set(appCategoryCode);
          let disabledArryData:any=[]
          for (const iterator of obj) {
            disabledArryData.push(iterator)
            
          }
           let arryData:any=[];
           let selectedArry:any=[]
         
           list?.filter((item:any,index:number,self:any)=>{
             if(disabledArryData.indexOf(item?.value)!==-1){
              selectedArry.push({...item,disabled:true})
             }else{
              arryData.push(item)
             }
            })
          setCategoryData(arryData.concat(selectedArry))
        }else{
        setCategoryData(list);
      }
      
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
    let appCategoryCode=value?.appCategoryCode||[];
    let length=appCategoryCode?.length;
    let initLength=initData?.appCategoryCode?.length
 
      let creatCodeArry:any=[];
      let updateCodeArry:any=[];
      appCategoryCode?.map((item:any)=>{
        if(broSource?.appCategoryCode.indexOf(item)===-1){
          creatCodeArry.push(item)

        }else{
          updateCodeArry.push(item);
        }
      })
      broSource?.map((item:any,index:number)=>{
          putRequest(APIS.update, {
            data: {
              ...value,
              appCategoryCode: item?.appCategoryCode|| '',
              envCodes: envCodesArry,
              tmplConfigurableItem: tmplConfigurableItem || {},
              templateCode: item?.templateCode,
             
            },
          }).then((resp: any) => {
            if (resp.success&&initLength-1===index) {
              message.success('保存成功！');
              onSave?.();
            } 
          });
      })
      creatCodeArry?.map((item:any,index:number)=>{
          postRequest(APIS.create, {
            data: {
             ...value,
              appCategoryCode: item|| '',
              envCodes: envCodesArry,
              tmplConfigurableItem: tmplConfigurableItem || {},
              
            },
          }).then((resp: any) => {
            if (resp.success&&length-1===index) {
              message.success('保存成功！');
              onSave?.();
            } 
          });
        
      })
  };

  const changeTmplType = (value: any) => {
    setIsDeployment(value);
  };
  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑模版' : ''}
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
                <Input style={{ width: 220 }} placeholder="请输入" ></Input>
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
                  <AceEditor mode="yaml" height={300} readOnly={mode==="VIEW"?true:false} />
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
                  onSelect={(value:any,option: any)=>{
                   const sourceArry= categoryData?.filter((item,index:number,self)=>item?.value!==value
                    )
                   setCategoryData(sourceArry.concat([{...option,disabled:true}]))
                  }}
                  onChange={(values)=>{
                    console.log('---->',values)
                  }}
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




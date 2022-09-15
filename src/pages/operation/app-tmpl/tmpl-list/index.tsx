// 上下布局页面 应用模版页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useCallback, useEffect,useMemo } from 'react';
import { Form, Input, Select, Button, Table,message} from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import {useDeleteTmpl} from "./hook"
import { getRequest} from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import * as APIS from '../service';
import TmplEditDraw from '../tmpl-edits';
import {createTableColumns,appDevelopLanguageOptions,TmplEdit} from './schema';

export default function Launch() {
  const { Option } = Select;
  const [formTmpl] = Form.useForm();
  const [delLoading, deleteTmpl]=useDeleteTmpl()
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pageTotal, setPageTotal] = useState<number>();
  const [tmplEditMode, setTmplEditMode] = useState<EditorMode>('HIDE');
  const [tmplateData, setTmplateData] = useState<TmplEdit>();
  const handleEditTask = useCallback(
    (record: TmplEdit, index: number,optType?:any) => {
      setTmplateData(record);
      setTmplEditMode(optType);
    },
    [dataSource],
  );
  const columns = useMemo(() => {
    return createTableColumns({
      onCopy: (record, index) => {
        history.push({
          pathname: 'tmpl-create',
          query: {
            type: 'copy',
            templateCode: record.templateCode,
            languageCode: record?.languageCode,
           
          },
          state:{
            categoryCodes:record?.categoryCodes
          }
        })
      },
      onEdit: (record, index) => {
        handleEditTask(record, index,"EDIT")
      },
      onView: (record, index) => {
        handleEditTask(record, index,"VIEW")
      },
      onPush: (record, index) => {
                  history.push({
                      pathname: 'push',
                      query: {
                          templateCode: record?.templateCode,
                          languageCode: record?.languageCode,
                        },
                      state:record
                  });
      },
      onDelete: (record:any, index:number,length:number) => {
        
        handleDelItem(record,index,length)
      },
    }) as any;
  }, []);

  //查询编辑参数
  useEffect(() => {
    loadListData({ pageIndex: 1, pageSize: 20 });
    selectCategory();
    selectTmplType();
  }, []);

  // 加载应用分类下拉选择
  const selectCategory = () => {
    getRequest(APIS.appTypeList, { data: { pageSize: -1 } }).then((result) => {
      const list = (result.data.dataSource || [])?.map((n: any) => ({
        label: n.categoryName,
        value: n.categoryCode,
        data: n,
      }));
      setCategoryData(list);
    });
  };

  //加载模版类型下拉选择
  const selectTmplType = () => {
    getRequest(APIS.tmplType).then((result) => {
      const list = (result.data || [])?.map((n: any) => ({
        label: n,
        value: n,
        data: n,
      }));
      setTemplateTypes(list);
    });
  };

  // 根据应用分类查询环境
  const changeAppCategory = (categoryCode: string) => {
    //调用接口 查询env 参数就是appCategoryCode
    //setEnvDatas
    setEnvDatas([]);
    getRequest(APIS.envList, { data: { categoryCode, pageSize: -1 } }).then((resp: any) => {
      if (resp.success) {
        let dataArry: any = [];
        resp.data?.dataSource?.map((n: any) => {
          if (n.envName.search('前端') === -1) {
            dataArry.push({
              value: n?.envCode,
              label: n?.envName,
              data: n,
            });
          }
        });
        setEnvDatas(dataArry);
      }
    });
  };

  //触发分页

  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    loadListData(obj);
    setPageIndex(pagination.current);
  };

  const loadListData = (params: any) => {
    const values = formTmpl.getFieldsValue();

    queryList({
      ...values,
      ...params,
    });
  };

  // 查询数据
  const queryList = (value: any) => {
    setLoading(true);
    getRequest(APIS.tmplList, {
      data: {
        appCategoryCode: value.appCategoryCode,
        envCode: value.envCode,
        templateType: value.templateType,
        templateName: value.templateName,
        languageCode: value.languageCode,
        pageIndex: value.pageIndex,
        pageSize: value.pageSize,
      },
    })
      .then((res: any) => {
        if (res.success) {
          const dataSource = res.data.dataSource;
          let pageTotal = res.data.pageInfo.total;
          let pageIndex = res.data.pageInfo.pageIndex;
          // let resultMap:any={};
          // let filterResultSource:any=[];
          // let resultArry:any=[];
          // let source:any=[];
          // dataSource?.map((item:any)=>{
          //   if(resultMap[item?.templateName]){
          //     resultMap[item?.templateName].push(item);
          //   }else{
          //     resultMap[item?.templateName]=[item]
          //   }
          // }); 
          // for (const key in resultMap) {
          //   if (Object.prototype.hasOwnProperty.call(resultMap, key)) {
          //     const element = resultMap[key]?.sort();
          //     let appCategoryCodeArry:any=[];
          //     if(element.length>1 ){
          //       element?.map((item:any)=>{
          //         appCategoryCodeArry.push(item?.appCategoryCode)
          //       })
          //     }
          //     if(element.length===1){
          //       filterResultSource.push({
          //         ...element[0],
          //         appCategoryCode:[element[0]?.appCategoryCode],
          //         broSource:[]
          //       })
          //     }
          //     if(element.length>1 ){
          //       resultArry.push({
          //         ...element[0],
          //         appCategoryCode:appCategoryCodeArry,
          //         broSource:[...element]
          //       })
          //     }   
          //   }
          // }
          // source=filterResultSource.concat(resultArry);
          setPageTotal(pageTotal);
          setDataSource(dataSource);
          setPageIndex(pageIndex);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //删除数据
  const handleDelItem = (record: any,index:number,length:number) => {
    deleteTmpl({id:record?.id,index,length}).then(()=>{
      if(index===length-1){
        loadListData({
          pageIndex: 1,
          pageSize: 20,
        });
        console.info('----------')

      }
     
     
    })
  };
  //抽屉保存
  const saveEditData = () => {
    setTmplEditMode('HIDE');
    loadListData({ pageIndex: 1, pageSize: 20 });
   
  };
  return (
    <PageContainer>
      <TmplEditDraw
        mode={tmplEditMode}
        initData={tmplateData}
        onClose={() => setTmplEditMode('HIDE')}
        onSave={saveEditData}
      />
      <FilterCard>
        <Form
          layout="inline"
          form={formTmpl}
          onFinish={(values: any) => {
            queryList({
              ...values,
              pageIndex: 1,
              pageSize: 20,
            });
          }}
          onReset={() => {
            formTmpl.resetFields();
            queryList({
              pageIndex: 1,
              // pageSize: pageSize,
            });
          }}
        >
          <Form.Item label="应用分类：" name="appCategoryCode">
            <Select showSearch style={{ width: 110 }} options={categoryData} onChange={changeAppCategory} />
          </Form.Item>
          <Form.Item label="环境：" name="envCode">
            <Select
              options={envDatas}
              allowClear
              showSearch
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label="模版类型：" name="templateType">
            <Select
              showSearch
              allowClear
              style={{ width: 120 }}
              options={templateTypes}
            />
          </Form.Item>
          <Form.Item label="模版语言：" name="languageCode">
            <Select showSearch allowClear style={{ width: 100 }} options={appDevelopLanguageOptions} />
          </Form.Item>
          <Form.Item label=" 模版名称：" name="templateName">
            <Input placeholder="请输入模版名称"></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset">
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>模版列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() =>
                history.push({
                  pathname: 'tmpl-create',
                  query: {
                    type: 'add',
                  },
                })
              }
            >
              + 新增模版
            </Button>
          </div>
        </div>
        <div>
          <Table
            rowKey="id"
            dataSource={dataSource}
            columns={columns}
            bordered
            loading={loading}
            pagination={{
              total: pageTotal,
              pageSize,
              current: pageIndex,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setPageIndex(1);
              },
              showTotal: () => `总共 ${pageTotal} 条数据`,
            }}
            onChange={pageSizeClick}        
          />
           
        </div>
      </ContentCard>
    </PageContainer>
  );
}

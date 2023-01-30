import React, { useState, useEffect, useMemo } from 'react';
import { Input, Table, Form, Button, Space,Select } from 'antd';
import TableSearch from '@/components/table-search';
import { history,useLocation } from 'umi';
import PageContainer from '@/components/page-container';
import CreateTmpl from './create-tmpl';
import {appDevelopLanguageOptions,envTypeData} from './types'
import useTable from '@/utils/useTable';
import { parse,stringify } from 'query-string';
import {getCicdTemplateList} from './service'
import {useQueryCategory,useDeleteCicdTemplate} from './hook'
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import {tableSchema} from './schema';
export default function PipeLineTmpl(){
  let location:any = useLocation();
  const query :any= parse(location.search);
  const tmplDetailData:any =  location.state?.record||{};
    const [form] = Form.useForm();
    const [mode,setMode]=useState<EditorMode>("HIDE")
    const [categoryData] = useQueryCategory();
    const [curRecord,setCurRecord]=useState<any>({})
    const [deleteCicdTemplate]=useDeleteCicdTemplate();
    // 表格列配置
  const tableColumns = useMemo(() => {
    return tableSchema({
      onEditClick: (record, index) => {
        setCurRecord(record)
        setMode("EDIT")
      },
      onViewClick: (record, index) => {
        setCurRecord(record)
        setMode("VIEW")
      },
      onDelClick: async (record, index) => {
        deleteCicdTemplate(record?.id).then(()=>{
          submit()
        })
        
      },
      onPushTmpl: (record, index) => {
          const values=form.getFieldsValue()
          let query={...values, templateCode: record?.templateCode,
            languageCode: record?.languageCode,}
         
        history.push({
            pathname:"/matrix/operation/push-tmpl",
            search:stringify(query)

        },{
            record
        })
      },
      onCopy:(record, index)=>{
        setCurRecord(record)
        setMode("COPY")
      }
    
    }) as any;
  }, []);
  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: getCicdTemplateList,
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
      };
    },
    formatResult: (result) => {
        let data=[]
      return {
        total: result.data?.total,
        list: result.data?.items || [],
      };
    },
  });

    return(
        <PageContainer>
            <CreateTmpl mode={mode} onClose={()=>{setMode("HIDE")}} onSave={()=>{
              setMode("HIDE");
              submit()

            }} categoryData={categoryData} curRecord={curRecord}/>
            <TableSearch
        form={form}
        bordered
        formOptions={[
          {
            key: '1',
            type: 'select',
            label: '应用类型',
            dataIndex: 'appType',
            width: '180px',
            option: [],
          },
          {
            key: '2',
            type: 'select',
            label: '应用分类',
            dataIndex: 'appCategoryCode',
            width: '200px',
            renderLabel:true,
            option: categoryData,
          },
          {
            key: '3',
            type: 'select',
            label: '应用语言',
            dataIndex: 'appLanguage',
            width: '120px',
            renderLabel:true,
            option:appDevelopLanguageOptions,
          },
         
          {
            key: '5',
            type: 'select',
            label: '模版类型',
            dataIndex: 'templateType',
            width: '120px',
            renderLabel:true,
            option: [{
                label:"CICD",
                value:'cicd',
                key:'cicd'
            }],
          },

          {
            key: '6',
            type: 'select',
            label: '构建类型',
            dataIndex: 'buildType',
            width: '120px',
            option: [],
          }, {
            key: '7',
            type: 'input',
            label: '模板名称',
            dataIndex: 'templateName',
            width: '220px',
          },
        ]}
        formLayout="inline"
        columns={tableColumns}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          // size: 'small',
          defaultPageSize: 20,
        }}
        extraNode={
         
        <div style={{ display: 'flex', justifyContent: 'space-between',width:'100%' }}>
        <div className="left-caption">
                       <h3> 模版列表</h3>

                    </div>
                    <div className="right-caption">
                        <Button type="primary" onClick={()=>{setMode("ADD")}}>+ 新建模版</Button>

                    </div>

        </div>

              
         
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        scroll={{x: '100%'}}
        searchText="查询"
      />
            {/* <FilterCard>
                <Form layout="inline">
                    <Form.Item label="应用类型">
                        <Select style={{width:220}} />

                    </Form.Item>
                    <Form.Item label="应用分类">
                    <Select style={{width:220}} />
                    </Form.Item>
                    <Form.Item label="应用语言">
                    <Select style={{width:220}} />
                    </Form.Item>
                    <Form.Item label="环境大类">
                    <Select style={{width:220}} />
                    </Form.Item>
                    <Form.Item label="模版类型">
                    <Select style={{width:220}} />
                    </Form.Item>
                    <Form.Item label="构建类型">
                    <Select style={{width:220}} />
                    </Form.Item>
                    <Form.Item label="模板名称">
                     <Input style={{width:220}}/>
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">查询</Button>
                        
                    </Form.Item>
                    <Form.Item>
                    <Button htmlType="reset">重置</Button>
                    </Form.Item>


                </Form>

            </FilterCard>
            <ContentCard>
               
                <Table columns={tableColumns} dataSource={[]}/>

            </ContentCard> */}
        </PageContainer>
    )
}
import React, { useState, useMemo,useEffect } from 'react';
import {Form, Button, Table,Select,Input ,Space} from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { getRequest } from '@/utils/request';
import { createTableColumns,statusOptions,privWfTypeOptions} from './schema';
import {querySqlListApi} from '../service';
import {currentAuditsApi} from '../service'
import {useSearchUser} from '../common-hook'
import {history} from 'umi';
export default function AuthorityApply (){
    const [form] = Form.useForm();
    const [dataSource,setDataSource]=useState<any>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [tableLoading, setTableLoading] = useState<any>(false);
    const [loading, userNameOptions, searchUser] =useSearchUser()
    useEffect(()=>{
      searchUser()
    },[])
    useEffect(()=>{
        queryList()
    },[])
   
    const queryList = (obj?:{pageIndex?:number,pageSize?:number,currentStatus?:string,wfUserType?:string,userName?:string,title?:string}) => {
        setTableLoading(true)
        getRequest(querySqlListApi, {
          data: {...obj, pageIndex:obj?.pageIndex|| 1, pageSize:obj?.pageSize|| 20, },
        })
          .then((result) => {
            if (result?.success) {
              let data = result?.data?.dataSource;
              let list=result.data?.dataSource || []
              setDataSource(data)
              // if(list?.length>0){
              //   list?.map((item:any)=>{
              //     getRequest(currentAuditsApi,{data:{id:item?.id}}).then((res)=>{
              //       if(res?.success){
              //         let data=res?.data?.audits;
              //         setDataSource([...new Set([...list,Object.assign(item, {
              //           audit: data,
              //         })])])
              //       }
              //     })
              //   })}else{
              //     setDataSource([])
              //   }
              let pageInfo=result?.data?.pageInfo
              setTotal(pageInfo?.total);
              setPageSize(pageInfo?.pageSize);
            }else{
              setDataSource([])
            }
          })
          .finally(() => {
            setTableLoading(false)
          });
      };
     //触发分页
  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    setPageSize(pagination.pageSize);

    loadListData(obj);
  };

  const loadListData = (params: any) => {
    let value = form.getFieldsValue();
    queryList({ ...params, ...value,});
  };
    
      const columns = useMemo(() => {
          
        return createTableColumns({
            dataSource:dataSource,
          onDetail: (record, index) => {
            if(record?.sqlWfType==="ddl"){
              history.push({
                pathname:"/matrix/DBMS/ddl-detail"
              },{
                record
              })

            }else{
              history.push({
                pathname:"/matrix/DBMS/approval-end",
                
              
              },{
                record
              })
            

            }
             
           
          },
         
        }) as any;
      }, [dataSource]);
    return(<PageContainer>
      <FilterCard>
        <Form
          layout="inline"
          form={form}
          onFinish={(values: any) => {
            queryList({...values})
          }}
          onReset={() => {
            form.resetFields();
            queryList()
          }}
        >
       
       <Form.Item label="工单状态" name="currentStatus">
            <Select
              placeholder="请输入"
              showSearch
              allowClear
              style={{ width: 160 }}
              options={statusOptions}
             
            />
          </Form.Item>
          <Form.Item label="工单类别" name="wfUserType">
          <Select
              placeholder="请输入"
              showSearch
              allowClear
              style={{ width: 160 }}
              options={privWfTypeOptions}
             
            />
          </Form.Item>
          <Form.Item label="申请人" name="userName">
          <Select
              placeholder="请输入"
              showSearch
              allowClear
              style={{ width: 150 }}
              options={userNameOptions}
              loading={loading}
             
            />
          </Form.Item>
          <Form.Item label="标题" name="title">
          <Input
              placeholder="请输入"  
              style={{ width: 180 }}
            />
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
            <h3>数据变更列表</h3>
          </div>
          <div className="caption-right">
            <Space>
              <Button type="primary" onClick={()=>{
                history.push({
                  pathname:"./struct-apply"
                })

              }}>
                结构变更
              </Button>

            <Button type="primary" onClick={()=>{
               history.push({
                pathname:"./change-apply"
              })
            }}>数据变更</Button>
         

            </Space>
          
          
          </div>
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={dataSource?.length<1?tableLoading:false}
            bordered
            scroll={{ x: '100%' }}
            pagination={{
              // current: taskTablePageInfo.pageIndex,
              total: total,
              pageSize: pageSize,
              showSizeChanger: true,
              showTotal: () => `总共 ${total} 条数据`,
            }}
            onChange={pageSizeClick}
          ></Table>
        </div>
      </ContentCard>
      
    </PageContainer>)
}
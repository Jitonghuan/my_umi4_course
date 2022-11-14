import React, { useState, useMemo,useEffect } from 'react';
import {Form, Button, Space,Table,Select,Input } from 'antd';
import { getRequest } from '@/utils/request';
import { history} from 'umi';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { createTableColumns,createFormItems,currentStatusOptions ,privWfTypeOptions,currentApplyStatusOptions} from './schema';
import TicketDetail from '../../components/ticket-detail';
import ApplyDetailDrawer from '../apply-detail'
import {queryWorkflowPrivListApi,currentAuditsApi} from '../../../service'
import {useLocation} from 'umi';
import { parse } from 'query-string';
import {useSearchUser} from '../../../common-hook';
import './index.less'
export default function AuthorityApply (){
const [form] = Form.useForm();
let location = useLocation();
const query = parse(location.search);
const initInfo: any = location.state || {};
const [mode,setMode]=useState<EditorMode>("HIDE");
const [tableLoading, setTableLoading] = useState<any>(false);
const [curRecord,setCurRecord]=useState<any>({});
const [loading, userNameOptions, searchUser] =useSearchUser()
const [applyDetailMode,setApplyDetailMode]=useState<EditorMode>("HIDE");
const [dataSource,setDataSource]=useState<any>([]);
const [total, setTotal] = useState<number>(0);
const [pageSize, setPageSize] = useState<number>(20);

useEffect(()=>{
    queryList()
},[])
useEffect(()=>{
  searchUser()
},[])
useEffect(() => {
  let intervalId = setInterval(() => {
    queryList()
  }, 10000*20);

  return () => {
    clearInterval(intervalId);
  };
}, []);
useEffect(()=>{
  if(query?.detail==="true"&&query?.id){
    setMode("VIEW")

  }
  

},[])
useEffect(()=>{
  if(initInfo?.applyDetail){

 setApplyDetailMode("ADD")
  }
},[])
const queryList = (obj?:{pageIndex?:number,pageSize?:number,currentStatus?:string,wfUserType?:string,userName?:string,title?:string}) => {
    setTableLoading(true)
    getRequest(queryWorkflowPrivListApi, {
      data: {...obj, pageIndex:obj?.pageIndex|| 1, pageSize:obj?.pageSize|| 20, },
    })
      .then((result) => {
        if (result.success) {
          let data = result?.data?.dataSource;
          let list=result.data?.dataSource || []
          if(list?.length>0){
            list?.map((item:any)=>{
              getRequest(currentAuditsApi,{data:{id:item?.id}}).then((res)=>{
                if(res?.success){
                  let data=res?.data?.audits;
                  setDataSource([...new Set([...list,Object.assign(item, {
                    audit: data,
                  })])])
                }
              })
            })}  
          let pageInfo=result?.data?.pageInfo
          setTotal(pageInfo?.total);
          setPageSize(pageInfo?.pageSize);
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
      setMode("VIEW")
      setCurRecord(record)
    },
   
  }) as any;
}, [dataSource]);
return(<div className="authority-apply">
    <TicketDetail
    mode={mode}
    curRecord={curRecord}
    queryId={query?.id||''}
    onClose={()=>{setMode("HIDE");
    // history.push({
    //     pathname:"/matrix/DBMS/authority-manage/authority-apply"
    //   })
    }}
    onSave={()=>{setMode("HIDE");
    queryList()
  }
}
    getList={
   ()=>{
    queryList()
   }
}

   />
 
   <ApplyDetailDrawer
   mode={applyDetailMode}
   onClose={()=>{setApplyDetailMode("HIDE");  if(initInfo?.noPowerData&&Object.keys(initInfo?.noPowerData)?.length>0){
    // setTimeout(() => {
   
      history.push({
        pathname:"/matrix/DBMS/authority-manage/authority-apply",
        

      },{}) }}}
   onSave={()=>{
     setApplyDetailMode("HIDE");
     queryList();
     if(initInfo?.noPowerData&&Object.keys(initInfo?.noPowerData)?.length>0){
        history.push({
          pathname:"/matrix/DBMS/authority-manage/authority-apply",
          

        },{}) }

    
   
   }}
   noPowerData={initInfo?.noPowerData||{}}

   />
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
              options={currentApplyStatusOptions}
             
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
      {/* <ContentCard> */}
      <div className="authority-wrapper"></div>
        <div className="table-caption">
          {/* <div className="caption-left"> */}
            <h3>权限列表</h3>
          {/* </div> */}
          {/* <div className="caption-right"> */}
          
            <Button type="primary" onClick={()=>{
               setApplyDetailMode("ADD")
            }}>申请权限</Button>
         
          {/* </div> */}
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={!dataSource?tableLoading:false}
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
      {/* </ContentCard> */}
 
 </div>)
}
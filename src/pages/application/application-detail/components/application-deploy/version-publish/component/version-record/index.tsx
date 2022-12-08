/**
 * PublishRecord
 * @description 版本发布记录
 * @author muxi.jth
 * @create 2022-12-7 16:05
 */

 import React, { useState, useEffect, useContext,useMemo } from 'react';
 import { Modal,List, Descriptions,Tag } from 'antd';
 import AceEditor from '@/components/ace-editor';
 import { history} from 'umi';
 import { stringify } from 'query-string';
 import DetailContext from '@/pages/application/application-detail/context';
 import moment from 'moment';
 import { FeContext } from '@/common/hooks';
 import { optionsToLabelMap } from '@/utils/index';
 import { getAppPublishList } from '../../../service';;
 import './index.less';
 import {statusMap} from './type'
 const rootCls = 'publish-record-compo';
 interface Iprops{
    envTypeCode:string
 }
 
 export default function PublishRecord(props: Iprops) {
   const { envTypeCode,  } = props;
   const { categoryData = [], businessData = [] } = useContext(FeContext);
   const categoryDataMap = useMemo(() => optionsToLabelMap(categoryData), [categoryData]);
   const { appData } = useContext(DetailContext);
   const [intervalId, setIntervalId] = useState<any>(null);
   const [dataSource,setDataSource]=useState<any>([])
   const [loading,setLoading]=useState<boolean>(false)
   const [curRecord, setcurRecord] = useState<any>({});
   const [visible, setVisible] = useState<boolean>(false);
   
   const queryDataSource=(params:{appCode:string})=>{
    setLoading(true)
    getAppPublishList(params?.appCode).then((res)=>{
        if(res?.success){
            setDataSource(res?.data)
        }

    }).finally(()=>{
        setLoading(false)
    })
}
 

   useEffect(() => {
       if (!appData?.appCode) return
     queryDataSource({
       appCode:appData?.appCode,
     });
   }, [appData?.appCode,envTypeCode]);
 
   useEffect(() => {
     let intervalId = setInterval(() => {
       if (appData?.appCode&&envTypeCode==="version" ) {
         queryDataSource({
            appCode: appData?.appCode,
         });
       }
     }, 8000);
 
    //setIntervalId(intervalId);
   // console.log("envTypeCode",envTypeCode)
 
     return () => {
       intervalId && clearInterval(intervalId);
     };
   }, [envTypeCode]);
 
 
 
   // 显示详情
   const handleShowDetail = (record: any) => {
     setVisible(true);
     setcurRecord(record);
   };
 
   return (
     <div className={rootCls}>
       <div className={`${rootCls}__title`}>版本发布记录</div>
       {dataSource?.length ? (
         <div>
           <List
             className="demo-loadmore-list"
             id="load-more-list"
             loading={dataSource?.length>0?false:loading}
             itemLayout="vertical"
            // loadMore={renderLoadMore()}
             dataSource={dataSource as any[]}
             renderItem={(item) => (
               <List.Item>
                 <div>
                   <label>版本号</label>:{item?.releaseNumber||"--"}
                   
                 </div>
                 <div>
                   <label>版本TAG</label>:{item?.tag||'--'}
                 </div>
                 <div>
                   <label>发布人</label>:{item?.createUser||'--'}
                 </div>
                 <div>
                   <label>发布时间</label>: {item?.gmtCreate ? moment(item?.gmtCreate).format('YYYY-MM-DD HH:mm') : ''}
                 </div>
                 <div>
                   <label>发布状态</label>:<Tag color={statusMap[item?.status]?.color||"gray"}>{item?.status? statusMap[item?.status]?.label : '--'}</Tag>
                 </div>
                
                 <a onClick={() => handleShowDetail(item)}>详情</a>
               </List.Item>
             )}
           />
         </div>
       ) : null}
 
       <Modal title="发布详情" destroyOnClose width={800} visible={visible} footer={false} onCancel={() => setVisible(false)}>
       <div>
       <Descriptions
      // {...rest}
      labelStyle={{ width: 100, justifyContent: 'flex-end' }}
      column={1}
    >
      <Descriptions.Item label="版本号"> 
      <a onClick={()=>{
                       // 跳转到版本详情
                history.push({
                  pathname: '/matrix/version-manage/detail',
                  search: stringify({ key: 'list', version: curRecord?.releaseNumber, releaseId: curRecord?.releaseId, categoryName: categoryDataMap[appData?.appCategoryCode!] || '--', categoryCode: appData?.appCategoryCode })
              })
                   }}>{curRecord?.releaseNumber||"--"}</a>
     </Descriptions.Item>
      <Descriptions.Item label="版本TAG">{curRecord?.tag}</Descriptions.Item>
      <Descriptions.Item label="发布人">{curRecord?.createUser}</Descriptions.Item>
      <Descriptions.Item label="发布状态">
      <Tag color={statusMap[curRecord?.status]?.color||"gray"}>{curRecord?.status? statusMap[curRecord?.status]?.label : '--'}</Tag>
        </Descriptions.Item>
      <Descriptions.Item label="发布时间">
      
        {curRecord?.gmtCreate ? moment(curRecord?.gmtCreate).format('YYYY-MM-DD HH:mm') : ''}
        </Descriptions.Item>
      <Descriptions.Item label="变更配置">
        <div style={{height:200,width:'100%'}}>
        <AceEditor readOnly height={200} mode="yaml" defaultValue={curRecord?.config?curRecord?.config:""}/>
        </div>
       
        </Descriptions.Item>
      <Descriptions.Item label="变更SQL">
      <div style={{height:200,width:'100%'}}>
      <AceEditor readOnly height={200} mode="sql" defaultValue={curRecord?.sql?curRecord?.sql:""} />
      </div>
      </Descriptions.Item>
      </Descriptions>

       </div>
       </Modal>
     </div>
   );
 }
 
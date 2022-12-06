/**
 * PublishRecord
 * @description 发布记录
 * @author moting.nq
 * @create 2021-04-25 16:05
 */

 import React, { useState, useEffect, useContext, useMemo } from 'react';
 import { Modal, Button, List, Tag } from 'antd';
 import VCDescription from '@/components/vc-description';
 import DetailContext from '@/pages/application/application-detail/context';
 import moment from 'moment';
 import { getAppPublishList } from '../../../service';
 import { usePaginated } from '@cffe/vc-hulk-table';
 import './index.less';
 const rootCls = 'publish-record-compo';
 interface Iprops{
    envTypeCode:string
 }
 
 export default function PublishRecord(props: any) {
   const { envTypeCode,  } = props;
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
 
//    const {
//      run: queryDataSource,
//      tableProps,
//      loadMore,
//    } = usePaginated({
//      requestUrl:appPublishListUrl,
//      requestMethod: 'GET',
//      showRequestError: true,
//      loadMore: true,
//    });
   useEffect(() => {
       if (!appData?.appCode) return
     queryDataSource({
       appCode:appData?.appCode,
     });
   }, [appData?.appCode]);
 
   useEffect(() => {
     let intervalId = setInterval(() => {
       if (appData?.appCode && envTypeCode) {
         queryDataSource({
            appCode: appData?.appCode,
         });
       }
     }, 8000);
 
     setIntervalId(intervalId);
 
     return () => {
       intervalId && clearInterval(intervalId);
     };
   }, []);
 
   
 
//    const renderLoadMore = () => {
//     const { pageSize = 0, total = 0, current = 0 } = tableProps?.pagination || {};
//      return (
//        total > 0 &&
//        total > pageSize && (
//          <div className={`${rootCls}-btns`}>
//            <Button
//              ghost
//              type="primary"
//              onClick={() => {
//             //   loadMore && loadMore();
//                intervalId && clearInterval(intervalId);
//              }}
//            >
//              加载更多
//            </Button>
//          </div>
//        )
//      );
//    };
 
   // 显示详情
   const handleShowDetail = (record: any) => {
     setVisible(true);
     setcurRecord(record);
   };
 
   return (
     <div className={rootCls}>
       <div className={`${rootCls}__title`}>版本发布记录</div>
       {dataSource?.filter((v:any) => v?.envTypeCode === envTypeCode)?.length ? (
         <div>
           <List
             className="demo-loadmore-list"
             id="load-more-list"
             loading={loading}
             itemLayout="vertical"
            // loadMore={renderLoadMore()}
             dataSource={dataSource?.filter((v:any) => v?.envTypeCode === envTypeCode) as any[]}
             renderItem={(item) => (
               <List.Item>
                 <div>
                   {/* <label>{recordFieldMapOut['modifyUser']}</label>:{item['modifyUser']} */}
                 </div>
                 <div>
                   {/* <label>{recordFieldMapOut['deployedTime']}</label>: */}
                   {moment(item['deployedTime']).format('YYYY-MM-DD HH:mm:ss')}
                 </div>
                 {item.version && (
                   <div>
                     <label>版本号</label>:{item['version']}
                   </div>
                 )}
                 {item.deployStatus === 'multiEnvDeploying' && item.deploySubStates ? (
                   <div>
                     {/* <label>{recordFieldMapOut['deployStatus']}</label>: */}
                     {JSON.parse(item.deploySubStates)?.map((subItem: any) => (
                       <div>
                         <label>{subItem.envCode}</label>:
                         {
                           <span style={{ marginLeft: 6 }}>
                             {/* <Tag color={recordDisplayMap[subItem['subState']]?.color || 'red'}>
                               {recordDisplayMap[subItem['subState']]?.text || '---'}
                             </Tag> */}
                           </span>
                         }
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div>
                     {/* <label>{recordFieldMapOut['deployStatus']}</label>:
                     {
                       <span style={{ marginLeft: 6 }}>
                         <Tag color={recordDisplayMap[item['deployStatus']]?.color || 'red'}>
                           {recordDisplayMap[item['deployStatus']]?.text || '---'}
                         </Tag>
                       </span>
                     } */}
                   </div>
                 )}
                 <a onClick={() => handleShowDetail(item)}>详情</a>
               </List.Item>
             )}
           />
         </div>
       ) : null}
 
       <Modal title="发布详情" width={800} visible={visible} footer={false} onCancel={() => setVisible(false)}>
         <VCDescription labelStyle={{ width: 90, justifyContent: 'flex-end' }} column={1} dataSource={curRecord} />
       </Modal>
     </div>
   );
 }
 
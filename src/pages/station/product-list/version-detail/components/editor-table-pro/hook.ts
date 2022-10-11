import { useState,useCallback } from 'react';
import * as APIS from '../../../../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest } from '@/utils/request';


//获取queryFrontbucketList
export function useFrontbucketList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any>([]);
    const queryFrontbucketList =useCallback( async () => {
      setLoading(true);
      await getRequest(APIS.queryFrontbucketList)
        .then((res) => {
          if (res?.success) {
            let dataSource = res.data || [];
            let options: any = [];
            dataSource?.map((item: any, index: number) => {
              options.push({
                label: item,
                value: item,
              });
            });
            setDataSource(options);
          } else {
            setDataSource([]);
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },[]);
  
    return [loading, dataSource, queryFrontbucketList];
  }
  
  //获取queryBelongList
  export function useBelongList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any>([]);
    const queryBelongList = useCallback(async () => {
      setLoading(true);
      await getRequest(APIS.queryBelongList)
        .then((res) => {
          if (res?.success) {
            let dataSource = res.data || [];
            let options: any = [];
            dataSource?.map((item: any, index: number) => {
              options.push({
                label: item,
                value: item,
               
              });
            });
            setDataSource(options);
          } else {
            setDataSource([]);
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },[]);
  
    return [loading, dataSource,queryBelongList];
  }


//依赖查询
export function useQueryComponentList(): [
  
  (
    componentType: string
  ) => Promise<void>,
  any,
] {
  
  const [options, setOptions] = useState([]);
  
  let optionsArry:any=[]
  const queryComponentList = async (
    componentType: string
   
  ) => {
    
    try {
      await getRequest(APIS.queryComponentList, {
        data: {
          componentType: componentType,
         
          pageIndex:-1,
          pageSize:-1,
        },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
          
           
            dataSource?.map((item:any)=>{
              optionsArry.push({
                label:item?.componentName,
                value:item?.componentName,
              })

            })
            setOptions(optionsArry)
           
          } else {
            return [];
          }
        })
       
    } catch (error) {
      console.log(error);
    }
  };
  return [queryComponentList,options];
}

  

  

  //queryNamespaceList
  export function useNamespaceList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any>([]);
    const queryNamespaceList = useCallback(async (componentName:string) => {
      setLoading(true);
      await getRequest(APIS.queryNamespaceList,{data:{componentName}})
        .then((res) => {
          if (res?.success) {
            let dataSource = res.data || [];
            let options: any = [];
            dataSource?.map((item: any, index: number) => {
              options.push({
                label: item,
                value: item,
               
              });
            });
            setDataSource(options);
          } else {
            setDataSource([]);
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },[]);
  
    return [loading, dataSource,queryNamespaceList];
  }
  
//bulkdeleteApi
export function useBulkdelete():[boolean, (componentIds: any) => Promise<void>]{
  const [loading, setLoading] = useState<boolean>(false);
  const bulkdelete = useCallback(async (componentIds:any) => {
    setLoading(true);
    await delRequest(APIS.bulkdeleteApi,{data:{componentIds}})
      .then((res) => {
        if (res?.success) {
         message.success(res?.data)
        } 
      })
      .finally(() => {
        setLoading(false);
      });
  },[]);

  return [loading,bulkdelete];
}
//bulkaddApi
export function useBulkAdd() {
  const [loading, setLoading] = useState<boolean>(false);
  const bulkadd = useCallback(async (versionId:number,componentName:string) => {
    setLoading(true);
    await postRequest(APIS.bulkaddApi,{data:{versionId,componentName}})
      .then((res) => {
        if (res?.success) {
         message.success(res?.data)
        } 
      })
      .finally(() => {
        setLoading(false);
      });
  },[]);

  return [loading,bulkadd];
}
//checkComponentRelyApi
export function useCheckComponentRely() {
  const [data,setData]=useState<any>("")
  const checkComponentRely = useCallback(async (versionId:number) => {
   
    await postRequest(`${APIS.checkComponentRelyApi}?versionId=${versionId}`)
      .then((res) => {
        if (res?.success) {
          let data:any=res?.data
          if(data?.length>0){
            const toolip= (data||[]).join(',')
            // message.success(`${toolip}依赖组件未编排！`)
            setData(toolip)
          }
          
        } 
      })
     
  },[]);

  return [data,checkComponentRely];
}
interface editorParams{
   id	:number		//产品组件编排id	true
   componentName:string	//组件名称		true
   componentType:string	//组件类型		true
   componentVersion:string	//组件版本		true
   componentDescription:string	//组件描述		true
   componentReleaseName:string	//组件部署名称	true
   componentConfiguration:string	//组件配置		true
   componentNamespace:string //组件命名空间	true
   componentDependency:string	//组件依赖		true
   productLine?:string	 //产品线			true
   componentPriority?:number

}
//编辑组件配置

export function useEditComponent(): [boolean, (params: editorParams) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const editComponent = async (params: editorParams) => {
    setLoading(true);
    try {
      await postRequest(APIS.editComponent, {
        data: params
      })
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, editComponent];
}
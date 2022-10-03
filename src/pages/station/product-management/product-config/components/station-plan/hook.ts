import { useState, useEffect,useCallback } from 'react';
import * as APIS from '../../../../service';
import { message } from 'antd';
import { getRequest, postRequest ,delRequest} from '@/utils/request';
//deleteServerApi

export function useDeleteServer(): [boolean, (indentId: number,serverIps:any) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteServer = async (indentId: number,serverIps:any) => {
    setLoading(true);
    try {
      await delRequest(`${APIS.deleteServerApi}`,{data:{indentId,serverIps}})
        .then((res) => {
          if (res.success) {
            message.success('删除成功！');
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
  return [loading, deleteServer];
}
export interface SaveBasicInfoItems{
     indentId:number;//制品id		true
     projectCode:string ;//	项目code	true
     projectDomain:string;//	项目domain	true
     k8SVersion:string;//	k8s版本		true
     vip:string	;//VIP			true
     dns:string;	//DNS		true
     mutiClusterEnable:number;// 	int		双集群开关（0为关，1为开）	true
     sshPassword:string //	ssh密码		true
     sshUser:string //	ssh密码		true
     ntpServer:string	//ntp服务器地址	true

}
export const saveBasicInfo = (params: SaveBasicInfoItems) => {
    return postRequest(APIS.saveBasicInfoApi, { data: params });
  };

  export const getNodeList = (indentId:number) => {
    return getRequest(APIS.listServerInfoApi, { data: {indentId} });
  };
  
//保存基础配置
export function useSaveBasicInfo(): [(params: SaveBasicInfoItems) => Promise<void>] {
    const saveBasicInfo = useCallback(async (params: SaveBasicInfoItems) => {
      await postRequest(APIS.saveBasicInfoApi, { data:params });
    }, []);
  
    return [saveBasicInfo];
  }
  export interface SaveServerInfoItems{
    indentId:number;//		制品id	true
    server:{ serverIp:string	//主机ip		true
    hostname:string	//主机名		true
    cpu	:number	//cpu 		true
    memory:number	//内存		true
    isRootDisk:boolean	//数据盘		true
    dataDisk:string	//数据盘		true
    nodeRole:string	//主机角色		true
    nodePurpose:string	//主机用途	true
    enableNfs:number	//是否启用nfs-server（0为关，1为开） true
    nfsWhite:string 	//nfs服务白名单		true
    }
}
export const saveServerInfo = (params: SaveServerInfoItems) => {
    return postRequest(APIS.saveServerInfoApi, { data: params });
  };
//保存节点配置
export function useSaveServerInfo(): [(params: SaveServerInfoItems) => Promise<void>] {
    const saveServerInfo = useCallback(async (params: SaveServerInfoItems) => {
      await postRequest(APIS.saveServerInfoApi, { data:params});
    }, []);
  
    return [saveServerInfo];
  }

  export interface SaveDatabaseInfoItems{
    indentId:number;//		制品id						true
    DbType:string;//	数据库类型（mysql、rds）	true
    DbAddress:string ;//	地址						true
    DbUser:string;//	用户						true
    DbPassword:string;//	密码					true
    DbPort:number;//	        端口					true
    DbUsage:string;//	数据盘						true

}
export const saveDatabaseInfo = (params: any) => {
    return postRequest(APIS.saveDatabaseInfoApi, { data: params });
  };
//保存数据库信息
//listNacosInfoApi
export function useGetListNacosPurposeInfo(): [boolean,any, () => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [data,setData]=useState<any>([]);
  const getListNacosPurposeInfo= async () => {
    setLoading(true);
    try {
      await getRequest(`${APIS.listNacosInfoApi}`,{data:{keyName:"nodePurpose"}})
        .then((res) => {
          if (res.success) {
            const source=  res?.data?.map((item:string)=>(
              {label:item,
              value:item}
            )
              
            )
              setData(source)
          } 
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading,data, getListNacosPurposeInfo];
}
export function useGetListNacosRoleInfo(): [boolean,any, () => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [data,setData]=useState<any>([]);
  const getListNacosRoleInfo= async () => {
    setLoading(true);
    try {
      await getRequest(`${APIS.listNacosInfoApi}`,{data:{keyName:"nodeRole"}})
        .then((res) => {
          if (res.success) {
          const source=  res?.data?.map((item:string)=>(
            {label:item,
            value:item}
          )
            
          )
            setData(source)
          } 
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading,data, getListNacosRoleInfo];
}

//listBasicInfoApi

export function useGetListBasicInfo(): [boolean,any, (indentId:number) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [data,setData]=useState<any>([]);
  const getListBasicInfo= async (indentId:number) => {
    setLoading(true);
    try {
      await getRequest(`${APIS.listBasicInfoApi}`,{data:{indentId}})
        .then((res) => {
          if (res.success) {
         
            setData(res?.data)
          } 
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading,data, getListBasicInfo];
}
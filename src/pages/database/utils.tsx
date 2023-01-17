import {useMemo,useContext} from "react";
import { FeContext } from '@/common/hooks';

/** 校验按钮级权限 */
export const buttonPession = (permissionCode:string ) => {
    const { btnPermission } = useContext(FeContext);
    
    const canAdd = useMemo(() => {
      if(btnPermission?.length>0&&btnPermission.includes(permissionCode)){
        return true

      }else{
        return false
      }
      }, [btnPermission])
    return canAdd;
  };
  
import {useMemo,useContext} from "react";
import { FeContext } from '@/common/hooks';

/** 校验按钮级权限 */
export const buttonPession = (permissionCode:string ) => {
    const { btnPermission } = useContext(FeContext);
    const canAdd = useMemo(() => btnPermission.includes(permissionCode), [btnPermission])
    return canAdd;
  };
  
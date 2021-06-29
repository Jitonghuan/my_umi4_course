import React, { useContext } from 'react';
import FeContext from '@/layouts/basic-layout/fe-context';
import FELayout from '@cffe/vc-layout';

export interface IProps {
  /** 权限点 */
  code: string;
  /** 是否在无权限的时候显示异常页面 */
  isShowErrorPage?: boolean;
}

/**
 * 权限控制组件
 * @description 适用于包裹节点
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-25 16:36
 */
const Coms: React.FC<IProps> = (props) => {
  const { children, isShowErrorPage, code } = props;
  const feContent = useContext(FeContext);
  const { permissionData = [], isOpenPermission = false } = feContent;

  const hasPermission = !!permissionData.find((el) => el.permissionUrl === code);

  // 权限未开启，或者权限数据中存在当前的节点数据
  return (
    !isOpenPermission || hasPermission ? children : isShowErrorPage ? <FELayout.NoPermissionPage /> : null
  ) as React.ReactElement;
};

/**
 * 默认值
 */
Coms.defaultProps = {
  // 属性默认值配置
  isShowErrorPage: false,
};

export default Coms;

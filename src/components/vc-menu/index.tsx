import React from 'react';
import { Menu } from 'antd';
import { MenuProps } from 'antd/es/menu';

export type IMenuItem = {
  /** menu key */
  key: string;
  /** 显示标题 */
  title?: React.ReactNode | string | number;
  /** icon */
  icon?: React.ReactNode;
  /** 扩展 */
  extra?: React.ReactNode | string;
  /** 子节点 */
  children?: IMenuItem[];
};

export interface IProps extends MenuProps {
  /** menu 数据 */
  menuData?: IMenuItem[];
}

/**
 * menu 组件
 * @description menu 组件封装适配业务
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-08 16:18
 */
const Coms = (props: IProps) => {
  const { menuData = [], ...rest } = props;

  // menu item
  const renderMenuItem = (menuItem: IMenuItem) => {
    return (
      <Menu.Item key={menuItem.key} icon={menuItem.icon}>
        {menuItem.title}
        {menuItem.extra}
      </Menu.Item>
    );
  };

  return (
    <Menu mode="inline" {...rest}>
      {menuData.map((el) =>
        el.children && el.children.length > 0 ? (
          <Menu.SubMenu key={el.key} icon={el.icon} title={el.title}>
            {el.children.map((ele) => renderMenuItem(ele))}
          </Menu.SubMenu>
        ) : (
          renderMenuItem(el)
        ),
      )}
    </Menu>
  );
};

/**
 * 默认值
 */
Coms.defaultProps = {
  // 属性默认值配置
};

export default Coms;

import React, { useMemo } from 'react';
import { Card } from 'antd';
import VCForm, { IColumns } from '@cffe/vc-form';

import VCPageContent from '@/components/vc-page-content';
import ds from '@config/defaultSettings';

export interface IProps {
  /** 属性描述 */
}

/**
 * 发布功能管理
 * @description 发布功能页面
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-06 11:17
 */
const Coms: React.FC<IProps> = (props) => {
  const breadcrumb = [
    { name: '发布管理', path: `${ds.pagePrefix}/publish` },
    { name: '发布功能管理', path: `${ds.pagePrefix}/publish/function` },
  ];

  // 表单 filter form columns
  // const filterColumns: IColumns[] = useMemo(() => {
  //   return [
  //     { label: '发布状态' },
  //     { label: '所属' },
  //     { label: '业务线' },
  //     { label: '业务模块' },
  //     { label: '功能名称' },
  //     { label: '计划发布时间' },
  //     { label: '实际发布时间' },
  //   ]
  // }, []);

  return (
    <VCPageContent breadcrumb={breadcrumb}>
      <Card>{/* <VCForm
          columns={filterColumns}
        /> */}</Card>
    </VCPageContent>
  );
};

/**
 * 默认值
 */
Coms.defaultProps = {
  // 属性默认值配置
};

export default Coms;

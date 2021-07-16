// 数据模板
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import { Form, Table, Button, Input, Select, message, DatePicker, Checkbox } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import HeaderTabs from '../components/header-tabs';
import * as APIS from '../service';

export default function DataTemplate(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="template" history={props.history} />
      <ContentCard></ContentCard>
    </MatrixPageContent>
  );
}

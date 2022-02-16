// 操作日志
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:35

import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Button, DatePicker } from 'antd';
import { datetimeCellRender } from '@/utils';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';

import { getRequest } from '@/utils/request';

export default function Operation() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParams, setSearchParams] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [detailItem, setDetailItem] = useState<any>();
  const [pageTotal, setPageTotal] = useState<number>();
  const [logList, setLogList] = useState<any>([]); //查看日志列表信息
  const [formLog] = Form.useForm();

  return (
    <PageContainer className="tmpl-detail">
      <FilterCard></FilterCard>
      <ContentCard></ContentCard>
    </PageContainer>
  );
}

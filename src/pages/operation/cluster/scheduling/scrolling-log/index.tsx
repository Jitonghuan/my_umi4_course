// 滚动日志页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/14 14:30
import React, { useContext, useState, useEffect } from 'react';
import { Radio, Button, Card, Tag, Tooltip, Space, message, Form, Popconfirm } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';
export default function Traffic() {
  const [options, setoptions] = useState<any[]>([
    { label: 'A集群', value: 'colonyA' },
    { label: 'B集群', value: 'colonyB' },
  ]);

  return (
    <MatrixPageContent>
      <ContentCard className="traffic">
        <Card style={{ width: 500 }}></Card>
      </ContentCard>
    </MatrixPageContent>
  );
}

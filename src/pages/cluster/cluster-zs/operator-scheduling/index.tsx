/**
 * @description: 患者操作员纬度
 * @name {muxi.jth}
 * @time {2021/11/30 10:47}
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Form, Radio, Button, Modal, Card } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from '../service';
import { postRequest } from '@/utils/request';
import './index.less';

export default function OperatorScheduling() {
  return (
    <ContentCard className="page-scheduling">
      <div className="site-card-border-less-wrapper">
        <Card title="Card title" bordered={false} style={{ width: 300 }}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    </ContentCard>
  );
}

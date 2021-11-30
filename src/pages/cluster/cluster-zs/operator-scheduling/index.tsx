/**
 * @description: 患者操作员纬度
 * @name {muxi.jth}
 * @time {2021/11/30 10:47}
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Form, Radio, Button, Modal, Card, Select, Input } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from '../service';
import { postRequest } from '@/utils/request';
import './index.less';

export default function OperatorScheduling() {
  return (
    <ContentCard className="page-scheduling">
      <div className="site-card-border-less-wrapper">
        <Card title="操作" bordered={false} style={{ width: 300 }}>
          <p>
            集群选择:<Select></Select>
          </p>
          <p>
            人员选择:<Select></Select>
          </p>
          <p>
            ID:<Input></Input>
          </p>
        </Card>
        <Card title="A集群" bordered={false} style={{ width: 300 }}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        <Card title="B集群" bordered={false} style={{ width: 300 }}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    </ContentCard>
  );
}

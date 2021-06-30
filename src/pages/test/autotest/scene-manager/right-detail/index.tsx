// right detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 15:59

import React, { useState, useEffect } from 'react';
import { Button, Tag, Table, message, Empty, Spin, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type Emitter from 'events';
import { ContentCard } from '@/components/vc-page-content';
import { postRequest } from '@/utils/request';
import * as APIS from '../../service';
import { TreeNode, CaseItemVO } from '../../interfaces';
import './index.less';

interface RightDetailProps extends Record<string, any> {
  emitter: Emitter;
  /** 当前选中的模块 */
  current?: TreeNode;
}

export default function RightDetail(props: RightDetailProps) {
  return <ContentCard className="page-case-right-detail">HELLO</ContentCard>;
}

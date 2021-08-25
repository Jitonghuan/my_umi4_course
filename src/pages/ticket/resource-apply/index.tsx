//资源申请页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/31 17:00

import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, postRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import AceEditor from '@/components/ace-editor';
import { Input, Button, Form, Row, Col, Select, Space } from 'antd';

export default function resourceApply() {
  return (
    <MatrixPageContent>
      <ContentCard></ContentCard>
    </MatrixPageContent>
  );
}

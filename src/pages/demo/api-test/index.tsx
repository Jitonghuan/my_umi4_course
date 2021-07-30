// 接口测试
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/30 11:21

import React, { useState, useCallback } from 'react';
import { Button, Input, Form, Select, Spin } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { CardRowGroup, ContentCard } from '@/components/vc-page-content';
import { getRequest, postRequest, putRequest, delRequest } from '@/utils/request';

const { Item: FormItem } = Form;

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
];

export default function PageApiTest() {
  const [field] = Form.useForm();
  const [pending, setPending] = useState(false);
  const [resultData, setResultData] = useState('');

  return (
    <MatrixPageContent>
      <CardRowGroup>
        <CardRowGroup.SlideCard className="content-slide" width={800}>
          <Form form={field} labelCol={{ flex: '80px' }}>
            <FormItem label="API" name="api" rules={[{ required: true, message: '请输入接口路径' }]}>
              <Input placeholder="请输入接口路径" />
            </FormItem>
            <FormItem label="Method" name="method">
              <Select placeholder="请选择" options={methodOptions} style={{ width: 200 }} />
            </FormItem>
            <FormItem label="Params" name="params">
              <EditorTable
                columns={[
                  { dataIndex: 'name', title: 'Name' },
                  { dataIndex: 'value', title: 'Value' },
                ]}
              />
            </FormItem>
            <FormItem label="Body" name="body">
              <AceEditor mode="json" height={200} />
            </FormItem>
            <FormItem label="Headers" name="headers">
              <EditorTable
                columns={[
                  { dataIndex: 'name', title: 'Name' },
                  { dataIndex: 'value', title: 'Value' },
                ]}
              />
            </FormItem>
            <FormItem label=" " colon={false}>
              <Button htmlType="submit" type="primary">
                请求
              </Button>
              <Button htmlType="reset" type="default" style={{ marginLeft: 16 }}>
                重置
              </Button>
            </FormItem>
          </Form>
        </CardRowGroup.SlideCard>
        <ContentCard>
          <Spin spinning={pending}>
            <pre className="pre-block">{resultData}</pre>
          </Spin>
        </ContentCard>
      </CardRowGroup>
    </MatrixPageContent>
  );
}

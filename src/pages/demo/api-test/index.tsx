// 接口测试
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/30 11:21

import React, { useState, useCallback } from 'react';
import { Button, Input, Form, Select, Spin } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
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

  const handleSubmit = useCallback(async (values: any) => {
    console.log('> handleSubmit: ', values);

    const { api, method, data, headers } = values;
    let promise: Promise<any>;

    const dataParams = JSON.parse(data);
    const headerParams = JSON.parse(headers);

    setPending(true);

    if (method === 'DELETE') {
      promise = delRequest(api, { data: dataParams, headers: headerParams });
    } else if (method === 'POST') {
      promise = postRequest(api, { data: dataParams, headers: headerParams });
    } else if (method === 'PUT') {
      promise = putRequest(api, { data: dataParams, headers: headerParams });
    } else {
      promise = getRequest(api, { data: dataParams, headers: headerParams });
    }

    promise
      .then((result) => {
        setResultData(JSON.stringify(result || {}, null, 2));
      })
      .catch((error) => {
        setResultData(JSON.stringify(error || {}, null, 2));
      })
      .finally(() => {
        setPending(false);
      });
  }, []);

  return (
    <MatrixPageContent>
      <CardRowGroup>
        <CardRowGroup.SlideCard className="content-slide" width={800}>
          <Form form={field} labelCol={{ flex: '80px' }} onFinish={handleSubmit}>
            <FormItem label="API" name="api" rules={[{ required: true, message: '请输入接口路径' }]}>
              <Input placeholder="请输入接口路径" />
            </FormItem>
            <FormItem label="Method" name="method" initialValue="GET">
              <Select placeholder="请选择" options={methodOptions} style={{ width: 200 }} />
            </FormItem>
            <FormItem label="Data" name="data" initialValue="{}">
              <AceEditor mode="json" height={200} />
            </FormItem>
            <FormItem label="Headers" name="headers" initialValue="{}">
              <AceEditor mode="json" height={160} />
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
            <AceEditor value={resultData} height={window.innerHeight - 170} readOnly />
          </Spin>
        </ContentCard>
      </CardRowGroup>
    </MatrixPageContent>
  );
}

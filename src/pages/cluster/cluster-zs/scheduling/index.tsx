/**
 * @description:
 * @param {*}
 * @return {*}
 */

// 流量调度
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:36

import React, { useCallback, useEffect, useState } from 'react';
import { Form, Radio, Button, Modal } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import { useInitClusterData, useClusterSource } from './hooks';
import appConfig from '@/app.config';
import * as APIS from '../service';
import { postRequest, getRequest } from '@/utils/request';
import './index.less';
import { getCommonEnvCode } from '../../hook';
export default function TrafficScheduling(props: any) {
  const { visable } = props;
  const [editField] = Form.useForm();
  const [sourceData] = useClusterSource();
  const [initData] = useInitClusterData();
  const [logger, setLogger] = useState<string>();
  const [pending, setPending] = useState(false);
  const [commonEnvCode, setCommonEnvCode] = useState<string>('');

  // 回填初始化数据到表单
  useEffect(() => {
    if (!initData) return;
    editField.setFieldsValue(initData);
  }, [initData, visable]);

  // useEffect(() => {
  //   getRequest(APIS.trafficMap).then(result => {
  //     console.log('>>> trafficMap', result.data);
  //   });
  // }, []);
  useEffect(() => {
    if (appConfig.IS_Matrix !== 'public') {
      getRequest(getCommonEnvCode).then((result) => {
        if (result?.success) {
          setCommonEnvCode(result.data);
        }
      });
    }
  }, [visable]);

  const handleSubmit = useCallback(async () => {
    const values = await editField.validateFields();
    // console.log('> handleSubmit', values,values?.zslnyy,Object.keys(values)[0]);
    let item = sourceData.map((item: any, index) => {
      return item;
    });
    let ip = '';
    if (values?.zslnyy === 'cluster_a') {
      ip = item[0]?.options[0].ip;
    }
    if (values?.zslnyy === 'cluster_b') {
      ip = item[0]?.options[1].ip;
    }

    Modal.confirm({
      title: '操作确认',
      content: (
        <div className="schedule-confirm-content">
          <h4>请确认即将调度的内容：</h4>
          {sourceData.map((item: any, index) => (
            <p key={index}>
              {item.title} <ArrowRightOutlined />
              <b>{item.options?.find((n: any) => n.value === values[item.name])?.label}</b>
            </p>
          ))}
        </div>
      ),
      okText: '我已确认无误',
      cancelText: '取消',
      onOk: async () => {
        setPending(true);
        // delRequest(`${APIS.deleteTmpl}/${id}`)

        try {
          const result = await postRequest(`${APIS.switchCluster}?envCode=${commonEnvCode}`, {
            data: [
              {
                envCode: commonEnvCode,
                cluster: values?.zslnyy,
                hospitalDistrictCode: Object.keys(values)[0],
                hospitalDistrictName: item[0]?.title,
                ip: ip,
              },
            ],
          });
          setLogger(result.data || '');
        } finally {
          setPending(false);
        }
      },
    });
  }, [editField, sourceData]);

  const handleReset = useCallback(() => {
    editField.setFieldsValue(initData || {});
  }, [editField, initData]);

  return (
    <ContentCard className="page-scheduling">
      <h3>请选择调度类型：</h3>
      <Form form={editField}>
        <div className="zone-card-group">
          {sourceData.map((group, index) => (
            <div className="zone-card" key={index}>
              <h4>{group.title}</h4>
              <Form.Item name={group.name} rules={[{ required: true, message: '请选择集群' }]}>
                <Radio.Group options={group.options} size="large" />
              </Form.Item>
            </div>
          ))}
        </div>
        <div className="action-group">
          <Button type="primary" loading={pending} size="large" onClick={handleSubmit}>
            开始调度
          </Button>
          <Button hidden type="default" size="large" onClick={handleReset} style={{ marginLeft: 12 }}>
            重置
          </Button>
        </div>
      </Form>
      <Modal
        visible={!!logger}
        title="同步日志"
        maskClosable={false}
        footer={false}
        onCancel={() => setLogger(undefined)}
        width={800}
      >
        <pre className="pre-block">{logger}</pre>
      </Modal>
    </ContentCard>
  );
}

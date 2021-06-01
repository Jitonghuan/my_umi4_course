// 环境detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/28 10:47

import React, { useState, useEffect, useContext, useRef } from 'react';
import { message, Input, Select, Tabs, Form, Button, Empty } from 'antd';
import type Emitter from 'events';
import FELayout from '@cffe/vc-layout';
import { ContentCard } from '@/components/vc-page-content';
import { EnvItemVO, EnvDbConfItemVO, EnvVarConfItemVO } from '../interfaces';
import * as APIS from '../service';
import { postRequest } from '@/utils/request';
import DBPanel from './db-pane';
import GlobalVarPanel from './global-var';
import { useEnvCodeOptions } from '../hooks';
import './index.less';

type UpdateFormDataProps = Partial<EnvItemVO>;
type TabKeyEnum = 'http' | 'rpc' | 'db' | 'global';

interface EnvDetailProps extends Record<string, any> {
  current: EnvItemVO;
  emitter: Emitter;
}

const formLayout = {
  labelCol: { flex: '80px' },
  wrapperCol: { flex: '420px' },
};

export default function EnvDetail(props: EnvDetailProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [editField] = Form.useForm<UpdateFormDataProps>();
  const [currentTab, setCurrentTab] = useState<TabKeyEnum>('http');
  const [envCodeOptions] = useEnvCodeOptions();

  const [dbSource, setDbSource] = useState<EnvDbConfItemVO[]>([]);
  const globalVarRef = useRef<() => EnvVarConfItemVO[]>(() => []);

  useEffect(() => {
    editField.resetFields();
    if (!props.current) return;

    setDbSource(props.current.dbConf || []);
    editField.setFieldsValue(props.current);
  }, [props.current]);

  // 全量保存数据
  const handleSubmit = async () => {
    const values = editField.getFieldsValue();
    const submitData = {
      id: props.current.id,
      envName: values.name,
      envCode: values.code,
      httpConf: values.httpConf || '',
      rpcConf: values.rpcConf,
      dbConf: dbSource,
      varConf: globalVarRef.current(),
      modifyUser: userInfo.userName,
    };

    console.log('>>>>> submitData', submitData);

    await postRequest(APIS.updateEnvInfo, {
      data: submitData,
    });

    message.success('保存成功！');

    // 通知 env-list 刷新
    props.emitter.emit('ENV::REFRESH');
  };

  if (!props.current) {
    return (
      <ContentCard className="page-env-detail">
        <Empty
          description="请选择环境"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: '30%' }}
        />
      </ContentCard>
    );
  }

  return (
    <ContentCard className="page-env-detail">
      <Form form={editField}>
        <Form.Item
          label="环境名称"
          name="name"
          rules={[{ required: true, message: '请输入环境名称' }]}
          {...formLayout}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="环境绑定"
          name="code"
          rules={[{ required: true, message: '请选择绑定环境' }]}
          {...formLayout}
        >
          <Select options={envCodeOptions} />
        </Form.Item>
        <Tabs
          onChange={(key) => setCurrentTab(key as TabKeyEnum)}
          activeKey={currentTab}
        >
          {/* --------- http 域名 ----------- */}
          <Tabs.TabPane key="http" tab="http服务" forceRender>
            <Form.Item label="http域名" name="httpConf" {...formLayout}>
              <Input />
            </Form.Item>
          </Tabs.TabPane>

          {/* ---------- RPC服务 ----------- */}
          <Tabs.TabPane key="rpc" tab="RPC服务" forceRender>
            <Form.Item
              label="注册中心"
              name={['rpcConf', 'registCenter']}
              {...formLayout}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="命名空间"
              name={['rpcConf', 'nameSpace']}
              {...formLayout}
            >
              <Input />
            </Form.Item>
          </Tabs.TabPane>

          {/* ------- 数据库配置 --------- */}
          <Tabs.TabPane key="db" tab="数据库配置" forceRender>
            <DBPanel
              key={props.current.id}
              value={dbSource}
              onChange={setDbSource}
            />
          </Tabs.TabPane>

          {/* ------------ 全局变量 ------------- */}
          <Tabs.TabPane key="global" tab="全局变量" forceRender>
            <GlobalVarPanel
              key={props.current.id}
              initData={props.current.varConf || []}
              queryRef={globalVarRef}
            />
          </Tabs.TabPane>
        </Tabs>
      </Form>
      <div className="float-action-group">
        <Button type="primary" size="large" onClick={handleSubmit}>
          保存
        </Button>
        <Button
          size="large"
          type="default"
          onClick={() => props.emitter.emit('ENV::CANCEL')}
        >
          取消
        </Button>
      </div>
    </ContentCard>
  );
}

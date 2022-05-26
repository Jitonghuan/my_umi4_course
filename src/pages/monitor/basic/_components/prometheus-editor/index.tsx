// 添加监控对象
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/16 20:50

import React, { useEffect, useState, useCallback } from 'react';
import { Form, Input, Select, Button, Drawer, message } from '@cffe/h2o-design';
import { getRequest } from '@/utils/request';
import EditorTable from '@cffe/pc-editor-table';
import { KVProps, PromitheusItemProps } from '../../interfaces';
import { postRequest } from '@/utils/request';
import * as APIS from '../../services';
import { useAppCodeOptions, useEnvCodeOptions, useIntervalOptions } from './hooks';

const { Item: FormItem } = Form;
const fieldCommon = {
  style: { width: 320 },
};

export interface PromitheusEditorProps {
  mode?: EditorMode;
  initData?: PromitheusItemProps;
  onClose: () => any;
  onSave: () => any;
}

export default function PromitheusEditor(props: PromitheusEditorProps) {
  const { mode, initData, onClose, onSave } = props;
  const [editField] = Form.useForm<PromitheusItemProps>();
  const [intervalOptions] = useIntervalOptions();
  const [appCode, setAppCode] = useState<string>();
  const [envCodeOptions, envCodeLoading] = useEnvCodeOptions(appCode);
  const [envCodeList, setEnvCodeList] = useState<any[]>([]); //通过通用查询环境接口获取到环境列表
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (mode === 'HIDE') return;
    editField.resetFields();

    if (mode === 'ADD' || !initData) return;

    const labelList: KVProps[] = Object.keys(initData.labels || {}).map((key) => ({
      key,
      value: initData.labels?.[key],
    }));

    const payload = {
      name: initData.name,
      appCode: initData.appCode,
      envCode: initData.envCode,
      interval: initData.interval,
      metricsUrl: initData.metricsUrl,
      labelList,
    };
    editField.setFieldsValue(payload);
  }, [mode]);
  useEffect(() => {
    envDataList();
  }, [mode]);
  const handleAppCodeChange = useCallback(
    (next: string) => {
      setAppCode(next);
      editField.resetFields(['envCode']);
    },
    [editField],
  );
  //通过接口获取所有环境
  const envDataList = () => {
    getRequest(APIS.envList, { data: { pageIndex: 1, pageSize: 100 } }).then((result) => {
      let envlistArr: any = [];
      const envslist = result.data.dataSource?.map((n: any) => {
        envlistArr.push(n?.envCode);
      });
      let setEnvslist = new Set(envlistArr);
      let newEnvList = Array.from(setEnvslist);
      let envlistData = newEnvList.map((item: any) => {
        return {
          value: item,
          lable: item,
        };
      });
      setEnvCodeList(envlistData);
    });
  };
  // 提交表单
  const handleSubmit = useCallback(async () => {
    const { labelList, ...others } = await editField.validateFields();
    const labels = (labelList || []).reduce((prev, curr) => {
      prev[curr.key] = curr.value;
      return prev;
    }, {} as Record<string, any>);
    const payload: any = {
      ...others,
      labels,
    };

    setPending(true);
    try {
      if (mode === 'ADD') {
        await postRequest(APIS.createPrometheus, { data: payload });
      } else {
        await postRequest(APIS.updatePrometheus, { data: payload });
      }

      message.success('保存成功！');
      onSave?.();
    } finally {
      setPending(false);
    }
  }, [mode, initData, onSave]);

  return (
    <Drawer
      title={mode === 'EDIT' ? '编辑监控' : '添加监控'}
      visible={mode !== 'HIDE'}
      maskClosable={false}
      onClose={onClose}
      width={800}
      footer={
        <div className="drawer-custom-footer">
          <Button type="primary" onClick={handleSubmit} loading={pending}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editField} labelCol={{ flex: '100px' }}>
        <FormItem label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入" disabled={mode === 'EDIT'} {...fieldCommon} />
        </FormItem>
        <FormItem label="应用code" name="appCode" rules={[{ required: true, message: '请选择应用' }]}>
          {mode === 'ADD' ? (
            <Input
              placeholder="请输入"
              // options={appCodeOptions}
              // onChange={handleAppCodeChange}
              {...fieldCommon}
              // showSearch
            />
          ) : (
            <Input disabled {...fieldCommon} />
          )}
        </FormItem>
        <FormItem label="环境code" name="envCode" rules={[{ required: true, message: '请选择环境' }]}>
          {mode === 'ADD' ? (
            <Select placeholder="请选择" options={envCodeList} loading={envCodeLoading} {...fieldCommon} showSearch />
          ) : (
            <Input disabled {...fieldCommon} />
          )}
        </FormItem>
        <FormItem label="采集频率" name="interval" initialValue={intervalOptions[0]?.value}>
          <Select options={intervalOptions} placeholder="请选择" {...fieldCommon} />
        </FormItem>
        <FormItem label="URL" name="metricsUrl" rules={[{ required: true, type: 'url', message: '请输入正确的URL' }]}>
          <Input placeholder="示例: http://127.0.0.1:8080/health" />
        </FormItem>
        <FormItem label="MatchLabels" initialValue={[]}>
          <h4 style={{ color: '#999' }}>MatchLabels已设置默认值，无特殊需求，请不要填写</h4>
          <FormItem
            name="labelList"
            rules={[
              {
                validator: async (_, value: KVProps[]) => {
                  if (value?.find((n) => !n.key)) {
                    throw new Error('MatchLabels 的 key 必填');
                  }
                },
                validateTrigger: [],
              },
            ]}
          >
            <EditorTable
              columns={[
                { dataIndex: 'key', title: '键' },
                { dataIndex: 'value', title: '值' },
              ]}
            />
          </FormItem>
        </FormItem>
      </Form>
    </Drawer>
  );
}

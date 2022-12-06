import React, { useState, useEffect } from 'react';
import { Button, Divider, Drawer, Form, Input, message, Select } from '@cffe/h2o-design';
import AceEditor from '@/components/ace-editor';
import { createGraphTable, getGraphGraphDatasouceList, graphTemplateList, updateGraphTable } from '../../service';
import type { TMode } from '../../interfaces';

interface IEditorDrawer {
  visible: boolean;
  mode: TMode;
  cluster: number | null | undefined;
  clusterList: any;
  onClose: () => any;
  boardInfo: any;
  loadGraphTable: () => any;
  categoryList: any[];
}

const createTypeOptions = [
  {
    label: '',
    value: '空仪表盘',
  },
  {
    label: 'graphJson',
    value: 'graphJson',
  },
  {
    label: '模版选择',
    value: 'graphTemplate',
  },
  {
    label: 'grafanaId',
    value: 'grafanaId',
  },
];

const EditorDrawer = (props: IEditorDrawer) => {
  const { visible, mode, cluster, boardInfo, clusterList, loadGraphTable, categoryList } = props;
  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>(null);
  const [dataSourceType, setDataSourceType] = useState<string>('');
  const [dataSourceOptions, setDataSourceOptions] = useState<any[]>([]);
  const [templateOptions, setTemplateOptions] = useState<any[]>([]);

  const createType = Form.useWatch('createType', formRef);
  useEffect(() => {
    if (visible) {
      void getGraphTemplateList();
      if (mode === 'edit') {
        setDetail(boardInfo);
        setDataSourceType(boardInfo?.dsType);
        const graphJson = JSON.stringify(JSON.parse(boardInfo?.graphJson || '{}'), null, 2);
        formRef.setFieldsValue({ ...boardInfo, graphJson, clusterCode: cluster });
      } else if (mode === 'add') {
        setDetail(null);
      }
    }
  }, [mode, boardInfo, visible]);

  useEffect(() => {
    const clusterCode = formRef.getFieldValue('clusterCode') || cluster;
    if (dataSourceType && clusterCode) {
      onDataSourceTypeChange({ dsType: dataSourceType, clusterCode });
    }
  }, [dataSourceType]);

  const handleSubmit = async () => {
    setLoading(true);
    let formValue = await formRef.validateFields();
    let body = {};
    // graphJson通过body传参数。
    try {
      const graphJson = formValue.graphJson && JSON.parse(formValue?.graphJson);
      body = { graphJson };
    } catch (e) {
      message.error('JSON格式不正确');
      return;
    }
    // 删除query params中的graphJson
    try {
      delete formValue.graphJson;
    } catch (e) {}

    if (mode === 'edit') {
      formValue = {
        ...formValue,
        graphUuid: detail.graphUuid,
        // clusterCode: cluster
      };
      updateGraphTable(formValue, body)
        .then((res) => {
          if (res?.success) {
            handleClose();
            loadGraphTable();
            message.success('修改成功');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (mode === 'add') {
      formValue = {
        ...formValue,
        // clusterCode: cluster
      };
      createGraphTable(formValue, body)
        .then((res) => {
          if (res?.success) {
            handleClose();
            message.success('创建成功');
            loadGraphTable();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onDataSourceTypeChange = async (value: any) => {
    let { clusterCode, dsType } = value;
    if (!clusterCode) {
      clusterCode = formRef.getFieldValue('clusterCode');
    }
    if (!dsType) {
      dsType = formRef.getFieldValue('dsType');
    }

    if (dsType) {
      // getGraphTemplateList(dsType);
    }
    if (!clusterCode || !dsType) {
      return;
    }

    const data = {
      clusterCode: clusterCode,
      pageSize: -1,
      dsType: dsType,
    };
    const res = await getGraphGraphDatasouceList(data);
    if (Array.isArray(res?.data?.dataSource) && res.data.dataSource.length > 0) {
      const data = res.data.dataSource.map((item: any) => {
        return {
          label: item.name,
          value: item.uuid,
          key: item.uuid,
          ...item,
        };
      });
      setDataSourceOptions(data);
    }
  };

  const getGraphTemplateList = async (value?: any) => {
    const res1 = await graphTemplateList(value);
    if (Array.isArray(res1?.data?.dataSource) && res1.data.dataSource.length > 0) {
      const data = res1.data.dataSource.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
          key: item.id,
          ...item,
        };
      });
      setTemplateOptions(data);
    }
  };

  const handleClose = () => {
    props.onClose();
    setDetail(null);
    formRef.resetFields();
  };

  return (
    <Drawer
      title={mode === 'edit' ? '编辑大盘' : '创建大盘'}
      onClose={handleClose}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={handleClose}>
            取消
          </Button>
        </div>
      }
      destroyOnClose
      visible={visible}
    >
      <Form form={formRef} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
        <Form.Item label="大盘创建方式" name="createType" initialValue={'graphTemplate'}>
          <Select options={createTypeOptions} />
        </Form.Item>
        {createType === 'graphTemplate' && (
          <Form.Item label="模版" name="graphTemplateId">
            <Select
              options={templateOptions}
              filterOption={(input, option) => {
                // @ts-ignore
                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              onChange={(id) => {
                let item = templateOptions.find((item) => item.value === id);
                if (item) {
                  formRef.setFieldsValue({
                    ...item,
                    graphName: item.name,
                  });
                }
              }}
              showSearch
            />
          </Form.Item>
        )}
        {createType === 'grafanaId' && (
          <Form.Item label="GrafanaID" name="grafanaId">
            <Input />
          </Form.Item>
        )}
        {createType === 'graphJson' && (
          <Form.Item label="JSON" name="graphJson">
            <AceEditor height={window.innerHeight - 170} mode="json" />
          </Form.Item>
        )}
        <Divider />
        <Form.Item label="名称" name="graphName" rules={[{ required: true, message: '请输入名称!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="分类" name="graphType" rules={[{ required: true, message: '请选择分类!' }]}>
          <Select>
            {categoryList.map(
              (item, i) =>
                item !== '全部' && (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ),
            )}
          </Select>
        </Form.Item>
        <Form.Item label="数据源类型" name="dsType" rules={[{ required: true, message: '请选择数据源类型!' }]}>
          <Select
            options={[
              {
                label: 'prometheus',
                value: 'prometheus',
              },
              {
                label: 'elasticsearch',
                value: 'elasticsearch',
              },
            ]}
            onChange={(value) => {
              formRef.setFieldValue('graphTemplateId', undefined);
              onDataSourceTypeChange({ dsType: value });
            }}
          />
        </Form.Item>
        <Form.Item label="集群选择" name="clusterCode" rules={[{ required: true, message: '请选择集群!' }]}>
          <Select
            showSearch
            allowClear
            style={{ width: '250px' }}
            options={clusterList}
            onChange={(value) => {
              onDataSourceTypeChange({ clusterCode: value });
            }}
          />
        </Form.Item>
        <Form.Item label="数据源" name="dsUuid" rules={[{ required: true, message: '请选择数据源!' }]}>
          <Select options={dataSourceOptions} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditorDrawer;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, message, Form } from '@cffe/h2o-design';
import { ConsoleSqlOutlined, PlusOutlined } from '@ant-design/icons';
import { addPipelineUrl, updatePipelineUrl, deletePipeline } from '@/pages/application/service';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import ETable from '@/components/editable-table';
import appConfig from '@/app.config';

export default function PipeLineManage(props: any) {
  const { visible, handleCancel, dataSource, setDatasource, envTypeCode, appData, onSave } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const { appCode } = appData || {};
  const addBottonText = '新增流水线';
  const deleteText = '确定删除该条流水线吗？';
  const tableRef = useRef<any>();

  useEffect(() => {
    if (!visible && tableRef.current) {
      tableRef.current.reset();
    }
  }, [visible]);

  // 删除流水线
  const handleDel = async (record: any) => {
    try {
      setLoading(true);
      const res = await delRequest(`${appConfig.apiPrefix}/appManage/appPipeline/delete/${record.pipelineCode}`);
      if (res?.success) {
        message.success('删除成功！');
        onSave?.();
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (rowKey: any, data: any) => {
    const { pipelineName, pipelineCode } = data;
    const url = data.add ? addPipelineUrl : updatePipelineUrl;
    const successMessage = data.add ? '新增成功' : '编辑成功';
    let params;
    if (data.add) {
      params = { appCode, pipelineName, pipelineCode, envTypeCode };
    } else {
      params = { pipelineName, pipelineCode };
    }
    try {
      setLoading(true);
      const res = await (data.add ? postRequest : putRequest)(url, { data: { ...params } });
      if (res?.success) {
        message.success(`${successMessage}`);
        onSave?.();
        setLoading(false);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };
  const columns: any = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 80,
    //   editable: false,
    // },
    {
      title: '流水线名称',
      dataIndex: 'pipelineName',
      key: 'pipelineName',
      formItemProps: () => {
        return {
          errorType: 'default',
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      ellipsis: true,
      width: 150,
    },
    {
      title: '流水线code',
      dataIndex: 'pipelineCode',
      // 新增的时候流水线code可以写入
      editable: (text: any, record: any) => {
        return !!record.add;
      },
      key: 'pipelineCode',
      formItemProps: () => {
        return {
          errorType: 'default',
          rules: [{ required: true, message: '不能包含中文', pattern: /^[^\u4e00-\u9fa5]*$/ }],
        };
      },
      ellipsis: true,
      width: 150,
    },
  ];
  return (
    <Modal width={800} title="流水线管理" visible={visible} footer={false} onCancel={handleCancel}>
      <div style={{ marginTop: '20px' }}>
        <ETable
          ref={tableRef}
          dataSource={dataSource}
          columns={columns}
          addBottonText={addBottonText}
          deleteText={deleteText}
          handleDelete={handleDel}
          handleSave={handleSave}
          loading={loading}
        ></ETable>
      </div>
    </Modal>
  );
}

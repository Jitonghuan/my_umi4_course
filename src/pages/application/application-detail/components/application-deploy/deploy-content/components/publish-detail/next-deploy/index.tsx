import React, { useState } from 'react';
import { Modal, message, Checkbox, Form, Select } from 'antd';
import { deployReuse, newDeployReuse } from '@/pages/application/service';
interface Iprops {
  deployNextEnvVisible: boolean;
  pipelineOptions: any
  onSave: () => void;
  onClose: () => void;
  nextEnvDataList: any;
  curPipelineCode: string;
  newPublish: boolean;
}
export default function EntryProject(props: Iprops) {
  const { deployNextEnvVisible, onClose, onSave, pipelineOptions, nextEnvDataList, curPipelineCode, newPublish } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm()
  // 确认发布操作
  const confirmPublishNext = async () => {
    const params = await form.validateFields()
    if (!params?.pipelineCode) {
      message.error('请选择要发布的流水线！');
      return;
    }
    setConfirmLoading(true);
    try {
      const deploy = newPublish ? newDeployReuse : deployReuse;
      const res = await deploy({
        // envCodes: deployNextEnv,
        // pipelineCode: selectPipeline,
        ...params,
        reusePipelineCode: curPipelineCode,
      });
      if (res?.success) {
        message.success('操作成功，正在部署中...');
        onSave()
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      key="deployNext"
      title="选择发布环境"
      visible={deployNextEnvVisible}
      confirmLoading={confirmLoading}
      onOk={confirmPublishNext}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
    >
      <div>
        <Form form={form} preserve={false}>
          <Form.Item label="选择流水线" name="pipelineCode" rules={[{ required: true, message: '请输入' }]}>
            <Select
              options={pipelineOptions}
              style={{ width: '240px', marginRight: '20px' }}
              showSearch
              optionFilterProp="label"
              // labelInValue
              filterOption={(input, option) => {
                //@ts-ignore
                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            ></Select>

          </Form.Item>
          <Form.Item name="envCodes" rules={[{ required: true, message: '请输入' }]}>
            <Checkbox.Group options={nextEnvDataList} />

          </Form.Item>

        </Form>



      </div>
    </Modal>
  )
}
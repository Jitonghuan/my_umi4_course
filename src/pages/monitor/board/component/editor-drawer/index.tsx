import React, { useState } from 'react'
import { Button, Divider, Drawer, Form, Input, Select } from '@cffe/h2o-design'
import AceEditor from '@/components/ace-editor';

type TMode = 'edit' | 'add';
interface IEditorDrawer {
  visible: boolean;
  mode: TMode;
  onClose: () => any;
}

const EditorDrawer = (props: IEditorDrawer) => {
  const { visible, mode } = props
  const [formRef] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = () => {

  }

  return (
    <Drawer
      title={mode === 'edit' ? "编辑大盘" : "创建大盘"}
      onClose={props.onClose}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={props.onClose}>
            取消
          </Button>
        </div>
      }
      destroyOnClose
      visible={visible}
    >
      <Form
        form={formRef}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label='名称' name='name' rules={[{ required: true, message: '请输入名称!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='分类' name='category' rules={[{ required: true, message: '请选择分类!' }]}>
          <Select />
        </Form.Item>
        <Form.Item label='数据源名称' name='datasourceName' rules={[{ required: true, message: '请选择数据源类型!' }]}>
          <Select />
        </Form.Item>
        <Form.Item label='数据源类型' name='datasourceCategory' rules={[{ required: true, message: '请选择数据源名称!' }]}>
          <Select />
        </Form.Item>
        <Divider />
        <Form.Item label='模版' name='datasourceCategory'>
          <Select />
        </Form.Item>
        <Form.Item label='GrafanaID' name='datasourceCategory'>
          <Input />
        </Form.Item>
        <Form.Item label='JSON' name='datasourceCategory'>
          <AceEditor height={window.innerHeight - 170} mode="json" readOnly />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default EditorDrawer


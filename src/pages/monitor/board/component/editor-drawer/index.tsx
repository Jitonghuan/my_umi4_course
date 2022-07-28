import React, { useState, useEffect } from 'react'
import { Button, Divider, Drawer, Form, Input, Select } from '@cffe/h2o-design'
import AceEditor from '@/components/ace-editor';
import { createGraphTable, getGraphGraphDatasouceList, graphTemplateList, updateGraphTable } from '../../service';
import type { TMode } from '../../interfaces';


interface IEditorDrawer {
  visible: boolean;
  mode: TMode;
  cluster: string;
  onClose: () => any;
  boardInfo: any
}

const EditorDrawer = (props: IEditorDrawer) => {
  const { visible, mode, cluster, boardInfo } = props
  const [formRef] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>(null)
  const [dataSourceType, setDataSourceType] = useState<string>('')
  const [dataSourceOptions, setDataSourceOptions] = useState<any[]>([])

  useEffect(() => {
    if (visible) {
      if (mode === 'edit') {
        console.log(boardInfo)
        setDetail(boardInfo)
        setDataSourceType(boardInfo.GraphType);
        formRef.setFieldsValue(boardInfo);
      } else if (mode === 'add') {
        setDetail(null)
      }
    }
  }, [visible, boardInfo])

  useEffect(() => {
    dataSourceType && onDataSourceTypeChange(dataSourceType)
  }, [dataSourceType])


  const handleSubmit = async () => {
    let formValue = formRef.getFieldsValue()
    if (mode === 'edit') {
      formValue = {
        ...formValue,
        graphUuid: detail
      }
      let res = await updateGraphTable(formValue)
      props.onClose()
    } else if (mode === 'add') {
      let res = await createGraphTable(formValue)
      props.onClose()
    }
  }

  const onDataSourceTypeChange = async (value: string) => {
    const res = await getGraphGraphDatasouceList(cluster, value);
    if (Array.isArray(res.data) && res.data.length > 0) {
      const data = res.data.map((item) => {
        return {
          label: item.Name,
          value: item.Uuid,
          ...item
        }
      })
      setDataSourceOptions(data)
    }

    const res1 = await graphTemplateList(value)
    if (Array.isArray(res1.data) && res.data.length > 0) {
      const data = res1.data.map((item) => {
        return {
          label: item.name,
          value: item.name,
          ...item
        }
      })
      setDataSourceOptions(data)
    }
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
        <Form.Item label='名称' name='GraphName' rules={[{ required: true, message: '请输入名称!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='分类' name='GraphType' rules={[{ required: true, message: '请选择分类!' }]}>
          <Select options={[
            {
              label: "业务监控大盘",
              value: "业务监控大盘",
            },
            {
              label: "集群监控大盘",
              value: "集群监控大盘",
            }
          ]}
          />
        </Form.Item>
        <Form.Item label='数据源类型' name='DsType' rules={[{ required: true, message: '请选择数据源类型!' }]}>
          <Select
            options={[
              {
                label: 'prometheus',
                value: 'prometheus'
              },
              {
                label: 'elasticsearch',
                value: 'elasticsearch'
              }
            ]}
            onChange={onDataSourceTypeChange}
          />
        </Form.Item>
        <Form.Item label='数据源' name='dsUuid' rules={[{ required: true, message: '请选择数据源!' }]}>
          <Select options={dataSourceOptions} />
        </Form.Item>
        <Divider />
        <Form.Item label='模版' name='graphTemplateName'>
          <Select />
        </Form.Item>
        <Form.Item label='GrafanaID' name='grafanaId'>
          <Input />
        </Form.Item>
        <Form.Item label='JSON' name='graphJson'>
          <AceEditor height={window.innerHeight - 170} mode="json" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default EditorDrawer


import React, { useState, useEffect } from 'react'
import { Button, Divider, Drawer, Form, Input, message, Select } from '@cffe/h2o-design'
import AceEditor from '@/components/ace-editor';
import { createGraphTable, getGraphGraphDatasouceList, graphTemplateList, updateGraphTable } from '../../service';
import type { TMode } from '../../interfaces';


interface IEditorDrawer {
  visible: boolean;
  mode: TMode;
  cluster: number | null | undefined;
  onClose: () => any;
  boardInfo: any;
  loadGraphTable: () => any
}

const createTypeOptions = [
  {
    label: "graphJson",
    value: "graphJson"
  },
  {
    label: "模版选择",
    value: "graphTemplate"
  },
  {
    label: "grafanaId",
    value: "grafanaId"
  }
]

const EditorDrawer = (props: IEditorDrawer) => {
  const { visible, mode, cluster, boardInfo, loadGraphTable } = props
  const [formRef] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>(null)
  const [dataSourceType, setDataSourceType] = useState<string>('')
  const [dataSourceOptions, setDataSourceOptions] = useState<any[]>([])
  const [templateOptions, setTemplateOptions] = useState<any[]>([])

  const createType = Form.useWatch("createType", formRef)
  useEffect(() => {
    if (visible) {
      if (mode === 'edit') {
        setDetail(boardInfo)
        setDataSourceType(boardInfo?.dsType);
        const graphJson = JSON.stringify(JSON.parse(boardInfo?.graphJson || "{}"), null, 2);
        formRef.setFieldsValue({ ...boardInfo, graphJson });
      } else if (mode === 'add') {
        setDetail(null)
      }
    }
  }, [mode, boardInfo])

  useEffect(() => {
    dataSourceType && onDataSourceTypeChange(dataSourceType)
  }, [dataSourceType])


  const handleSubmit = async () => {
    setLoading(true)
    let formValue = await formRef.validateFields()
    let body = {};
    // graphJson通过body传参数。
    try {
      const graphJson = formValue.graphJson && JSON.parse(formValue?.graphJson)
      body = { graphJson }
    } catch (e) {
      message.error('JSON格式不正确')
      return
    }
    // 删除query params中的graphJson
    try {
      delete formValue.graphJson
    } catch (e) { }

    if (mode === 'edit') {
      formValue = {
        ...formValue,
        graphUuid: detail.graphUuid,
        clusterCode: cluster
      }
      updateGraphTable(formValue, body).then((res) => {
        if (res?.success) {
          handleClose()
          loadGraphTable();
          message.success('修改成功')
        }
      }).finally(() => {
        setLoading(false)
      })
    } else if (mode === 'add') {
      formValue = {
        ...formValue,
        clusterCode: cluster
      }
      createGraphTable(formValue, body).then((res) => {
        if (res?.success) {
          handleClose()
          message.success('创建成功')
          loadGraphTable();
        }
      }).finally(() => {
        setLoading(false)
      })
    }
  }

  const onDataSourceTypeChange = async (value: any) => {
    const data = {
      clusterCode: cluster,
      pageSize: -1,
      dsType: value,
    }
    const res = await getGraphGraphDatasouceList(data);
    if (Array.isArray(res?.data?.dataSource) && res.data.dataSource.length > 0) {
      const data = res.data.dataSource.map((item: any) => {
        return {
          label: item.name,
          value: item.uuid,
          key: item.uuid,
          ...item
        }
      })
      setDataSourceOptions(data)
    }

    const res1 = await graphTemplateList(value)
    if (Array.isArray(res1?.data?.dataSource) && res.data.dataSource.length > 0) {
      const data = res1.data.dataSource.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
          key: item.id,
          ...item
        }
      })
      setTemplateOptions(data)
    }
  }

  const handleClose = () => {
    props.onClose();
    setDetail(null);
    formRef.resetFields()
  }

  return (
    <Drawer
      title={mode === 'edit' ? "编辑大盘" : "创建大盘"}
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
      <Form
        form={formRef}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label='名称' name='graphName' rules={[{ required: true, message: '请输入名称!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='分类' name='graphType' rules={[{ required: true, message: '请选择分类!' }]}>
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
        <Form.Item label='数据源类型' name='dsType' rules={[{ required: true, message: '请选择数据源类型!' }]}>
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
            onChange={(value) => {
              formRef.setFieldValue('graphTemplateId', undefined)
              onDataSourceTypeChange(value)
              }
            }
          />
        </Form.Item>
        <Form.Item label='数据源' name='dsUuid' rules={[{ required: true, message: '请选择数据源!' }]}>
          <Select options={dataSourceOptions} />
        </Form.Item>
        <Form.Item label='大盘创建方式' name='createType' initialValue={"graphTemplate"}>
          <Select options={createTypeOptions} />
        </Form.Item>
        <Divider />
        {
          createType === "graphTemplate" &&
          <Form.Item label='模版' name='graphTemplateId'>
            <Select options={templateOptions} />
          </Form.Item>
        }
        {
          createType === "grafanaId" &&
          <Form.Item label='GrafanaID' name='grafanaId'>
            <Input />
          </Form.Item>
        }
        {
          createType === "graphJson" &&
          <Form.Item label='JSON' name='graphJson'>
            <AceEditor height={window.innerHeight - 170} mode="json" />
          </Form.Item>
        }

      </Form>
    </Drawer>
  )
}

export default EditorDrawer


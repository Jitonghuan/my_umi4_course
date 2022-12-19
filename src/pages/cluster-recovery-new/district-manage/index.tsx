import React, {useEffect, useState} from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { Button, Form, Input, Popconfirm, Table, Modal, message,Select } from 'antd';
import { getRequest, postRequest, putRequest, delRequest } from '@/utils/request';
import { addHospitalDistrictInfo, updateHospitalDistrictInfo, getHospitalDistrictInfo, deleteHospitalDistrictInfo,getEnvListApi } from '../service';
import { getCommonEnvCode } from '@/pages/cluster-recovery-new/service';
import {identifiOptions} from './type'
import './index.less';

const DistrictManage = () => {
  const [data, setData] = useState([]);
  const [envCode, setEnvCode]= useState();
  const [mode, setMode] = useState<string>('ADD');
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [envOptions,setEnvOptions]=useState<any>([])
  const [envLoading,setEnvLoading]= useState<boolean>(false);

  useEffect(() => {
    getEnvCode();
    getEnvOptions()
  }, []);

  function getEnvCode() {
    getRequest(getCommonEnvCode)
      .then((result) => {
        if (result?.success && result.data) {
          setEnvCode(result.data);
          onSearch(result.data);
        }
      })
  }

  function onSearch(param?: string) {
    getRequest(getHospitalDistrictInfo, { data: { envCode: param || envCode } }).then((resp) => {
      if (resp?.success) {
        setData(resp.data || []);
      }
    });
  }

  function onAddClick() {
    setMode('ADD');
    setVisible(true);
  }

  function onEditClick(record: any) {
    setMode('EDIT');
    setVisible(true);
    form.setFieldsValue({
      hospitalDistrictName: record.hospitalDistrictName,
      hospitalDistrictCode: record.hospitalDistrictCode,
      hospitalDistrictIp: record.hospitalDistrictIp,
      envCode: record.envCode,
      description: record.description,
      id: record.id,
      flowMark:record?.flowMark
    });
  }

  async function onDelClick(record: any) {
    const res = await delRequest(`${deleteHospitalDistrictInfo}?id=${record.id}`, {
      data: {
        id: record.id
      }
    })
    if (res.success) {
      message.success('删除成功');
      onSearch();
    }
  }

  function handleSubmit() {
    form.validateFields().then(async (params) => {
      let res = null;
      setLoading(true);
      if (mode === 'ADD') {
        res = await postRequest(addHospitalDistrictInfo, {
          data: params
        });
      } else {
        res = await putRequest(updateHospitalDistrictInfo, {
          data: params
        })
      }
      setLoading(false);
      if (res?.success) {
        message.success(res.data || '成功～');
        onClose();
        onSearch();
      }
    })
  }

  function onClose() {
    form.resetFields();
    setVisible(false);
  }
  
  const getEnvOptions=()=>{
    setEnvLoading(true)
    setEnvOptions([])
    getRequest(getEnvListApi).then((res)=>{
      if(res?.success){
      const data=  res?.data?.map((item:string)=>({
         label:item,
         value:item,
       }))

       setEnvOptions(data)

      }

    }).finally(()=>{
      setEnvLoading(false)
    })
  }

  return (
      <PageContainer>
          <ContentCard>
        
      <div className="district-header">
          <div className="table-caption">
              <div className="caption-left"><h3>机构列表</h3></div>
              <div className="caption-right">
              <Button type="primary" onClick={onAddClick}>新增机构</Button>
              </div>

          </div>
       
      </div>
      <Table
        scroll={{x: '100%'}}
        bordered
        dataSource={data}
        columns={[
          {
            title: '机构名称',
            dataIndex: 'hospitalDistrictName',
          },
          {
            title: '流量标识',
            dataIndex: 'flowMark',
          },
          {
            title: '流量策略',
            dataIndex: 'hospitalDistrictIp',
          },
          {
            title: '描述',
            dataIndex: 'description',
          },
          {
            width: 140,
            title: '操作',
            fixed: 'right',
            dataIndex: 'operate',
            align: 'center',
            render: (_: any, record: any, index: number) => (
              <div className="action-cell">
                <a onClick={() => onEditClick(record)}>编辑</a>
                <Popconfirm
                  title="确定要删除该机构吗？"
                  onConfirm={() => onDelClick(record)}
                  okText="确定"
                  cancelText="取消"
                  placement="topLeft"
                >
                  <a>删除</a>
                </Popconfirm>
              </div>
            ),
          },
        ]}
        />
      <Modal
        destroyOnClose
        width={600}
        title={mode === 'ADD' ? '新增机构' : '编辑机构'}
        visible={visible}
        onOk={handleSubmit}
        onCancel={onClose}
        confirmLoading={loading}
        maskClosable={false}
      >
        <Form form={form} labelCol={{ flex: '100px' }}>
          <Form.Item label="机构名称" name="hospitalDistrictName" rules={[{ required: true, message: '请输入机构名称' }]}>
            <Input />
          </Form.Item>
         
          <Form.Item label="机构Code" tooltip="机构唯一标识" name="hospitalDistrictCode" rules={[{ required: true, message: '请输入机构Code' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="环境Code" name="envCode" rules={[{ required: true, message: '请输入环境code' }]}>
            <Select showSearch allowClear options={envOptions} loading={envLoading} />
          </Form.Item>
          <Form.Item label="流量标识" name="flowMark" rules={[{ required: true, message: '请输入流量标识' }]}>
            <Select  options={identifiOptions}/>
          </Form.Item>
         
          <Form.Item label="流量信息" name="hospitalDistrictIp" rules={[{ required: true, message: '请输入IP信息' }]}>
            <Input placeholder="IP或ID, 当IP有多个网段时，多个网段用 | 分割" />
          </Form.Item>
          <Form.Item label="描述" name="description" rules={[{ required: true, message: '请输入描述' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="id" name="id" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
   

          </ContentCard>
        

      </PageContainer>
   
  )
}

export default DistrictManage;

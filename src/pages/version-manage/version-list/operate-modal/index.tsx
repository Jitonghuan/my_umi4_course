import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Tag, Form, Button, Table, Modal, Input, Switch, Radio, Select, Space,message } from 'antd';
import { downloadList } from '../schema';
import { useReleaseModalOption } from '../../hook';
import {downLoadUrl,releaseMerge} from '../../service'
import './index.less';

export default function OperateModal(props: any) {
    const { visible, onClose, action, initData, appCategory ,onSave} = props;
    const [data, setData] = useState<any>([]);
    const [releaseOptions] = useReleaseModalOption({ id:initData?.id,visible });
    const [value, setValue] = useState<any>();
    const [downLoadForm] = Form.useForm();
    const [form] = Form.useForm();
    const [loading,setLoading]=useState<boolean>(false)
    

    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible]);

    const columns = useMemo(() => downloadList(), [data])

    const handleSubmit = async () => {
      
        if (action === 'downloadPackage') {
            const value = await downLoadForm.validateFields();
            window.open(`${downLoadUrl}?id=${initData?.id}&reason=${value?.reason}`,'_blank')
            onClose()
        }
        if(action === 'merge'){
            setLoading(true)
            const value = await form.validateFields();
            releaseMerge({id:initData?.id,mergedId:value?.mergedId}).then((res)=>{
                if(res?.success){
                    message.success("操作成功！")
                    onSave()
                }

            }).finally(()=>{
                setLoading(false)
            })
        }

    };
    return (
        <Modal
            title={
                <div style={{ position: 'relative' }}>
                    当前版本：{initData?.releaseNumber || '--'}
                    <span style={{ right: '40px', position: "absolute" }}>
                        <span className='group-code'>{appCategory?.value || '---'}</span>
                        <span className='group-label'>{appCategory?.label || '---'}</span>
                    </span>
                </div>
            }
            visible={visible}
            onCancel={onClose}
            width={700}
            footer={
                action !== 'downloadList' ? <div className="drawer-footer">
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        {action === 'downloadPackage' ? '确认下载' : '确认'}
                    </Button>
                    <Button type="default" onClick={onClose}>
                        取消
                    </Button>
                </div> : null
            }
        >
            {action === 'merge' &&
                <Form form={form} labelCol={{ flex: '120px' }}>
                    <Form.Item label="选择合并版本：" name="mergedId" rules={[{ required: true, message: '请输入' }]}>
                        <Select style={{ width: 240 }} options={releaseOptions} />
                    </Form.Item>
                </Form>
            }

            {action === 'downloadList' &&
                <>
                    <div style={{ marginBottom: '10px' }}>下载列表</div>
                    <Table
                        dataSource={data}
                        bordered
                        rowKey="id"
                        pagination={false}
                        columns={columns}
                    />
                </>
            }
            {
                action === 'downloadPackage' &&
                <>
                    <Form form={downLoadForm}>
                        {/* <Form.Item name="packType" label="下载内容">
                            <Radio.Group>
                                <Radio value="a">全部</Radio>
                                <Radio value="b">镜像包</Radio>
                                <Radio value="c">XX包</Radio>
                            </Radio.Group>
                        </Form.Item> */}
                        <Form.Item label='下载理由' name='reason' rules={[{ required: true, message: '请输入下载理由' }]}>
                            <Input.TextArea style={{ width: 350 }} />
                        </Form.Item>
                    </Form>
                </>
            }
        </Modal>
    );
}

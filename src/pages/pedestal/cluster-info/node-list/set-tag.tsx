import React, { useState, useMemo, useCallback, useEffect, useContext } from 'react';
import { Modal, Tag, Radio, Input, Form, Button, Space, Select, message } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { nodeUpdate } from '../service'
import clusterContext from '../main/context'
import './index.less'

const behaviorOptions = [
    { lable: 'NoSchedule', value: 'NoSchedule' },
    { lable: 'PreferNoSchedule', value: 'PreferNoSchedule' },
    { lable: 'NoExecute', value: 'NoExecute' },
]
export default function SetTag(props: any) {
    const { visible, onCancel, initTags, onSubmit, baseTags, dirtyTags } = props;
    const { selectCluster } = useContext(clusterContext);
    const [removeTags, setRemoveTags] = useState([]) as any;
    const tags = useMemo(() =>
        (baseTags || []).concat((dirtyTags || []))
            .filter((e: any) => !removeTags.includes(e)), [removeTags, baseTags, dirtyTags]);
    const [tagType, setTagType] = useState<string>('base')
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setTagType('base')
            form.setFieldsValue({ 'base-tags': [undefined] })
        }
    }, [visible])

    const handleSubmit = async () => {
        const formValue = await form.validateFields();
        if (formValue) {
            let labels: any = {};
            let taints: any = [];
            const value = formValue['base-tags'];
            tags.forEach((item: any) => {
                item.effect ? taints.push(item) : labels[item.key] = item.value
            })
            if (tagType === 'base') {
                value.forEach((item: any) => labels[item.key] = item.value)
            } else {
                taints = taints.concat(value)
            }
            const res = await nodeUpdate({ labels, taints, clusterCode: selectCluster });
            if (res?.success) {
                message.success('操作成功！')
                onSubmit();
            }
        }
    }
    const onTypeChange = (e: any) => {
        setTagType(e.target.value)
        form.resetFields();
        form.setFieldsValue({ 'base-tags': [undefined] })
    }

    return (
        <Modal width={600} title="显示详情" visible={visible} onOk={handleSubmit} onCancel={onCancel}>
            <p>已有标签</p>
            <div className='tag-wrapper'>
                {tags.map((item: any, i: any) => {
                    return <Tag key={i}
                        // color={item.effect ? "blue" : "green"}
                        color='green'
                        onClose={(e: any) => {
                            e.preventDefault()
                            setRemoveTags([...removeTags, item])
                        }}
                        closable>{`${item.key}:${item.value}`}</Tag>
                })}
            </div>
            <div style={{ marginBottom: '10px' }}>
                标签类型： <Radio.Group value={tagType} onChange={onTypeChange}>
                    <Radio value="base">基础标签 </Radio>
                    <Radio value="dirty"> 污点标签 </Radio>
                </Radio.Group>
            </div>
            {/* {tagType !== '' && (<Tags tags={commitTags} onChange={onChange} tagType={tagType} />)} */}
            <div className='form-wrapper'>
                <Form form={form} name="base" autoComplete="off" colon={false} >
                    <Form.List name="base-tags">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(field => (
                                    <Space key={field.key} align="baseline">
                                        <Form.Item>
                                            <MinusCircleOutlined className="tag-icon"
                                                onClick={() => remove(field.name)}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prevValues, curValues) =>
                                                prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                            }
                                        >
                                            {() => (
                                                <Form.Item
                                                    {...field}
                                                    label="KEY"
                                                    name={[field.name, 'key']}
                                                    rules={[{ required: true, message: '此项为必填项' }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            )}
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            label="Value"
                                            name={[field.name, 'value']}
                                        >
                                            <Input />
                                        </Form.Item>
                                        {tagType === 'dirty' && (
                                            <Form.Item
                                                {...field}
                                                label="Behavior"
                                                name={[field.name, 'effect']}
                                                rules={[{ required: true, message: '此项为必填项' }]}
                                            >
                                                <Select
                                                    options={behaviorOptions}
                                                    style={{ width: '150px' }}
                                                />
                                            </Form.Item>
                                        )}
                                        <Form.Item>
                                            <PlusCircleOutlined className="tag-icon" onClick={() => add()} />
                                        </Form.Item>
                                    </Space>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </div>
        </Modal>
    )
}
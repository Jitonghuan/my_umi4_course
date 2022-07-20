import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Tag, Form, Button, Row, Col, Input, Switch, Radio, Select, Space } from 'antd';
import ReactCron from '@/components/qnn-react-cron';
import { PlusCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './index.less'


const tags = ['111', '222', '333']
export default function AddDrawer(props: any) {
    const { visible, onClose } = props;
    const [form] = Form.useForm();
    const [cronVisible, setCronVisible] = useState<boolean>(false)
    const [type, setType] = useState<number>(1);
    const [workObj, setWorkObj] = useState('');
    useEffect(() => {
        if (visible) {
            form.resetFields();
            form.setFieldsValue({ 'base-tags': [{ key: '', value: '' }] })
        }
    }, [visible])

    const handleSubmit = () => {

    }
    return <>
        <ReactCron
            visible={cronVisible}
            onCancle={() => {
                setCronVisible(false);
            }}
            curTimeExpress={(express: string) => {
                // setCurTimeExpress(express);
                form.setFieldsValue({
                    timeExpression: express,
                });
            }}
        />
        <Drawer
            width={650}
            title='新增集群任务'
            placement="right"
            visible={visible}
            onClose={onClose}
            maskClosable={false}
            footer={
                <div className="drawer-footer">
                    <Button type="primary" onClick={handleSubmit} >
                        保存
          </Button>
                    <Button type="default" onClick={onClose}>
                        取消
          </Button>
                </div>
            }
        >
            <Form form={form} labelCol={{ flex: '120px' }}>
                <Form.Item label="任务名称" name="name" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 400 }} />
                </Form.Item>
                <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择' }]}>
                    <Radio.Group value={type} onChange={(e) => { setType(e.target.value) }}>
                        <Radio value={1}>定时</Radio>
                        <Radio value={2}>弹性</Radio>
                    </Radio.Group>
                </Form.Item>
                {type === 1 && (
                    <>
                        <Form.Item label="是否启用" name="isUse">
                            <Switch />
                        </Form.Item>
                        <Row>
                            <Form.Item className="timeExpression" name="timeExpression" label="时间表达式"
                                rules={[{ required: true, message: '这是必填项' }]}>
                                <Input style={{ width: 200 }} />
                            </Form.Item>
                            <span style={{ marginTop: 4 }}>
                                <Tag
                                    color="geekblue"
                                    onClick={() => {
                                        setCronVisible(true);
                                    }}
                                >
                                    生成时间表达式
                    </Tag>
                            </span>
                        </Row>
                    </>
                )}
                <Form.Item label="作用对象" name="type" rules={[{ required: true, message: '请选择' }]}>
                    <Radio.Group value={workObj} onChange={(e) => { setWorkObj(e.target.value) }}>
                        <Radio value='node'>节点</Radio>
                        <Radio value='work'>工作负载</Radio>
                    </Radio.Group>
                </Form.Item>
                {type == 2 && (
                    <>
                        <p>指标表达式</p>
                        <Row >
                            <Col span={10}><Form.Item label="类型" name="leixing"><Select options={[]} /></Form.Item></Col>
                            <Col span={10}><Form.Item label="名称" name="mingcheng"><Select options={[]} /></Form.Item></Col>
                        </Row>
                        <Row>
                            <Col span={10}><Form.Item label="操作" name="caozuo"><Select options={[]} /></Form.Item></Col>
                            <Col span={10}><Form.Item label="值" name="value"><Input /></Form.Item></Col>
                        </Row>
                    </>
                )}
                {
                    workObj === 'work' && (
                        <>
                            <Form.Item label="工作负载类型" name="caozuo" rules={[{ required: true, message: '请输入' }]}>
                                <Select style={{ width: 400 }} options={[]} />
                            </Form.Item>
                            <Form.Item label="命名空间" name="caozuojieidan" rules={[{ required: true, message: '请输入' }]}>
                                <Select style={{ width: 400 }} options={[]} />
                            </Form.Item>
                            <Form.Item label="工作负载" name="caozuojieidan" rules={[{ required: true, message: '请输入' }]}>
                                <Select style={{ width: 400 }} options={[]} />
                            </Form.Item>
                        </>
                    )
                }
                {workObj !== '' && (
                    <>
                        <p>标签：</p>
                        <div className='tags-container'>{tags.map((item) => <Tag>{item}</Tag>)}</div>
                        <Form.List name="base-tags" >
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
                                                        className="tag-key"
                                                        {...field}
                                                        label="KEY"
                                                        name={[field.name, 'key']}
                                                        rules={[{ required: true, message: '此项为必填项' }]}
                                                    >
                                                        <Input size='small' />
                                                    </Form.Item>
                                                )}
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                className="tag-value"
                                                label="VALUE"
                                                name={[field.name, 'value']}
                                            >
                                                <Input size='small' />
                                            </Form.Item>
                                            <Form.Item>
                                                <PlusCircleOutlined className="tag-icon" onClick={() => add()} />
                                            </Form.Item>
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>
                        <Form.Item label="操作类型" name="caozuo" rules={[{ required: true, message: '请输入' }]}>
                            <Select style={{ width: 400 }} options={[]} />
                        </Form.Item>
                        <Form.Item label="操作节点数" name="caozuojieidan" rules={[{ required: true, message: '请输入' }]}>
                            <Input style={{ width: 400 }} />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Drawer>
    </>
}
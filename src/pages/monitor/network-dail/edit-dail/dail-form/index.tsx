import { Collapse, Drawer,Form } from 'antd';
import React from 'react';
export default function DailForm(){
    const [form]=Form.useForm()
    return(
        <div>
            <Form  labelCol={{ flex: '80px' }} form={form}>
                <Form.Item label="集群选择" name="clusterNameb">

                </Form.Item>
                <Form.Item label="拨测类型">
                    
                </Form.Item>
                <Form.Item label="拨测名称">
                    
                </Form.Item>
                <Form.Item label="拨测地址">
                    
                </Form.Item>
                <Form.Item label="拨测频率">

                </Form.Item>
                <Form.Item label="拨测超时">

                </Form.Item>
                <Form.Item label="请求配置">

                </Form.Item>
                

            </Form>
       </div>
    )
}
import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Empty,Form,Card,Divider,Input } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
// import {diffConfig} from './hooks';
import { queryCommonEnvCode } from '../../../dashboards/cluster-board/hook';
// import {syncOptions} from './type'
import AceDiff from '@/components/ace-diff';
import * as APIS from '../../../service';
// import {data} from './mock';
export default function AddModal(){
    const [addForm]=Form.useForm()
    return(
        <Modal title={"新增过滤应用"}>
            <Form form={addForm}>
                <Form.Item label="应用部署名">
                    <Select style={{width:280}} />
                </Form.Item>
                <Form.Item label="命名空间名称">
                  <Input style={{width:280}} />
                </Form.Item>
                <Form.Item label="A集群配置项">
                <Input style={{width:280}} />
                </Form.Item>
                <Form.Item label="B集群配置项">
                <Input style={{width:280}} />
                </Form.Item>
                <Form.Item label="配置项说明">
                <Input style={{width:280}} />
                </Form.Item>
             
                <Form.Item label="A集群JVM参数">
                <Input style={{width:280}} />
                </Form.Item>
                <Form.Item label="B集群JVM参数">
                <Input style={{width:280}} />
                </Form.Item>
                <Form.Item label="配置项说明">
                <Input style={{width:280}} />
                </Form.Item>
             


            </Form>
        </Modal>
    )
}
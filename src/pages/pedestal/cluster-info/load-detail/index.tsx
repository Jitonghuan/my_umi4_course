import { eventTableSchema, podsTableSchema, envVarTableSchema } from '../schema';
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Descriptions, Table, Tag } from 'antd'
import { Button } from '_@cffe_h2o-design@2.28.0-css-var.0@@cffe/h2o-design';
import { history } from 'umi';
import DownLoadFile from './download-file';
import AddModal from './add-modal'
import './index.less'
const tags = ['1111111', '1332434', '23324rerere', '234343434']
const mockdata = [{ disk: '11', ip: '12.12.12' }]
const mock = [{ value: '1111', key: '222' }]

export default function LoadDetail(props: any) {
    const [dataSource, setDataSource] = useState(mockdata);
    const [loading, setLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [envDataSource, setEnvDataSource] = useState(mock);
    const [addTag, setAddTag] = useState<boolean>(false);//新增标签modal
    const [addEnvVar, setAddEnvVar] = useState<boolean>(false);//新增环境变量modal
    // 表格列配置
    const tableColumns = useMemo(() => {
        return podsTableSchema({
            viewLog: (record: any, index: any) => {
                history.push({ pathname: '/matrix/pedestal/view-log' })
            },
            shell: (record: any, index: any) => {
                history.push({ pathname: '/matrix/pedestal/login-shell' })
            },
            download: (record: any, index: any) => {
                setVisible(true)
            },
            handleDelete: (record: any, index: any) => {

            },
        }) as any;
    }, [dataSource]);
    // 环境变量表格列配置
    const envVarColumns = useMemo(() => {
        return envVarTableSchema({
            handleDelete: (record: any, index: any) => {

            },
        }) as any;
    }, [dataSource]);
    return <div className='load-detail-wrapper'>
        <DownLoadFile visible={visible} onCancel={() => { setVisible(false) }}></DownLoadFile>
        <AddModal visible={addTag} onCancel={() => { setAddTag(false) }} title='新增标签'></AddModal>
        <AddModal visible={addEnvVar} onCancel={() => { setAddEnvVar(false) }} title='新增环境变量'></AddModal>
        <p>工作负载：<span style={{ color: 'green' }}>eventTableSchema</span></p>
        <Descriptions title="" bordered>
            <Descriptions.Item label="命名空间">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="镜像">Prepaid</Descriptions.Item>
            <Descriptions.Item label="资源类型">18:00:00</Descriptions.Item>
            <Descriptions.Item label="容器重启次数">$80.00</Descriptions.Item>
            <Descriptions.Item label="副本数">$20.00</Descriptions.Item>
            <Descriptions.Item label="创建时间">$60.00</Descriptions.Item>
        </Descriptions>
        {/* pods */}
        <p className='title'>Pods</p>
        <Table
            dataSource={dataSource}
            loading={loading}
            bordered
            rowKey="id"
            pagination={false}
            columns={tableColumns}
        ></Table>
        {/* 事件 */}
        <p className='title'>事件：</p>
        <Table
            dataSource={dataSource}
            loading={loading}
            bordered
            rowKey="id"
            pagination={false}
            columns={eventTableSchema()}
        ></Table>
        {/* 标签管理 */}
        <div className='flex-wrapper'>
            <span className='title'>标签</span>
            <Button type='primary' size='small' onClick={() => { setAddTag(true) }}>新增标签</Button>
        </div>
        <div className='tag-wrapper'>
            {tags.map((item: any) => {
                return <Tag color="green" closable>{item}</Tag>
            })}
        </div>
        {/* 环境变量 */}
        <div className='flex-wrapper'>
            <span className='title'>环境变量</span>
            <Button type='primary' size='small' onClick={() => { setAddEnvVar(true) }}>新增环境变量</Button>
        </div>
        <Table
            dataSource={dataSource}
            loading={loading}
            bordered
            pagination={false}
            rowKey="id"
            columns={envVarColumns}
        ></Table>
    </div>
}
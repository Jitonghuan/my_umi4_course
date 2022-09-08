import React, { useState,  useMemo,useRef } from 'react';
import { Tabs, Button,Table, Tooltip,message,Row,Col,Tag,Card} from 'antd';
import './index.less'
export default function StationDeploy(){
    return (<div className="station-deploy-content" >
        <div>
            <span><b>建站配置：</b> <Tag color="cyan" >编辑</Tag> &nbsp; &nbsp;<Tag color="geekblue" >重新生成</Tag></span>
        </div>
        <div style={{paddingTop:16}}>
            <p><b>出包部署:</b></p>
            <Row gutter={18}>
                <Col span={6}>
                    <Card style={{ width: 280 }} title="在线包" extra={<a >生成</a>} >
                       不含镜像
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ width: 280 }} title="全量包"  extra={<a >生成</a>} >
                        含底座、组件以及镜像
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ width: 280 }} title="组件包" extra={<a >生成</a>} >
                       不包含底座
                    </Card>
                </Col>
            </Row>

        </div>
       </div>)
}
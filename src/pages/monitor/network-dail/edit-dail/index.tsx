import { Collapse, Drawer,Button } from 'antd';
import React from 'react';
import DailForm from './dail-form';
import AlarmConfig from './alarm-config'
import './index.less'
import {
    MinusCircleOutlined,
    PlusOutlined
  } from '@ant-design/icons';

const { Panel } = Collapse;


interface Iprops {
    mode: EditorMode
}
export default function EditDail(props: Iprops) {
    const { mode, } = props;

    return (
        <Drawer title={mode === "ADD" ? "拨测新增" : "拨测编辑"} visible={mode !== 'HIDE'} width={"80%"}>
            <Collapse bordered={false} defaultActiveKey={['1']}>
                <Panel header={<h3>网络拨测编辑</h3>} key="1">
                <DailForm />
                   
                </Panel>
                <Panel header={<div className="target-item">
                    <h3>报警监控

                   </h3>
                    <Button
                      type="primary"
                      ghost
                      disabled={false}
                      onClick={(e) => {
                        e.stopPropagation();
                        // setRulesType('add');
                        // setRulesVisible(true);
                      }}
                      icon={<PlusOutlined />}
                    >
                      新增报警
                    </Button>
                    </div>} key="2">
                    <AlarmConfig />
                   
                </Panel>


            </Collapse>

        </Drawer>

    );
}

//export default EditDail;
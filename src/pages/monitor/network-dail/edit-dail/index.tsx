import { Collapse, Drawer } from 'antd';
import React from 'react';

const { Panel } = Collapse;

const text = (
    <p style={{ paddingLeft: 24 }}>
        A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found
        as a welcome guest in many households across the world.
    </p>
);
interface Iprops {
    mode: EditorMode
}
export default function EditDail(props: Iprops) {
    const { mode, } = props;

    return (
        <Drawer title={mode === "ADD" ? "拨测新增" : "拨测编辑"} visible={mode !== 'HIDE'} width={"80%"}>
            <Collapse bordered={false} defaultActiveKey={['1']}>
                <Panel header={<h3>网络拨测编辑</h3>} key="1">
                   
                </Panel>
                <Panel header={<h3>报警监控</h3>} key="2">
                   
                </Panel>

            </Collapse>

        </Drawer>

    );
}

//export default EditDail;
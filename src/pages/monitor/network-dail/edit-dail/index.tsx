import { Collapse,Drawer } from 'antd';
import React from 'react';

const { Panel } = Collapse;

const text = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found
    as a welcome guest in many households across the world.
  </p>
);
interface Iprops{
    mode:EditorMode
}
export default function EditDail (props:Iprops) {
    const { mode,  } = props;
    
    return(
        <Drawer  visible={mode !== 'HIDE'}>
            <Collapse bordered={false} defaultActiveKey={['1']}>
    <Panel header="网络拨测编辑" key="1">
      {text}
    </Panel>
    <Panel header="报警监控" key="2">
      {text}
    </Panel>
   
  </Collapse>

        </Drawer>
  
);}

//export default EditDail;
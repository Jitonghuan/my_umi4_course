import { Drawer, Select, Input, Button, Table, Popconfirm } from 'antd';
import { useState, useCallback } from 'react';
import { Graph } from '../konva/shape';
import ETable from './editTable'
// import type { EditableFormInstance, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
    EditableProTable,
} from '@ant-design/pro-table';

export default function DetailDraw(props: any) {
    const { visible, setVisible } = props;
    const [showTable, setShowTable] = useState(true)
    const handleSubmit = () => {

    }
    const drawContainer = useCallback((node: any) => {
        if (node && visible) {
            var g = new Graph(node);
            g.showRelative({
                left: {
                    tableName: "违法数据",
                    recordCount: 10000,
                    remark: '骑手信息',
                },
                right: {
                    tableName: "骑手名单",
                    recordCount: 4000,
                    remark: '骑手信息',
                },
                leftRestCount: 7600,
                rightRestCount: 0,
                corssCount: 5123
            })
        }
    }, [visible]);
    return (
        <Drawer placement="right"
            title='表关联设置'
            visible={visible}
            onClose={() => setVisible(false)}
            width='600px'

            footer={
                <div className="drawer-footer">
                    <Button type="primary" onClick={handleSubmit}>
                        确定
          </Button>
                    {/* <Button type="default" onClick={onClose}>
            取消
          </Button> */}
                </div>
            }>
            <div id="drawContainer" ref={drawContainer} style={{ border: '1px solid #eee', height: "200px" }}></div>
            {showTable && <div>
            </div>}
        </Drawer>
    )

}
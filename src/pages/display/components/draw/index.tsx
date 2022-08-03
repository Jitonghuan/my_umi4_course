import { Drawer, Select, Input, Button, Table, Popconfirm } from 'antd';
import { useState, useCallback } from 'react';
import { Graph } from '../konva/shape';
import ETable from './editTable';
import './index.less';
// import { columns, tableData, detailColumns, detailTableData, commonColumns, commonTableData } from '../../columns';
// import type { EditableFormInstance, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-table';
import { colunms } from '@/pages/monitor/business/schema';
const r = {
  left: {
    tableName: '医保上传检验单',
    recordCount: 330,
    remark: '医保上传检验单',
    type: 'left',
  },
  right: {
    tableName: '校验明细',
    recordCount: 329,
    remark: '校验明细',
    type: 'right',
  },
  leftRestCount: 330,
  rightRestCount: 329,
  corssCount: 205,
};
export default function DetailDraw(props: any) {
  const { visible, setVisible, onSubmit } = props;
  const [dataSource, setDataSource] = useState<any>([]);
  const [column, setColumn] = useState([]);
  const [data, setData] = useState(r);
  const [showTable, setShowTable] = useState(true);
  const [isShowGraph, setIsShowGraph] = useState(false);
  const handleSubmit = () => {
    if (isShowGraph) {
      onSubmit(data);
    }
    setShowTable(false);
    setIsShowGraph(true);
    // onSubmit(data)
  };

  const changeData = (type: string) => {
    if (type === 'left') {
      // setColumn(columns);
      // setDataSource(tableData);
    } else if (type === 'right') {
      // setColumn(detailColumns);
      // setDataSource(detailTableData);
    } else {
      // setColumn(commonColumns);
      // setDataSource(commonTableData);
    }
  };

  const drawContainer = useCallback(
    (node: any) => {
      if (node && visible && isShowGraph) {
        var g = new Graph(node);
        g.showRelative(r, changeData);
      }
    },
    [visible, data, isShowGraph],
  );

  return (
    <Drawer
      placement="right"
      title="表关联设置"
      visible={visible}
      onClose={() => setVisible(false)}
      width="1000px"
      className="table-draw"
      footer={
        <div className="drawer-footer">
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
          {/* <Button type="default" onClick={onClose}>
            取消
          </Button> */}
        </div>
      }
    >
      {isShowGraph && (
        <div id="drawContainer" ref={drawContainer} style={{ border: '1px solid #eee', height: '200px' }}></div>
      )}
      {showTable && (
        <div>
          <div className="edit-table">
            <p className="table-title">表关联条件</p>
            <ETable
              deleteSuccess={() => {
                // setDataSource(dataSource.slice(11));
              }}
              addSuccess={() => {
                // setDataSource(dataSource.slice(21));
              }}
            ></ETable>
          </div>
        </div>
      )}
      <div className="table-wrapper">
        <p className="table-title">预览（基于抽样数据计算，不代表最终结果）</p>
        <Table columns={column} dataSource={dataSource} pagination={false} />
      </div>
    </Drawer>
  );
}

import React, { useState, useEffect } from 'react';
import AceEditor from '@/components/ace-editor';
import YAML from 'yaml';
import { Modal, Input, Table, Select, Space } from 'antd';
import './index.less';

export default function SourceCodeEdit(props: any) {
  const {
    visible,
    setVisible,
    data,
    variableData = [
      { a: '1' },
      { a: '2' },
      { a: '3' },
      { a: '3' },
      { a: '1' },
      { a: '2' },
      { a: '1' },
      { a: '2' },
      { a: '1' },
      { a: '1' },
      { a: '3' },
      { a: '1' },
      { a: '2' },
      { a: '3' },
      { a: '3' },
      { a: '3' },
      { a: '2' },
      { a: '1' },
      { a: '2' },
      { a: '1' },
      { a: '2' },
      { a: '1' },
      { a: '2' },
      { a: '1' },
      { a: '3' },
      { a: '1' },
      { a: '2' },
      { a: '3' },
      { a: '3' },
      { a: '3' },
      { a: '2' },
      { a: '1' },
      { a: '2' },
      { a: '1' },
      { a: '3' },
      { a: '3' },
      { a: '2' },
      { a: '1' },
      { a: '2' },
      { a: '1' },
      { a: '3' },
    ],
  } = props;

  const [editorValue, setEditorValue] = useState<string>();
  const [finalVariableData, setFinalVariableData] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      setFinalVariableData(variableData);

      const tmpData = { ...data };
      try {
        tmpData.hooks = JSON.parse(tmpData.hooks);
      } catch (e) {
        tmpData.hooks = {};
      }
      setEditorValue(tmpData);
    }
  }, [visible]);

  const handleSearch = (val: string) => {
    setFinalVariableData(variableData.filter((item: any) => item?.a?.includes(val)));
  };

  const handleSave = () => {
    if (!editorValue) return;

    console.log('editorValue :>> ', editorValue);

    let finalCaseInfo;
    try {
      finalCaseInfo = YAML.parse(editorValue);
      console.log('finalCaseInfo :>> ', finalCaseInfo);
    } catch (e) {
      console.log('格式不正确');
      // TODO: 拒绝保存，并提示
    }

    //TODO: 保存
  };

  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} title="用例源码编辑" width="930px" onOk={handleSave}>
      <div className="source-code-edit-container">
        <div className="edit-container">
          <Space className="select-container">
            <label>
              前置脚本: <Select className="select-item" />
            </label>
            <label>
              前置用例: <Select className="select-item" />
            </label>
            <label>
              后置脚本: <Select className="select-item" />
            </label>
          </Space>
          <AceEditor mode="yaml" value={YAML.stringify(editorValue)} onChange={setEditorValue} />
        </div>
        <div className="variable-pool">
          <Input.Search className="search-header" onSearch={handleSearch} />
          <Table
            bordered
            className="variable-pool-table"
            dataSource={finalVariableData}
            pagination={false}
            scroll={{ y: '430px' }}
          >
            <Table.Column title="变量名" dataIndex="a" />
            <Table.Column title="变量值" />
            <Table.Column title="描述" />
          </Table>
        </div>
      </div>
    </Modal>
  );
}

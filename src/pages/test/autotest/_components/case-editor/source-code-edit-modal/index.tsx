import React, { useState, useEffect } from 'react';
import AceEditor from '@/components/ace-editor';
import YAML from 'yaml';
import { Modal, Input, Table } from 'antd';
import './index.less';

export default function SourceCodeEdit(props: any) {
  const { visible, setVisible, data } = props;

  const [editorValue, setEditorValue] = useState<string>();

  useEffect(() => {
    if (visible) {
      const tmpData = { ...data };
      try {
        tmpData.hooks = JSON.parse(tmpData.hooks);
      } catch (e) {
        tmpData.hooks = {};
      }
      setEditorValue(tmpData);
    }
  }, [visible]);

  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} title="用例源码编辑" width="930px">
      <div className="source-code-edit-container">
        <div className="edit-container">
          <AceEditor mode="yaml" value={YAML.stringify(editorValue)} onChange={setEditorValue} />
        </div>
        <div className="variable-pool">
          <Input.Search className="search-header" />
          <Table bordered className="variable-pool-table" dataSource={[]} pagination={false} scroll={{ y: '430px' }}>
            <Table.Column title="变量名" />
            <Table.Column title="变量值" />
            <Table.Column title="描述" />
          </Table>
        </div>
      </div>
    </Modal>
  );
}

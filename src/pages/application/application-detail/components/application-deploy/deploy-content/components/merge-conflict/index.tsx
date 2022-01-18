import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, List } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import CodeMirrorEditor from './CodeMirrorEditor';
import './index.less';
export interface MergeDialogProp extends MergeProps {
  visible: boolean;
  handleCancel: any;
}
export interface MergeProps {
  fromBranch: string;
  toBranch: string;
  conflictFiles: ConflictFile[];
}
export interface ConflictFile {
  name: string;
  newContent: string;
  oldContent: string;
  ext: string;
  resolved: boolean;
}

export default function MergeConflict(prop: any) {
  const data = {
    fromBranch: 'xxx',
    toBranch: 'bbbb',
    conflictFiles: [
      {
        name: '冲突文件1',
        newContent: 'new\nd\nasd\nfsf\n\fd',
        oldContent: 'new\nd\nffsd\nfsf\nfscc',
        ext: 'javascript',
        resolved: true,
      },
      {
        name: '冲突文件2',
        newContent: 'nebbbbw\b\nfsf\fd',
        oldContent: 'new\bffsdfbbscc',
        ext: 'javascript',
        resolved: false,
      },
    ],
  } as MergeProps;
  const { visible, handleCancel, ...rest } = prop;
  const [chooseFile, setChooseFile] = useState(data.conflictFiles[0]); //当前选中的文件
  const fileChange = (file: any) => {
    setChooseFile(file);
  };
  const resolve = () => {};
  return (
    <>
      <Modal title="冲突详情" visible={visible} onCancel={handleCancel} width={1100}>
        {/* <div className="merge-conflict-desc">
          <span>
            from {data.fromBranch} to {data.toBranch}
          </span>
        </div> */}
        <div className="merge-container">
          <div className="left-menu">
            <div className="merge-status">all {data.conflictFiles.length} 已解决</div>
            <List
              dataSource={data.conflictFiles}
              className="file-list"
              renderItem={(item) => (
                <List.Item className="file-list-item" onClick={() => fileChange(item)}>
                  {item.name}
                  {item.resolved ? <CheckCircleTwoTone className="ml10" /> : ''}
                </List.Item>
              )}
            />
          </div>
          <div className="content-editor">
            <div className="conflict-file">
              <span className="merge-status">* 左边为最终保留的代码文件</span>
              <Button onClick={resolve} type="primary">
                标记为已解决
              </Button>
            </div>
            <CodeMirrorEditor value={chooseFile.newContent} orig={chooseFile.oldContent} />
          </div>
        </div>
      </Modal>
    </>
  );
}

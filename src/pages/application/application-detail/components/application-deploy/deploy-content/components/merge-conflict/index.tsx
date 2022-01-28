import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, List, Tooltip, message } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import CodeMirrorEditor from './CodeMirrorEditor';
import MonacoEditor from './MonacoEditor';
import './index.less';
import { MergeProp, conflictItem } from './types';
import { pushMergeMessage } from '@/pages/application/service';

export default function MergeConflict(prop: MergeProp) {
  const { visible, handleCancel, mergeMessage, releaseBranch } = prop;
  const [allFile, setAllFile] = useState<any>([]); //所有冲突的文件
  const [chooseFile, setChooseFile] = useState<any>([]); //当前选中的文件
  const [loading, setLoading] = useState(false);
  const conflictCount = useMemo(() => allFile.filter((e: conflictItem) => !e.resolved).length, [allFile]);
  const resolvedCount = useMemo(() => allFile.filter((e: conflictItem) => e.resolved).length, [allFile]);
  const fileChange = (file: any) => {
    setChooseFile(file);
  };
  useEffect(() => {
    if (mergeMessage) {
      setAllFile(mergeMessage);
      setChooseFile(mergeMessage[0]);
    }
  }, [prop]);
  // 标记为已解决
  const handleResolved = () => {
    const value = !chooseFile.resolved;
    let newArr = allFile.map((item: conflictItem) => {
      if (item.id === chooseFile.id) {
        Object.assign(item, { resolved: value });
      }
      return item;
    });
    setAllFile(newArr);
    setChooseFile((item: conflictItem) => {
      return { ...item, resolved: value };
    });
  };
  // 提交冲突
  const handleOk = () => {
    const params = allFile.map((item: conflictItem) => ({
      filePath: item.filePath,
      context: item.releaseBranch.context,
    }));
    setLoading(true);
    pushMergeMessage({ releaseBranch: releaseBranch, messages: params })
      .then(() => {
        setLoading(false);
        message.success('提交成功!');
        handleCancel();
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  // 编辑器代码改变时同步更新数据
  const handleChange = (value: string) => {
    // if (value === chooseFile.releaseBranch.context) {
    //   return;
    // }
    let f: any;
    let newArr = allFile.map((item: conflictItem) => {
      if (item.id === chooseFile.id) {
        item.releaseBranch.context = value;
        f = item;
      }
      return item;
    });

    setAllFile(newArr);
    if (f) {
      setChooseFile({ ...f });
    }
  };
  return (
    <>
      <Modal
        title="冲突详情"
        visible={visible}
        onCancel={handleCancel}
        width={1300}
        footer={[
          <Button key="submit" type="primary" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            type="primary"
            onClick={handleOk}
            loading={loading}
            disabled={allFile.some((item: conflictItem) => !item.resolved)}
          >
            提交
          </Button>,
        ]}
      >
        <div className="merge-container">
          <div className="left-menu">
            <div className="merge-status">
              待解决:{conflictCount} 已解决:{resolvedCount}
            </div>
            <List
              dataSource={allFile}
              className="file-list"
              renderItem={(item: conflictItem) => (
                <List.Item
                  className={`file-list-item ${item.id === chooseFile?.id ? 'choose-item' : ''}`}
                  onClick={() => fileChange(item)}
                >
                  <Tooltip title={item.filePath}>
                    <span className="file-list-item-name">
                      {item?.filePath?.split('/')[item?.filePath?.split('/').length - 1]}
                    </span>
                  </Tooltip>
                  {item.resolved ? <CheckCircleTwoTone className="ml10" style={{ fontSize: '120%' }} /> : ''}
                </List.Item>
              )}
            />
          </div>
          <div className="content-editor">
            <div className="conflict-file">
              <span>{chooseFile?.filePath}</span>
              <Button danger={chooseFile?.resolved} onClick={handleResolved} type="primary" size="small">
                {chooseFile?.resolved ? '标记为未解决' : '标记为已解决'}
              </Button>
            </div>
            {/* <CodeMirrorEditor
              {...chooseFile}
              value={chooseFile?.releaseBranch?.context}
              orig={chooseFile?.featureBranch?.context}
              onchange={handleChange}
            /> */}
            <MonacoEditor
              {...chooseFile}
              value={chooseFile?.releaseBranch?.context}
              orig={chooseFile?.featureBranch?.context}
              onchange={handleChange}
            ></MonacoEditor>
          </div>
        </div>
      </Modal>
    </>
  );
}

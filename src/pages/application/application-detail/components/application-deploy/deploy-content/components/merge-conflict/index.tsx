import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, List, Tooltip, message, Popconfirm } from 'antd';
import { CheckCircleTwoTone, QuestionCircleFilled, CopyOutlined } from '@ant-design/icons';
import MonacoEditor from './MonacoEditor';
import './index.less';
import { MergeProp, conflictItem } from './types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { pushMergeMessage, newPushMergeMessage } from '@/pages/application/service';
const mockData = 'feature_testqa_20221215164919,feature_maye_fix_20221129165158,feature_testqa_20221215164919,feature_testqa_20221215164919,feature_testqa_20221215164919,feature_testqa_20221215164919';
const mockData1 = 'feature_testqa_20221215164919,feature_maye_fix_20221129165158,fe,f164919';



export default function MergeConflict(prop: MergeProp) {
  const { visible, handleCancel, mergeMessage, releaseBranch, retryMergeClick, id, isNewPublish = false, code = '', sourceBranch = '', targetBranch = '' } = prop;
  const [allFile, setAllFile] = useState<any>([]); //所有冲突的文件
  const [chooseFile, setChooseFile] = useState<any>({}); //当前选中的文件
  const [loading, setLoading] = useState(false);
  const conflictCount = useMemo(() => allFile.filter((e: conflictItem) => !e.resolved).length, [allFile]);
  const resolvedCount = useMemo(() => allFile.filter((e: conflictItem) => e.resolved).length, [allFile]);
  const text = '你确定已本地解决冲突，要重新部署吗？';
  const fileChange = (file: any) => {
    setChooseFile(file);
  };
  useEffect(() => {
    if (mergeMessage && mergeMessage?.length) {
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
      content: item.content,
    }));
    setLoading(true);
    const requestData: any = { id };
    if (isNewPublish) {
      requestData.taskCode = code;
      requestData.contents = params;
    } else {
      requestData.messages = params;
    }
    const commitMerge = isNewPublish ? newPushMergeMessage : pushMergeMessage;
    commitMerge({ ...requestData })
      .then((res) => {
        if (res.success) {
          // setLoading(false);
          message.success('提交成功!');
        }
        setLoading(false);
        handleCancel();
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  // 重试
  const handleRetry = () => {
    // setLoading(true);
    handleCancel();
    retryMergeClick();
  };
  // 编辑器代码改变时同步更新数据
  const handleChange = (value: string) => {
    // 如果只是单一编辑器
    let f: any;
    let newArr = allFile.map((item: conflictItem) => {
      if (item.id === chooseFile.id) {
        item.content = value;
        f = item;
      }
      return item;
    });
    setAllFile(newArr);
    if (f) {
      setChooseFile({ ...f });
    }
    // let f: any;
    // let newArr = allFile.map((item: conflictItem) => {
    //   if (item.id === chooseFile.id) {
    //     item.releaseBranch.content = value;
    //     f = item;
    //   }
    //   return item;
    // });
    // setAllFile(newArr);
    // if (f) {
    //   setChooseFile({ ...f });
    // }
  };
  return (
    <>
      <Modal
        // title="冲突详情"
        title={isNewPublish ?
          <div className='flex-space-between'>
            <div>冲突详情</div>
            <div className='flex-column modal-title'>
              {<div className='title-item'>
                <Tooltip title={`源分支：${sourceBranch}`}>
                  冲突分支：{sourceBranch}
                </Tooltip>
                <span style={{ marginLeft: 5, color: '#3591ff' }}>
                  <CopyToClipboard text={sourceBranch} onCopy={() => message.success('复制成功！')}>
                    <CopyOutlined />
                  </CopyToClipboard>
                </span>
              </div>}
              {<div className='title-item'>
                <Tooltip title={`目标分支：${targetBranch}`}>
                  目标分支：{targetBranch}
                </Tooltip>
                <span style={{ marginLeft: 5, color: '#3591ff' }}>
                  <CopyToClipboard text={targetBranch} onCopy={() => message.success('复制成功！')}>
                    <CopyOutlined />
                  </CopyToClipboard>
                </span>
              </div>}
            </div>
          </div> : '冲突详情'}
        className="monaco-edit-dialog"
        visible={visible}
        onCancel={handleCancel}
        closable={!loading}
        width={1300}
        footer={[
          <Popconfirm placement="top" title={text} onConfirm={handleRetry} okText="确定" cancelText="取消">
            <Button type="primary" style={{ position: 'absolute', left: '20px' }} loading={loading}>
              本地已解决
              <Tooltip title="本地已解决冲突，点击触发重试">
                <QuestionCircleFilled />
              </Tooltip>
            </Button>
          </Popconfirm>,
          <Button key="submit" type="primary" onClick={handleCancel} loading={loading}>
            取消
          </Button>,
          <Button
            type="primary"
            onClick={handleOk}
            loading={loading}
            disabled={!allFile.length || allFile.some((item: conflictItem) => !item.resolved)}
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
            {(allFile || [])?.length ? <>
              <div className="conflict-file">
                <span>{chooseFile?.filePath}</span>
                <Button danger={chooseFile?.resolved} onClick={handleResolved} type="primary" size="small">
                  {chooseFile?.resolved ? '标记为未解决' : '标记为已解决'}
                </Button>
              </div>
              <MonacoEditor onchange={handleChange} {...chooseFile}></MonacoEditor>
            </> : null
            }
          </div>
        </div>
      </Modal>
    </>
  );
}

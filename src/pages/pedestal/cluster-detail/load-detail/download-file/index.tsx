import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { history } from 'umi';
import { Button, Table, message, Popconfirm, Spin, Select, Tag, Modal, Form, Input, Divider } from 'antd';
export default function DownLoadFile(props: any) {
  const { visible, onCancel } = props;
  const [downloadLogform] = Form.useForm();
  const [currentFilePath, setCurrentFilePath] = useState<string>('');
  const queryListContainer: any = [];
  const selectListContainer = (getContainer: string) => {
    // setCurrentContainerName(getContainer);
  };

  return (
    <Modal title="下载文件" visible={visible} footer={null} onCancel={onCancel}>
      <Form form={downloadLogform} labelCol={{ flex: '120px' }}>
        <Form.Item label="容器：" name="containerName" rules={[{ required: true, message: '这是必填项' }]}>
          <Select style={{ width: 140 }} options={queryListContainer} onChange={selectListContainer}></Select>
        </Form.Item>
        <Form.Item label="文件路径：" name="filePath" rules={[{ required: true, message: '这是必填项' }]}>
          <Input placeholder="请输入文件绝对路径" style={{ width: 200 }}></Input>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="downloadButton"
            onClick={() => {
              setCurrentFilePath(downloadLogform.getFieldValue('filePath'));
              message.info('文件开始下载');
              setTimeout(() => {
                onCancel();
              }, 100);
            }}
            //   href={`${fileDownload}?appCode=${appData?.appCode}&envCode=${currentEnvData}&instName=${currentInstName}&containerName=${currentContainerName}&filePath=${currentFilePath}`}
          >
            下载
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

// 导入数据弹窗
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import { useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { uploadDnsManage, downloadDnsManage } from '../service';
import { Button, message, Modal, Upload } from 'antd';
import './index.less';

const { Dragger } = Upload;
export interface importDataProps {
  mode?: EditorMode;
  onClose: () => any;
  selectedRowKeys: any;
  envCode: string;
}

export default function addEnvData(props: importDataProps) {
  const { mode, onClose, selectedRowKeys, envCode } = props;

  useEffect(() => {
    if (mode === 'HIDE') return;
  }, [mode]);

  const uploadApi = () => {
    return `${uploadDnsManage}?envCode=${envCode}`;
  };

  const UploadProps = {
    name: 'uploadFile',
    multiple: true,
    action: uploadApi,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
      showInfo: '上传中请不要关闭弹窗',
    },
    beforeUpload: (file: any, fileList: any) => {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '操作提示',
          content: `确定要上传文件：${file.name}吗？`,
          onOk: () => {
            return resolve(file);
          },
          onCancel: () => {
            return reject(false);
          },
        });
      });
    },
    onChange(info: any) {
      const { status } = info.file;
      console.log('status', status, '---', info.file);
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done' && info.file?.response.success) {
        message.success(`${info.file.name} 上传成功.`);
      } else if (status === 'error' || info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      } else if (info.file?.response?.success === false) {
        message.error('上传失败！请检查');
      } else if (info.file.status === 'removed') {
        message.warning('上传取消！');
      }
    },
    onDrop(e: any) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Modal visible={mode !== 'HIDE'} title={mode === 'ADD' ? '导入数据' : ''} onCancel={() => onClose()} width={'40%'}>
      <div className="import-data-info">导入数据</div>

      <Dragger {...UploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或者拖拽文件到此区域进行导入</p>
        <p className="ant-upload-hint">请确保上传的文件是根据模版下载的Excel格式，否则会导致导入失败！</p>
      </Dragger>
      <div className="export-data-info">导出数据:</div>
      <div className="export-button">
        <Button
          type="primary"
          target="_blank"
          className="downloadButton"
          href={`${downloadDnsManage}?ids=${JSON.stringify(selectedRowKeys)}`}
          // disabled={downLoadStatus}
          onClick={() => {
            message.info('开始导出...');
          }}
        >
          导出下载
        </Button>
      </div>
    </Modal>
  );
}

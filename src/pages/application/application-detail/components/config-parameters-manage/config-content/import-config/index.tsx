/**
 * ImportConfig
 * @description 导入配置
 * @author moting.nq
 * @create 2021-04-20 10:33
 */

import React, { useState } from 'react';
import { Modal, Button, Spin, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { configUploadUrl } from '../../../../../service';
import { IProps } from './types';
// import './index.less';

const ImportConfig = (props: IProps) => {
  const uploadProps = {
    name: 'config',
    action: `${configUploadUrl}?env=${props.env}&appCode=${props.appCode}&type=${props.configType}`,
    headers: {
      // authorization: 'authorization-text',
    },
    onChange: (info: any) => {
      if (info.file.status !== 'done') {
        return;
      }
      if (info.file.status === 'done' && info.file.response?.success) {
        message.success('上传成功');
        props.onSubmit();
      } else {
        message.error(info.file.response?.errorMsg || '上传失败');
      }
    },
  };

  return (
    <Modal
      destroyOnClose
      width={600}
      title="导入配置"
      visible={props.visible}
      onCancel={props.onClose}
      footer={null}
    >
      <div style={{ display: 'flex' }}>
        <span>配置文件：</span>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>点击上传配置文件</Button>
        </Upload>
      </div>
    </Modal>
  );
};

ImportConfig.defaultProps = {};

export default ImportConfig;

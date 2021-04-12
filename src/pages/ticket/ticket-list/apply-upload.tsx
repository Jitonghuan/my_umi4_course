import React from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export interface IProps {
  /** 属性描述 */
  url: string;
}

/**
 * 申请表上传组件
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-09 17:38
 */
const funcName = (props: IProps) => {
  const { url, value, onChange } = props;

  const uploadProps = {
    name: 'filename',
    action: url,
    headers: {
      authorization: 'authorization-text',
    },
    onChange: (info: any) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>点击上传文件</Button>
    </Upload>
  );
};

/**
 * 默认值
 */
funcName.defaultProps = {
  // 属性默认值配置
};

export default funcName;

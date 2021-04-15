import React from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export interface IProps {
  /** 属性描述 */
  url: string;

  /** value 值 */
  value?: string;

  /** onChange 事件 */
  onChange?: (filename: string) => void;
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
        message.success('上传成功');
        const { filename } = info.file.response.data || {};
        onChange && onChange(filename);
      } else if (info.file.status === 'error') {
        message.error('上传失败');
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

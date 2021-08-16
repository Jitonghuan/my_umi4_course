// 数据执行结果
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/16 15:40

import React, { useMemo } from 'react';
import { Modal } from 'antd';
import AceEditor from '../ace-editor';
import './index.less';

export interface ExecResultProps {
  visible?: boolean;
  data: any;
  onClose?: () => any;
}

const dataFormatter = (data: any): string => {
  if (Array.isArray(data)) {
    return data.map((item) => dataFormatter(item)).join('\n\n');
  }

  if (!data) return '<no result>';
  if (typeof data === 'string') data;
  // 有错误信息
  if (data.status === false && data.error) {
    throw data.error as string;
  }
  if (data.errorLog) {
    return data.errorLog as string;
  }
  if (data.error_log) {
    return data.error_log as string;
  }

  return JSON.stringify(data, null, 2);
};

export default function ExecResult(props: ExecResultProps) {
  const { visible, data, onClose } = props;

  const [resultDataStr, hasError] = useMemo(() => {
    try {
      return [dataFormatter(data), false];
    } catch (ex) {
      return [ex as string, true];
    }
  }, [data]);

  return (
    <Modal title="执行结果" visible={visible} maskClosable={false} footer={false} width={960} onCancel={onClose}>
      <div className="exec-result-container">
        <AceEditor
          mode="text"
          status={hasError ? 'error' : 'default'}
          value={resultDataStr}
          readOnly
          height={Math.max(400, window.innerHeight - 280)}
        />
      </div>
    </Modal>
  );
}

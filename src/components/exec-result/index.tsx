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

export default function ExecResult(props: ExecResultProps) {
  const { visible, data, onClose } = props;

  const [resultDataStr, hasError] = useMemo(() => {
    const item = Array.isArray(data) ? data[0] : data;

    if (!item) return ['<no result>', false];
    if (typeof item === 'string') return [item, false];
    // 有错误信息
    if (item.status === false && item.error) {
      return [item.error as string, true];
    }
    if (item.errorLog) {
      return [item.errorLog as string, false];
    }
    if (item.error_log) {
      return [item.error_log as string, false];
    }

    return [JSON.stringify(item, null, 2), false];
  }, [data]);

  return (
    <Modal title="执行结果" visible={visible} maskClosable={false} footer={false} width={888} onCancel={onClose}>
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

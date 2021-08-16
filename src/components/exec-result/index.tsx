// 数据执行结果
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/16 15:40

import React, { useMemo, useState } from 'react';
import { Modal, Switch } from 'antd';
import classNames from 'classnames';
import './index.less';

export interface ExecResultProps {
  visible?: boolean;
  data: any;
  onClose?: () => any;
}

export default function ExecResult(props: ExecResultProps) {
  const { visible, data, onClose } = props;
  const [wrap, setWrap] = useState(false);

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

  const clazz = classNames('pre-block', { 'pre-line': !wrap });

  return (
    <Modal title="执行结果" visible={visible} maskClosable={false} footer={false} width={888} onCancel={onClose}>
      <div className="exec-result-container">
        <pre
          className={clazz}
          data-status={hasError ? 'error' : ''}
          style={{
            height: Math.max(400, window.innerHeight - 280),
          }}
        >
          {resultDataStr}
        </pre>
        <span className="switch-wrap">
          wrap：
          <Switch checked={wrap} onChange={(e) => setWrap(e)} />
        </span>
      </div>
    </Modal>
  );
}

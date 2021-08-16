// ace editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 15:28

import React, { useState, useCallback } from 'react';
import { message } from 'antd';
import Editor, { IAnnotation } from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-tomorrow';
// import ace from 'ace-builds/src-noconflict/ace';
// import jsonWorkerUrl from 'file-loader!ace-builds/src-noconflict/worker-json';
import './index.less';

// ace.config.setModuleUrl('ace/mode/json_worker', jsonWorkerUrl);

export interface AceEditorProps {
  defaultValue?: string;
  value?: string;
  onChange?: (nextValue: string) => any;
  mode?: 'yaml' | 'json' | 'sql' | 'text' | 'xml';
  height?: number;
  readOnly?: boolean;
  status?: 'success' | 'error' | 'warning' | 'default';
  placeholder?: string;
}

export default function AceEditor(props: AceEditorProps) {
  const [stateValue, setStateValue] = useState<string>('value' in props ? props.value! : props.defaultValue ?? '');

  const handleChange = (next: string) => {
    setStateValue(next);
    props.onChange && props.onChange(next);
  };

  const displayValue = 'value' in props ? props.value : stateValue;

  const handleFormat = useCallback(() => {
    if (props.mode !== 'json') return;
    if (!displayValue) return;

    try {
      const obj = JSON.parse(displayValue);
      handleChange(JSON.stringify(obj, null, 2));
    } catch (ex) {
      message.warning('JSON格式不合法!');
    }
  }, [displayValue, props.mode]);

  return (
    <div className="ace-editor-wrapper" data-status={props.status || 'default'}>
      <Editor
        mode={props.mode || 'text'}
        width="100%"
        height={props.height ? `${props.height}px` : undefined}
        theme="tomorrow"
        value={displayValue}
        onChange={handleChange}
        readOnly={props.readOnly}
        placeholder={props.placeholder}
        setOptions={{
          tabSize: 2,
          useWorker: false,
        }}
      />
      <span className="ace-editor-type" data-type={props.mode} onClick={handleFormat}>
        {props.mode || 'text'}
      </span>
    </div>
  );
}

export function isJSON(str: string, notNull = false) {
  if (!str) return !notNull;

  try {
    JSON.parse(str);
    return true;
  } catch (ex) {
    return false;
  }
}

export async function JSONValidator(_: any, value: string) {
  const flag = isJSON(value);
  if (!flag) {
    throw new Error('JSON 格式校验失败！');
  }
}

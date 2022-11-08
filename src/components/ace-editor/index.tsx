// ace editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 15:28

import React, { useState, useCallback, useRef } from 'react';
import { message } from 'antd';
import Editor, { IAnnotation } from 'react-ace';
//searchbox过滤框，快捷键ctrl+F
import 'brace/ext/searchbox';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
// import ace from 'ace-builds/src-noconflict/ace';
// import jsonWorkerUrl from 'file-loader!ace-builds/src-noconflict/worker-json';
import './index.less';

// ace.config.setModuleUrl('ace/mode/json_worker', jsonWorkerUrl);

export type AceDataType = 'yaml' | 'json' | 'sql' | 'text' | 'xml' | 'html' | 'javascript' | 'python';

export interface AceEditorProps {
  defaultValue?: string;
  value?: string;
  onChange?: (nextValue: string) => any;
  mode?: AceDataType;
  height?: number | string;
  readOnly?: boolean;
  status?: 'success' | 'error' | 'warning' | 'default';
  placeholder?: string;
  focus?: boolean;
  firstLineNumber?: number;
  cursorStart?: number,
  markers?: any[],
}

export default function AceEditor(props: AceEditorProps) {
  const { mode = 'text', focus = false, firstLineNumber, cursorStart, markers } = props;
  const [stateValue, setStateValue] = useState<string>('value' in props ? props.value! : props.defaultValue ?? '');
  const [wrap, setWrap] = useState(false);
  const errorRef = useRef<any>();
  const [errorTips, setErrorTips] = useState('');

  const handleChange = (next: string) => {
    setStateValue(next);
    props.onChange && props.onChange(next);
  };

  const displayValue = 'value' in props ? props.value : stateValue;

  const showError = useCallback((err: any) => {
    clearTimeout(errorRef.current);
    setErrorTips(err?.message || `${err}`);
    errorRef.current = setTimeout(() => {
      setErrorTips('');
    }, 4000);
  }, []);

  const handleFormat = useCallback(() => {
    if (!displayValue) return;

    if (mode === 'text') {
      return setWrap(!wrap);
    }

    if (mode !== 'json') return;

    try {
      const obj = JSON.parse(displayValue);
      handleChange(JSON.stringify(obj, null, 2));
    } catch (ex) {
      message.warning('JSON格式不合法!');
      showError(ex);
    }
  }, [displayValue, wrap, mode]);

  return (
    <div className="ace-editor-wrapper" data-status={props.status || 'default'}>
      <Editor
        focus={focus}
        mode={mode}
        width="100%"
        height={props.height ? `${props.height}${typeof props.height === 'string' ? '' : 'px'}` : undefined}
        theme="tomorrow"
        value={displayValue}
        cursorStart={cursorStart || 1}
        markers={markers || []}
        onChange={handleChange}
        highlightActiveLine={true}
        readOnly={props.readOnly}
        placeholder={props.placeholder}
        showPrintMargin={false}
        wrapEnabled={wrap}
        scrollMargin={[0, 32]}
        setOptions={{
          tabSize: 2,
          useWorker: false,
          firstLineNumber: firstLineNumber || 1
        }}
      />
      <span className="ace-editor-type" data-type={mode} onClick={handleFormat}>
        {mode === 'text' ? (wrap ? 'wrap text' : 'inline text') : mode}
      </span>
      {errorTips ? (
        <pre className="error-tips" onClick={() => setErrorTips('')}>
          {errorTips}
        </pre>
      ) : null}
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

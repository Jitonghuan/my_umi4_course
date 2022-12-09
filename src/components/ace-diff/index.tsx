// ace diff editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 15:28

import { useState, useMemo, useCallback } from 'react';
import { diff as DiffEditor } from 'react-ace';
import { message } from 'antd';
import 'brace/ext/searchbox';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/snippets/html';
import 'ace-builds/src-noconflict/theme-tomorrow';
import './index.less';

export type AceDataType = 'yaml' | 'json' | 'sql' | 'text' | 'xml' | 'html' | 'javascript' | 'python';

export interface AceDiffProps {
  originValue?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (nextValue: string) => any;
  mode?: AceDataType;
  height?: number | string;
  readOnly?: boolean;
  focus?: boolean;
}

export default function AceDiff(props: AceDiffProps) {
  const { originValue = '', readOnly, mode = 'text', focus = false } = props;
  const [stateValue, setStateValue] = useState<string>('value' in props ? props.value! : props.defaultValue ?? '');
  const [errorTips, setErrorTips] = useState('');

  const displayValue = useMemo(() => {
    const currValue = 'value' in props ? props.value : stateValue;
    return [originValue, currValue || ''];
  }, [props.value, stateValue, originValue]);

  const handleChange = (next: string[]) => {
    const [_, nextValue] = next;

    setStateValue(nextValue);
    props.onChange && props.onChange(nextValue);
  };

  const handleFormat = useCallback(() => {
    if (!displayValue[1]) return;

    if (mode !== 'json') return;

    try {
      const obj = JSON.parse(displayValue[1]);
      const valueStr = JSON.stringify(obj, null, 2);
      handleChange([displayValue[0], valueStr]);
    } catch (ex) {
      message.warning('JSON格式不合法!');
    }
  }, [displayValue, mode]);

  return (
    <div className="ace-editor-wrapper">
      <DiffEditor
        focus={focus}
        mode={mode}
        width="100%"
        height={props.height ? `${props.height}${typeof props.height === 'string' ? '' : 'px'}` : undefined}
        theme="tomorrow"
        value={displayValue}
        onChange={handleChange}
        readOnly={readOnly === true}
        scrollMargin={[0, 32]}
        setOptions={{
          tabSize: 2,
          useWorker: false,
        }}
      />
      <span className="ace-editor-type" data-type={mode} onClick={handleFormat}>
        {mode}
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

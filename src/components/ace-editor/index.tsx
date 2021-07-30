// ace editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 15:28

import React, { useState } from 'react';
import Editor, { IAnnotation } from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
// import ace from 'ace-builds/src-noconflict/ace';
// import jsonWorkerUrl from 'file-loader!ace-builds/src-noconflict/worker-json';

// ace.config.setModuleUrl('ace/mode/json_worker', jsonWorkerUrl);

export interface AceEditorProps {
  defaultValue?: string;
  value?: string;
  onChange?: (nextValue: string) => any;
  mode?: 'yaml' | 'json';
  height?: number;
  readOnly?: boolean;
}

export default function AceEditor(props: AceEditorProps) {
  const [stateValue, setStateValue] = useState<string>('value' in props ? props.value! : props.defaultValue ?? '');

  const handleChange = (next: string) => {
    setStateValue(next);
    props.onChange && props.onChange(next);
  };

  const displayValue = 'value' in props ? props.value : stateValue;

  return (
    <div className="ace-editor-wrapper">
      <Editor
        mode={props.mode || 'yaml'}
        width="100%"
        height={props.height ? `${props.height}px` : undefined}
        theme="tomorrow"
        value={displayValue}
        onChange={handleChange}
        readOnly={props.readOnly}
        setOptions={{
          tabSize: 2,
          useWorker: false,
        }}
      />
    </div>
  );
}

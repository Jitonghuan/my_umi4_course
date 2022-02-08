import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import './monaco.less';
import detect from 'language-detect';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import ReactDOM from 'react-dom';

export default function MonacoEditor(prop: any) {
  const { filePath, context, resolved, onchange } = prop;
  const ext = useMemo(() => detect.filename(filePath)?.toLowerCase(), [filePath]);

  const [dv, setDv] = useState<editor.IStandaloneCodeEditor | undefined>(undefined);

  const codeContainer = useCallback((node) => {
    if (node) {
      var editor = monaco.editor.create(node, {});

      setDv(editor);
    }
  }, []);

  useEffect(() => {
    if (dv) {
      dv.updateOptions({ readOnly: resolved });
      const messageContribution: any = dv.getContribution('editor.contrib.messageController');
      const diposable = dv?.onDidAttemptReadOnlyEdit(() => {
        messageContribution.showMessage('已解决模式下不能编辑', dv?.getPosition());
      });
    }
  }, [resolved]);

  useEffect(() => {
    if (dv) {
      const d = dv.onDidChangeModelContent((a) => {
        const editor = dv.getModel();
        onchange(editor?.getValue());
      });
      return () => d.dispose();
    }
  });
  useEffect(() => {
    if (dv) {
      const model = dv.getModel();
      if (model?.getValue() != context) {
        let modifiedModel = monaco.editor.createModel(context, ext);

        dv.setModel(modifiedModel);
        return () => {
          //   model?.dispose();
        };
      }
    }
  }, [dv, filePath]);
  return (
    <div>
      <div style={{ height: '100%', minHeight: '590px' }}>
        <div style={{ height: '590px' }} ref={codeContainer}></div>
      </div>
    </div>
  );
}

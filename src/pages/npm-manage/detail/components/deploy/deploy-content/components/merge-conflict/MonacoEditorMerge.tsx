import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import './monaco.less';
import detect from 'language-detect';

export default function MonacoEditor(prop: any) {
  const { filePath, value, orig, releaseBranch, featureBranch, resolved, onchange } = prop;
  const ext = useMemo(() => detect.filename(filePath)?.toLowerCase(), [filePath]);

  const [dv, setDv] = useState<editor.IStandaloneDiffEditor | undefined>(undefined);

  const codeContainer = useCallback((node: any) => {
    if (node) {
      var diffEditor = monaco.editor.createDiffEditor(node, {});

      setDv(diffEditor);
    }
  }, []);

  useEffect(() => {
    if (dv) {
      dv.updateOptions({ readOnly: resolved });
      const editor = dv.getModifiedEditor();
      const messageContribution: any = editor.getContribution('editor.contrib.messageController');
      const diposable = editor.onDidAttemptReadOnlyEdit(() => {
        messageContribution.showMessage('已解决模式下不能编辑', editor.getPosition());
      });
    }
  }, [resolved]);

  useEffect(() => {
    if (dv) {
      const d = dv.getModifiedEditor().onDidChangeModelContent((a) => {
        const editor = dv.getModifiedEditor();
        onchange(editor.getModel()?.getValue());
      });
      return () => d.dispose();
    }
  });
  useEffect(() => {
    if (dv) {
      const model = dv.getModel();
      if (model?.modified?.getValue() != value || model?.original?.getValue() != orig) {
        let originalModel = monaco.editor.createModel(orig, ext);
        let modifiedModel = monaco.editor.createModel(value, ext);

        dv.setModel({
          original: originalModel,
          modified: modifiedModel,
        });
        // const m = dv.getModel();
        // if (m) {
        //   monaco.editor.setModelLanguage(m.original, ext);
        //   monaco.editor.setModelLanguage(m.modified, ext);
        // }

        return () => {
          originalModel.dispose();
          modifiedModel.dispose();
        };
      }
    }
  }, [dv, filePath]);
  return (
    <div>
      <div className="editor-header-title">
        <div>{featureBranch.branchName}</div>
        <div>{releaseBranch.branchName}</div>
      </div>
      <div style={{ height: '100%', minHeight: '590px' }}>
        <div style={{ height: '500px' }} ref={codeContainer} />
      </div>
    </div>
  );
}

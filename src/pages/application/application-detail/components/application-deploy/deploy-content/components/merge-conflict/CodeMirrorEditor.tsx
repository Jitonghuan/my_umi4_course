import CodeMirror from 'codemirror';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { MergeProp } from './types';
import DiffMatchPatch from 'diff-match-patch';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/merge/merge.js';
import 'codemirror/addon/merge/merge.css';
import 'codemirror/addon/display/panel';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/go/go';
import 'codemirror/mode/clike/clike';

window.diff_match_patch = DiffMatchPatch;
window.DIFF_DELETE = -1;
window.DIFF_INSERT = 1;
window.DIFF_EQUAL = 0;
declare global {
  interface Window {
    diff_match_patch: any;
    DIFF_DELETE: number;
    DIFF_INSERT: number;
    DIFF_EQUAL: number;
  }
}
interface EditorProps {
  value: string;
  orig: string;
  releaseBranch: any;
  featureBranch: any;
  resolved: boolean;
  onchange: (value: string) => void;
  mode?: string;
}
function makePanel(content: string) {
  var node = document.createElement('div');
  node.innerText = content;
  node.className = 'title-panel';
  return node;
}
const extModeMap = {
  go: 'go',
  java: 'clike',
  js: 'jsx',
  ts: { name: 'jsx', typescript: true },
} as any;
export default function CodeMirrorEditor(props: any) {
  const { filePath, value, orig, releaseBranch, featureBranch, resolved, onchange } = props;
  const [dv, setDv]: any = useState(null);
  const [leftPanel, setLeftPanel]: any = useState(null);
  const [rightPanel, setRightPanel]: any = useState(null);
  const ext = useMemo(() => filePath?.substring(filePath?.lastIndexOf('.') + 1), [filePath]);
  const mode = useMemo(() => extModeMap[ext] || 'clike', [ext]);
  useEffect(() => {
    if (dv) {
      leftPanel.node.innerText = releaseBranch?.branchName;
      rightPanel.node.innerText = featureBranch?.branchName;
    }
  }, [releaseBranch?.branchName, featureBranch?.branchName]);

  useEffect(() => {
    if (dv) {
      const editor = dv.editor();
      const rightEditor = dv.rightOriginal();
      if (editor.getValue() != value) {
        editor.setValue(value);
      }
      if (rightEditor.getValue() != orig) {
        rightEditor.setValue(orig);
      }
      if (editor.getOption('mode') != mode) {
        editor.setOption('mode', mode);
      }

      if (editor.getOption('readOnly') != resolved) {
        editor.setOption('readOnly', resolved);
      }
    }
  });
  useEffect(() => {
    if (dv) {
      const editor = dv.editor();
      // 给编辑框增加一个onchange事件 切换左边文件栏也会触发 因此需要判断并return
      const updater = (cm: any, { origin }: any) => {
        if (origin === 'setValue') {
          return;
        }
        onchange(cm.getValue());
      };
      editor.on('change', updater);
      return () => {
        editor.off('change', updater);
      };
    }
  });

  const codeContainer = useCallback((node) => {
    if (node) {
      if (node.childElementCount) {
        node.innerHTML = null;
        setDv(null);
      }
      const dv = CodeMirror.MergeView(node, {
        value: value,
        orig: orig,
        lineNumbers: true,
        lineWrapping: false,
        readOnly: resolved,
        connect: 'align',
        mode,
      });
      const editor = dv.editor();

      const lp = editor.addPanel(makePanel(releaseBranch?.branchName), { position: 'top', stable: true });
      const rp = dv.rightOriginal()?.addPanel(makePanel(featureBranch?.branchName), { position: 'top', stable: true });

      setDv(dv);
      setRightPanel(rp);
      setLeftPanel(lp);
    }
  }, []);

  return (
    <div>
      <div className={`${resolved ? 'readOnly' : ''} cm-s-material`} id="view" ref={codeContainer}></div>
    </div>
  );
}

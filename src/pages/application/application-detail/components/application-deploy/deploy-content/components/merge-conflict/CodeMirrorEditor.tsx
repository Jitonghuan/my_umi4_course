import CodeMirror from 'codemirror';
import { useCallback, useState, useEffect } from 'react';
import DiffMatchPatch from 'diff-match-patch';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/merge/merge.js';
import 'codemirror/addon/merge/merge.css';
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
  // mode: string;
}
export default function CodeMirrorEditor(props: EditorProps) {
  const [dv, setDv]: any = useState(null);
  useEffect(() => {
    if (dv) {
      // dv.edit.setOption('mode', props.mode);
      dv.edit.setValue(props.value);
      dv.rightOriginal().setValue(props.orig);
    }
  });
  const codeContainer = useCallback((node) => {
    if (node) {
      if (node.childElementCount) {
        node.innerHTML = null;
        setDv(null);
      }

      const dv = CodeMirror.MergeView(node, {
        ...props,
        lineNumbers: true, //显示行号
        lineWrapping: true,
        connect: 'align',
      });

      setDv(dv);
    }
  }, []);

  return (
    <div>
      <div className="cm-s-material" id="view" ref={codeContainer}></div>
    </div>
  );
}

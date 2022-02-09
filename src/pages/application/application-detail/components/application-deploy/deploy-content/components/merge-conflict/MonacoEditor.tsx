import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import './monaco.less';
import detect from 'language-detect';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import ReactDOM from 'react-dom';

export default function MonacoEditor(prop: any) {
  console.log(prop, 1222);
  const { filePath, context, resolved, onchange } = prop;
  const ext = useMemo(() => detect.filename(filePath)?.toLowerCase(), [filePath]);
  const [dv, setDv] = useState<editor.IStandaloneCodeEditor | undefined>(undefined);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [oldZones, setOldZones] = useState<string[]>([]);
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
        renderMergeTools();
        onchange(editor?.getValue());
      });
      return () => d.dispose();
    }
  });
  //计算冲突区域
  const diffAreas = () => {
    if (!dv) return;
    const str = dv?.getValue();
    const s = 'start',
      m = 'split',
      e = 'end';
    let index = 0;
    let mode = s;
    let current: any = {};
    //存放冲突区域的下标位置以及新旧字符串
    let res: any = [];
    const continueWith = (s: string, i: number) => str.substring(i, i + s.length) === s;

    do {
      const cha = str[index];
      switch (mode) {
        case s:
          if (cha === '<') {
            if (continueWith('<<<<<<<', index)) {
              current[mode] = index;
              mode = m;
              index += '<<<<<<'.length;
            }
          }
          break;
        case m:
          if (cha === '=') {
            if (continueWith('=======', index)) {
              current[mode] = index;
              current.oldValue = str.substring(current.start, current.split);
              mode = e;
              index += '======='.length;
            }
          }

          break;
        case e:
          if (cha === '>') {
            if (continueWith('>>>>>>>', index)) {
              current[mode] = index;
              current.newValue = str.substring(current.split, current.end);
              res.push(current);
              current = {};
              mode = s;
              index += '>>>>>>>'.length;
            }
          }
      }
    } while (index++ < str.length);
    console.log(res);

    return res;
  };

  let renderMergeTools = () => {
    if (!dv) return;
    const areas = diffAreas();
    // 冲突区域高亮
    const newDecorations = areas.map((position: any) => ({
      options: {
        isWholeLine: true,
        className: 'myGlyphMarginClass',
        // 这里minimap的颜色必须要用#号格式 否则无效
        minimap: {
          color: '#fbd6d2',
          position: 1,
        },
        overviewRuler: {
          color: '#fbd6d2',
          position: 7,
        },
      },
      range: {
        startColumn: 1,
        startLineNumber: dv.getModel()?.getPositionAt(position.start).lineNumber,
        endLineNumber: dv.getModel()?.getPositionAt(position.end).lineNumber,
        endColumn: 1,
      },
    }));
    // 保证有更新时清除旧的高亮 同时更新最新的高亮区域
    setDecorations(dv.deltaDecorations(decorations, newDecorations));

    // // 增加快速操作按钮
    // dv.changeViewZones(function (changeAccessor) {
    //   oldZones.forEach((e) => changeAccessor.removeZone(e));
    //   setOldZones(
    //     areas.map((position: any) => {
    //       var domNode = document.createElement('div');
    //       domNode.className = 'merge-ops-sence merge-ops';
    //       ReactDOM.render(
    //         <>
    //           <button className="merge-item" onClick={() => console.log(222)}>
    //             使用当前分支
    //           </button>
    //           ｜
    //           <button className="merge-item" onClick={() => console.log(333)}>
    //             使用待合并分支
    //           </button>
    //         </>,
    //         domNode,
    //       );
    //       return changeAccessor.addZone({
    //         afterLineNumber: (dv.getModel()?.getPositionAt(position.start).lineNumber || 0) - 1,
    //         heightInLines: 1,
    //         domNode: domNode,
    //       });
    //     }),
    //   );
    // });
  };

  useEffect(() => {
    if (dv) {
      const model = dv.getModel();
      if (model?.getValue() != context) {
        let modifiedModel = monaco.editor.createModel(context, ext);

        dv.setModel(modifiedModel);
        renderMergeTools();
        return () => {
          //   model?.dispose();
        };
      }
    }
  }, [dv, filePath, context]);

  return (
    <div>
      <div style={{ height: '100%', minHeight: '590px' }}>
        <div style={{ height: '590px' }} ref={codeContainer}></div>
      </div>
    </div>
  );
}

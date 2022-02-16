import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import './monaco.less';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import ReactDOM from 'react-dom';
import { strSplice } from '@/common/util';

export default function MonacoEditor(prop: any) {
  const { filePath, context, resolved, onchange } = prop;
  const [instance, setInstance] = useState<editor.IStandaloneCodeEditor | undefined>(undefined);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [oldZones, setOldZones] = useState<string[]>([]);
  const codeContainer = useCallback((node) => {
    if (node) {
      var editor = monaco.editor.create(node, {});

      setInstance(editor);
    }
  }, []);

  useEffect(() => {
    if (instance) {
      instance.updateOptions({ readOnly: resolved });
      const messageContribution: any = instance.getContribution('editor.contrib.messageController');
      const diposable = instance?.onDidAttemptReadOnlyEdit(() => {
        messageContribution.showMessage('已解决模式下不能编辑', instance?.getPosition());
      });
    }
  }, [resolved]);

  useEffect(() => {
    if (instance) {
      const d = instance.onDidChangeModelContent((a) => {
        const editor = instance.getModel();
        renderMergeTools();
        onchange(editor?.getValue());
      });
      return () => d.dispose();
    }
  });

  useEffect(() => {
    if (instance) {
      let modifiedModel = monaco.editor.createModel(context, undefined, monaco.Uri.file(filePath));
      instance.setModel(modifiedModel);
      renderMergeTools();
      return () => {
        modifiedModel?.dispose();
      };
    }
  }, [instance, filePath]);

  useEffect(() => {
    if (!instance) return;
    if (instance.getModel()?.getValue() != context) {
      instance.getModel()?.setValue(context);
      renderMergeTools();
    }
  }, [context]);

  //计算冲突区域
  const diffAreas = () => {
    if (!instance) return;
    const str = instance?.getValue();
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
      const char = str[index];
      switch (mode) {
        case s:
          if (char === '<') {
            if (continueWith('<<<<<<<', index)) {
              current[mode] = index;
              mode = m;
              index += '<<<<<<<'.length;
            }
          }
          break;
        case m:
          if (char === '=') {
            if (continueWith('=======', index)) {
              current[mode] = index;
              //   current.oldValue = str.substring(str.indexOf('\n', current.start), current.split);
              mode = e;
              index += '======='.length;
            }
          }

          break;
        case e:
          if (char === '>') {
            if (continueWith('>>>>>>>', index)) {
              current[mode] = index;
              //   current.newValue = str.substring(str.indexOf('\n', current.split), current.end);
              //   current.repStop = str.indexOf('\n', current.end);
              res.push(current);
              current = {};
              mode = s;
              index += '>>>>>>>'.length;
            }
          }
      }
    } while (index++ < str.length);

    return res;
  };

  let renderMergeTools = () => {
    if (!instance) return;
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
        startLineNumber: instance.getModel()?.getPositionAt(position.start).lineNumber,
        endLineNumber: instance.getModel()?.getPositionAt(position.end).lineNumber,
        endColumn: 1,
      },
    }));
    // 保证有更新时清除旧的高亮 同时更新最新的高亮区域
    setDecorations(instance.deltaDecorations(decorations, newDecorations));

    function replaceValue(area: any, rep: string) {
      if (!instance) return;
      //    https://stackoverflow.com/a/41667840
      //   let ns = strSplice(instance.getModel()?.getValue() || '', area.start, area.repStop - area.start, rep);
      //   instance.getModel()?.setValue(ns);
    }
    // // 增加快速操作按钮
    // instance.changeViewZones(function (changeAccessor) {
    //   oldZones.forEach((e) => changeAccessor.removeZone(e));
    //   setOldZones(
    //     areas.map((area: any) => {
    //       var domNode = document.createElement('div');
    //       domNode.className = 'merge-ops-sence merge-ops';
    //       ReactDOM.render(
    //         <>
    //           <button className="merge-item" onClick={() => replaceValue(area, area.oldValue)}>
    //             使用当前分支
    //           </button>
    //           ｜
    //           <button className="merge-item" onClick={() => replaceValue(area, area.newValue)}>
    //             使用待合并分支
    //           </button>
    //         </>,
    //         domNode,
    //       );
    //       return changeAccessor.addZone({
    //         afterLineNumber: (instance.getModel()?.getPositionAt(area.start).lineNumber || 0) - 1,
    //         heightInLines: 1,
    //         domNode: domNode,
    //       });
    //     }),
    //   );
    // });
  };

  return (
    <div>
      <div style={{ height: '100%', minHeight: '63vh', overflow: 'auto' }}>
        <div style={{ height: '63vh' }} ref={codeContainer}></div>
      </div>
    </div>
  );
}

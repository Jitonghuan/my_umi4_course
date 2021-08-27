import React, { useEffect, useMemo } from 'react';
import Editor, { Plugin, EditorPlugin } from '@cffe/sona-editor';
// import { createSona } from '@cffe/sona';
import './index.less';
import { addAPIPrefix } from '@/utils';
import { postRequest } from '@/utils/request';

/** POST 图片/文件上传 */
export const uploadFile = addAPIPrefix('/qc/teststation/uploadFile');

const {
  ExternalPlugin,
  OpHistoryPlugin,
  TextPlugin,
  LeafPlugin,
  FontPlugin,
  AlignPlugin,
  ImgPlugin,
  TablePlugin,
  RightOpPlugin,
  ColorPlugin,
  ListPlugin,
  LinkPlugin,
  CustomTabkeyPlugin,
  DragPlugin,
  ResetStylePlugin,
} = Plugin;

[
  ExternalPlugin,
  ImgPlugin,
  TablePlugin,
  AlignPlugin,
  OpHistoryPlugin,
  TextPlugin,
  LeafPlugin,
  FontPlugin,
  RightOpPlugin,
  ColorPlugin,
  ListPlugin,
  LinkPlugin,
  CustomTabkeyPlugin,
  DragPlugin,
  ResetStylePlugin,
].forEach((plugin) => {
  if (!plugin.toolbarConfig) return;
  // @ts-ignore
  if (Array.isArray(plugin.toolbarConfig)) {
    plugin.toolbarConfig.forEach((config) => {
      if (['undo', 'redo', 'preview', 'save', 'unorder-list', 'order-list'].includes(config.key)) config.align = 'left';
    });
  } else {
    plugin.toolbarConfig.align = 'left';
  }
});

// @ts-ignore
ImgPlugin.exportApi.insertImg = function insertImg(editor: any) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', '.jpg,.jpeg,.gif,.png,.webp');
  document.body.appendChild(input);

  input.onchange = function () {
    if (input.files) {
      const fd = new FormData();
      fd.append('file', input.files[0]);

      postRequest(uploadFile, { data: fd }).then((res) => {
        const url = res.data.url;
        const nodes = [
          {
            type: 'img',
            props: {
              url: url,
            },
            children: [
              {
                text: '',
              },
            ],
          },
          {
            text: '',
          },
        ];
        editor.insertFragment(nodes);
      });
    }
  };

  input.click();
  document.body.removeChild(input);
};

// @ts-ignore
ImgPlugin.exportApi.insertPasteImg = function insertImg(editor: any, file: any) {
  const fd = new FormData();
  fd.append('file', file);
  postRequest(uploadFile, { data: fd }).then((res) => {
    const url = res.data.url;
    const nodes = [
      {
        type: 'img',
        props: {
          url: url,
        },
        children: [
          {
            text: '',
          },
        ],
      },
      {
        text: '',
      },
    ];
    editor.insertFragment(nodes);
  });
};

RightOpPlugin.toolbarConfig = [];

const plugins: EditorPlugin[] = [
  ImgPlugin,
  TablePlugin,
  TextPlugin,
  ExternalPlugin,
  OpHistoryPlugin,
  LeafPlugin,
  AlignPlugin,
  ColorPlugin,
  ListPlugin,
  LinkPlugin,
  DragPlugin,
  CustomTabkeyPlugin,
  FontPlugin,
  ResetStylePlugin,
  RightOpPlugin,
];

const toolbarConfig: any[] = plugins.filter((plugin) => plugin?.toolbarConfig).map((plugin) => plugin.toolbarConfig);

export default function CaseWorkspace(props: any) {
  const { className, width = '100%', height = '240px', onChange, sona, schema, readOnly, ...otherProps } = props;

  // TODO:图片、表格拉平出来 （Plugin）
  // TODO:保持光标在视野内 （监听键盘按下事件即可，好像事件有返回光标信息）
  return (
    <Editor
      sona={sona}
      schema={schema}
      toolbarLayout="vertical-start"
      plugins={plugins}
      toolbarConfig={toolbarConfig}
      hiddenToolbar={readOnly}
      style={{ width: width, height: height }}
      className={'matrix-rich-editor-wrapper ' + className}
      toolbarClassName="matrix-rich-editor-toolbar"
      editorClassName="matrix-rich-editor"
      readOnly={readOnly}
      {...otherProps}
    />
  );
}

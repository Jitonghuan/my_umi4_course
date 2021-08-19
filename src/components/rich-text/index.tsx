import React, { useEffect, useMemo } from 'react';
import Editor, { Plugin, EditorPlugin } from '@cffe/sona-editor';
import { createSona } from '@cffe/sona';
import './index.less';
import { isArray } from 'lodash';

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

const plugins: EditorPlugin[] = [
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
];

const toolbarConfig: any[] = plugins.filter((plugin) => plugin?.toolbarConfig).map((plugin) => plugin.toolbarConfig);

export default function CaseWorkspace(props: any) {
  const { className, width = '100%', height = '240px', onChange, sona, schema } = props;

  // TODO:获取editor里面的值
  // TODO:回填数据
  // TODO:图片上传逻辑 (加个Plugin就行)
  // TODO:去掉预览、保存按钮 （Plugin不传就行）
  // TODO:图片、表格拉平出来 （Plugin）
  // TODO:添加样式清除按钮 v
  // TODO:保持光标在视野内 （监听键盘按下事件即可，好像事件有返回光标信息）
  return (
    <Editor
      sona={sona}
      schema={schema}
      toolbarLayout="vertical-start"
      plugins={plugins}
      toolbarConfig={toolbarConfig}
      style={{ width: width, height: height }}
      className={'matrix-rich-editor-wrapper ' + className}
      toolbarClassName="matrix-rich-editor-toolbar"
      editorClassName="matrix-rich-editor"
    />
  );
}

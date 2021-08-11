import React, { useEffect, useMemo } from 'react';
import Editor, { Plugin } from '@cffe/sona-editor';
import { createSona } from '@cffe/sona';
import './index.less';

const plugins: any[] = [Plugin.AlignPlugin];

export default function CaseWorkspace(props: any) {
  const { width = '100%', height = '240px', onChange } = props;

  const sona = useMemo(() => createSona(), []);

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
      style={{ width: width, height: height }}
      className="matrix-rich-editor-wrapper"
      toolbarClassName="matrix-rich-editor-toolbar"
      editorClassName="matrix-rich-editor"
    />
  );
}

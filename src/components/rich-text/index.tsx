import React, { useState } from 'react';
// 文档   http://doc.quilljs.cn/1409946   https://github.com/zenoamaro/react-quill
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const defaultColors = [
  'rgb(  0,   0,   0)',
  'rgb(230,   0,   0)',
  'rgb(255, 153,   0)',
  'rgb(255, 255,   0)',
  'rgb(  0, 138,   0)',
  'rgb(  0, 102, 204)',
  'rgb(153,  51, 255)',
  'rgb(255, 255, 255)',
  'rgb(250, 204, 204)',
  'rgb(255, 235, 204)',
  'rgb(255, 255, 204)',
  'rgb(204, 232, 204)',
  'rgb(204, 224, 245)',
  'rgb(235, 214, 255)',
  'rgb(187, 187, 187)',
  'rgb(240, 102, 102)',
  'rgb(255, 194, 102)',
  'rgb(255, 255, 102)',
  'rgb(102, 185, 102)',
  'rgb(102, 163, 224)',
  'rgb(194, 133, 255)',
  'rgb(136, 136, 136)',
  'rgb(161,   0,   0)',
  'rgb(178, 107,   0)',
  'rgb(178, 178,   0)',
  'rgb(  0,  97,   0)',
  'rgb(  0,  71, 178)',
  'rgb(107,  36, 178)',
  'rgb( 68,  68,  68)',
  'rgb( 92,   0,   0)',
  'rgb(102,  61,   0)',
  'rgb(102, 102,   0)',
  'rgb(  0,  55,   0)',
  'rgb(  0,  41, 102)',
  'rgb( 61,  20,  10)',
];

export default function CaseWorkspace(props: any) {
  const { onChange } = props;

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', { color: defaultColors }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return <ReactQuill onChange={onChange} modules={modules} />;
}

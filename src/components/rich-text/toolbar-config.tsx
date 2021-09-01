import React from 'react';
import { FileImageOutlined, TableOutlined } from '@ant-design/icons';
import { Plugin } from '@cffe/sona-editor';

export const imgConfig = {
  title: <FileImageOutlined />,
  key: 'img',
  tooltip: '插入图片',
  divide: true,
  callPluginApi: ['img', 'insertImg'],
  align: 'left',
};

export const tableConfig = {
  title: Plugin.ExternalPlugin.toolbarConfig.dropDownMenu[0].title,
  key: 'table',
  tooltip: '插入表格',
  divide: true,
  callPluginApi: [],
  align: 'left',
};

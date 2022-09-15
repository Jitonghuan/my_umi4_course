// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Form, Button, Select, Input, Switch,Modal } from 'antd';
import ReactMarkdown from 'react-markdown';

export interface CreateArticleProps {
  mode?: EditorMode;
  infoData?: any;
  onClose:()=>void;
}

export default function CreateArticle(props: CreateArticleProps) {
  const { mode, infoData,onClose } = props;
 
  useEffect(() => {
    if (mode === 'HIDE') return;
   
  }, [mode]);
  


  return (
      <Modal visible={mode==="VIEW"} title="Change Log 详情" onCancel={onClose} footer={null}>
          <div>
          <ReactMarkdown
                        children={infoData}
                        className="markdown-html"
                      // escapeHtml={false}  //不进行HTML标签的转化
                      />
          </div>

      </Modal>
    
    
  );
}

// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/05/10 10:30

import React from 'react';
import { useState, useEffect } from 'react';
import { Drawer, Button, Tree, Space,} from 'antd';
import {  useBulkaddMiddleware } from '../../hooks';
import './index.less';
export interface middlewareComponentProps {
  mode: EditorMode;
  versionId: number;
  componentOptions:any;
  onClose?: () => any;
  onSave: () => any;
}

export default function BatchMiddlewareDraw(props: middlewareComponentProps) {
  const { mode, onClose, onSave, versionId,componentOptions } = props;
  const [isDisabled, setIsdisabled] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [saveLoading, saveBulkadd] = useBulkaddMiddleware();
  const [curComponentName, setCurComponentName] = useState<any>([]);
  const [middlewareOptions,setMiddlewareOptions]= useState<any>([]);
  
  useEffect(() => {
    if (mode === 'HIDE') return;
    let options= componentOptions?.map((item:any)=>(
        {key:item?.value,
          title:item?.label
      }
    ))
    console.log(options)
    setMiddlewareOptions(options)
   
    return () => {
      setIsdisabled(false);
      setSelectedKeys([]);
    };
  }, [mode]);
  const handleSubmit = () => {
    saveBulkadd({componentName: curComponentName, versionId:versionId }).then(() => {
      onSave();
    });
  };
  

  const onCheck = (checkedKeys: React.Key[], info: any) => {
    let nameArry: any = [];

    info.checkedNodes?.map((item: any) => {
      nameArry.push(item.title);
    });
    setSelectedKeys(checkedKeys);
    setCurComponentName(nameArry);
  };
  const allCheck = () => {
    let arry: any = [];
    let nameArry: any = [];
    middlewareOptions.map((item: any) => {
      arry.push(item.key);
      nameArry.push(item.title);
    });
    setCurComponentName(nameArry);
    setSelectedKeys(arry);
  };
  const unAllCheck = () => {
    setSelectedKeys([]);
    setCurComponentName([]);
  };

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title="批量添加中间件"
      // maskClosable={false}
      onClose={onClose}
      width={'30%'}
      footer={
        <div className="drawer-footer">
          <Button type="primary" disabled={isDisabled} loading={saveLoading} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      {componentOptions.length > 0 && (
        <p className="middleware-list-show">
          <span> 中间件列表:</span>
          <Space style={{ marginLeft: 12 }}>
            <span   className="all-select-btn" onClick={allCheck}>
              全选
            </span>
            <span  className="not-all-select-btn" onClick={unAllCheck}>
              全不选
            </span>
          </Space>
        </p>
      )}

      {/* <Spin spinning={false}> */}
        <Tree
          checkable
          rootClassName="app-list-tree"
          checkedKeys={selectedKeys}
          //@ts-ignore
          onCheck={onCheck}
          height={495}
          treeData={middlewareOptions}
        />
      {/* </Spin> */}
    </Drawer>
  );
}

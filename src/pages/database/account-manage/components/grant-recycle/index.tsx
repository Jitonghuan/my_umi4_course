/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 17:24:55
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-12 16:55:26
 * @FilePath: /fe-matrix/src/pages/database/account-manage/components/grant/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Segmented, Space, Card, Button, Form, Select, Row, Col, Tag, Divider, Tree } from 'antd';
import {
  privTypeOptions,
  schemaDataTreeOption,
  schemaStructOption,
  schemaManageOption,
  globalDataTreeOption,
  globalManageOption,
} from '../../schema';
import { useGrantAccount, useGetSchemaList } from '../../hook';
import './index.less';

export interface GrantProps {
  mode: string;
  clusterId: number;
  curRecord?: any;
  onSave: () => void;
  onClose: () => void;
}
const options = [
  { label: "授权", value: "grant" },
  { label: "回收", value: "recycle" },
]
export default function ScriptEditor(props: GrantProps) {
  const { mode, curRecord = {}, onSave, onClose, clusterId } = props;
  const [objectForm] = Form.useForm();
  const [activeValue, setActiveValue] = useState<string>("grant")
  const [grantLoading, grantAccount] = useGrantAccount();
  const [selectedDataKeys, setSelectedDataKeys] = useState<any>([]);
  const [loading, schemaOptions, getSchemaList] = useGetSchemaList();
  const [selectedStructKeys, setSelectedStructKeys] = useState<any>([]);
  const [selectedManageKeys, setSelectedManageKeys] = useState<any>([]);
  const [curPrivType, setCurPrivType] = useState<string>('');
  useEffect(() => {
    if (mode !== 'HIDE') {
      getSchemaList({ clusterId });
    }

    return () => {
      objectForm.resetFields();
      setSelectedDataKeys([]);
      setSelectedStructKeys([]);
      setSelectedManageKeys([]);
      setCurPrivType('');
    };
  }, [mode]);
  const onDataCheck = (checkedKeys: React.Key[], info: any) => {
    let nameArry: any = [];

    info.checkedNodes?.map((item: any) => {
      nameArry.push(item.title);
    });
    setSelectedDataKeys(checkedKeys);
  };
  const onStructCheck = (checkedKeys: React.Key[], info: any) => {
    let nameArry: any = [];

    info.checkedNodes?.map((item: any) => {
      nameArry.push(item.title);
    });
    setSelectedStructKeys(checkedKeys);
  };
  const onManageCheck = (checkedKeys: React.Key[], info: any) => {
    let nameArry: any = [];

    info.checkedNodes?.map((item: any) => {
      nameArry.push(item.title);
    });
    setSelectedManageKeys(checkedKeys);
  };

  const handleSubmit = async () => {
    const objParams = await objectForm.validateFields();
    let privsDataArry: any = [];
    privsDataArry = selectedDataKeys.concat(selectedStructKeys, selectedManageKeys);
   
      grantAccount({
        grantType:activeValue==='grant'?1:2,
        // grantType: curRecord?.grantType,
        clusterId,
        id: curRecord?.id,
        privs: privsDataArry,
        privType: objParams?.privType,
        object: {
          schemaList: objParams?.schemaList,
        },
      }).then(() => {
        onSave();
      });

   
    
  };

  const changePrivType = (value: string) => {
    setCurPrivType(value);
  };

  return (
    <>
      <Modal
        title={<Space><span>{"编辑权限"}</span><span>(当前用户：<span style={{ color: '#1E90FF' }}>{curRecord?.user}</span>)</span></Space>}
        width={'70%'}
        visible={mode !== 'HIDE'}
        maskClosable={false}
        onCancel={onClose}
        onOk={onSave}
        footer={[
          <Button
            key="cancel"
            style={{ marginRight: 10 }}
            danger
            onClick={() => {
              onClose();
            }}
          >
            取消
          </Button>,
          <Button
            key="getValue"
            type="primary"
            loading={grantLoading}
            onClick={() => {
              handleSubmit();
            }}
          >
            执行
          </Button>,
        ]}
      >
        <div className="table-caption">
          <div className="caption-left">
            <Segmented options={options} onChange={(e: any) => { setActiveValue(e) }} value={activeValue} />
          </div>
          <div className="caption-right">
            <span style={{color:'red'}}>注意：批量授权/回收不支持已有权限查看</span>
          </div>
        </div>
        <div style={{ display: 'flex' }} className="right-content-card">

          <Card title="对象选择" style={{ width: 300 }}>
            <Form layout="vertical" form={objectForm}>
              <Form.Item label="请选择授权类型:" name="privType" rules={[{ required: true, message: '请选择' }]}>
                <Select options={privTypeOptions} allowClear onChange={changePrivType} />
              </Form.Item>
              {curPrivType === 'schema' && (
                <Form.Item label="请选择数据库:" name="schemaList" rules={[{ required: true, message: '请选择' }]}>
                  <Select options={schemaOptions} loading={loading} allowClear showSearch mode="multiple" />
                </Form.Item>
              )}
            </Form>
          </Card>
          <Card title="权限选择" style={{ flex: 1, marginLeft: 14 }}>
            <Row gutter={16}>
              <Col span={8}>
                <h3>数据</h3>
                <Divider />
                <Tree
                  checkable
                  rootClassName="data-list-tree"
                  checkedKeys={selectedDataKeys}
                  onCheck={onDataCheck}
                  height={495}
                  treeData={curPrivType === 'schema' ? schemaDataTreeOption : globalDataTreeOption}
                />
              </Col>
              <Col span={8}>
                <h3>结构</h3>
                <Divider />
                <Tree
                  checkable
                  rootClassName="struct-list-tree"
                  checkedKeys={selectedStructKeys}
                  onCheck={onStructCheck}
                  height={495}
                  treeData={schemaStructOption}
                />
              </Col>
              <Col span={8}>
                <h3>管理</h3>
                <Divider />
                <Tree
                  checkable
                  rootClassName="manage-list-tree"
                  checkedKeys={selectedManageKeys}
                  onCheck={onManageCheck}
                  height={495}
                  treeData={curPrivType === 'schema' ? schemaManageOption : globalManageOption}
                />
              </Col>
            </Row>
          </Card>
        </div>
      </Modal>
    </>
  );
}

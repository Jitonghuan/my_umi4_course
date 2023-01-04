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
  tableListOptions,
  columnListOptions
} from '../../schema';
import { useGrantAccount, useGetSchemaList } from '../../hook';
import { getPrivsDetail, getTableColumnList, modifyPrivs } from "../grant-default/hook";
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
  const [tableOptions, setTableOptions] = useState<any>([]);
  const [columnOptions, setCoumnOptions] = useState<any>([]);
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
        clusterId,
        id: curRecord?.id,
        privs: privsDataArry,
        privType: objParams?.privType,
        object: {
          schemaList: typeof(objParams?.schemaList)==="string"?[objParams?.schemaList]:objParams?.schemaList,
          tableList:typeof(objParams?.tableList)==="string"?[objParams?.tableList]:objParams?.tableList,
          columnList:typeof(objParams?.columnList)==="string"?[objParams?.columnList]:objParams?.columnList
        },
      }).then(() => {
        onSave();
      });

   
    
  };

  const changePrivType = (value: string) => {
    setCurPrivType(value);
    const values = objectForm.getFieldsValue() || {};
    const valueList = Object.keys(values).map((v) => v);
    objectForm.resetFields([...valueList.filter((v) => v !== 'privType')]);
  };
  const getTableColumnListData = (dbName?: string, tableName?: string) => {
    getTableColumnList({ clusterId, dbName, tableName }).then((res) => {
        if (res?.success) {
            let data = res?.data;
            let source = data?.map((ele: any) => ({
                label: ele,
                value: ele
            }))
            if (tableName) {
                setCoumnOptions(source)
            } else {
                setTableOptions(source)
            }


        }

    })
}

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
                {curPrivType === 'table' && (
                  <div>
                <Form.Item label="请选择数据库:" name="schemaList" rules={[{ required: true, message: '请选择' }]}>
                  <Select options={schemaOptions} loading={loading} allowClear showSearch  onChange={(value)=>{  getTableColumnListData(value)}} />
                </Form.Item>
                <Form.Item label="请选择表:" name="tableList" rules={[{ required: true, message: '请选择' }]}>
                  <Select options={tableOptions} loading={loading} allowClear showSearch mode="multiple" />
                </Form.Item>


                  </div>
              
              )}
                 {curPrivType === 'column' && (
                  <div>
                <Form.Item label="请选择数据库:" name="schemaList" rules={[{ required: true, message: '请选择' }]}>
                  <Select options={schemaOptions} loading={loading} allowClear showSearch onChange={(value)=>{  getTableColumnListData(value)}} />
                </Form.Item>
                <Form.Item label="请选择表:" name="tableList" rules={[{ required: true, message: '请选择' }]}>
                  <Select options={tableOptions} loading={loading} allowClear showSearch onChange={ (value) => {
                getTableColumnListData(objectForm?.getFieldValue("schemaList"),value )
            }}  />
                </Form.Item>
                <Form.Item label="请选择列:" name="columnList" rules={[{ required: true, message: '请选择' }]}>
                  <Select options={columnOptions} loading={loading} allowClear showSearch  mode="multiple"/>
                </Form.Item>


                  </div>
              
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
                  //columnOptions
                  treeData={
                    curPrivType === 'schema' ? schemaDataTreeOption : 
                    curPrivType==="table"?tableListOptions[0]:
                    curPrivType==="column"?columnListOptions[0]:
                    globalDataTreeOption}
                />
              </Col>
              {curPrivType!=="column"&& <Col span={8}>
                <h3>结构</h3>
                <Divider />
                <Tree
                  checkable
                  rootClassName="struct-list-tree"
                  checkedKeys={selectedStructKeys}
                  onCheck={onStructCheck}
                  height={495}
                  treeData={curPrivType==="table"?tableListOptions[1]:schemaStructOption}
                />
              </Col>}
             
              <Col span={8}>
                <h3>管理</h3>
                <Divider />
                <Tree
                  checkable
                  rootClassName="manage-list-tree"
                  checkedKeys={selectedManageKeys}
                  onCheck={onManageCheck}
                  height={495}
                  treeData={curPrivType === 'schema' ? schemaManageOption :
                  curPrivType==="table"?tableListOptions[2]:
                    curPrivType==="column"?columnListOptions[1]: globalManageOption}
                />
              </Col>
            </Row>
          </Card>
        </div>
      </Modal>
    </>
  );
}

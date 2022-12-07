// 索引管理
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/23 19:10

import React, { useState, useEffect } from 'react';
import { Input, Table, Popconfirm, Button, Drawer, Form, Select } from 'antd';
import PageContainer from '@/components/page-container';
import { getRequest, postRequest } from '@/utils/request';
import appConfig from '@/app.config';
import * as APIS from '../search-new/service';
import { ContentCard } from '@/components/vc-page-content';
import { useEDitEnvOptions, useCreateIndexMode, useDeleteIndexMode, useEditIndexMode } from '../search-new/hooks';
export default function DemoPageList() {
  const [addIndexForm] = Form.useForm();
  const [envOptions] = useEDitEnvOptions();
  const [addMode, setAddMode] = useState<EditorMode>('HIDE');
  const [createIndexMode] = useCreateIndexMode(); //创建
  const [editIndexTable] = useEditIndexMode(); //编辑
  const [id, setId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [queryIndexModeData, setQueryIndexModeData] = useState<any[]>([]);

  //查询表格信息
  const queryIndexTable = (index?: any, size?: any) => {
    setLoading(true);
    getRequest(APIS.queryIndexMode, { data: { pageIndex: index || pageIndex, pageSize: size || pageSize } })
      .then((resp) => {
        if (resp.success) {
          setQueryIndexModeData(resp?.data.dataSource);
          setTotal(resp?.data?.pageInfo?.total);
          setPageSize(resp?.data?.pageInfo?.pageSize);
          setPageIndex(resp?.data?.pageInfo?.pageIndex);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    queryIndexTable(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  //提交新增数据
  const handleSubmit = async() => {
    // const paramsdata = addIndexForm.getFieldsValue();
    const paramsdata =await addIndexForm.validateFields();

    let envCode = paramsdata?.envCode;
    let fields = paramsdata?.fields;
    let indexMode = paramsdata?.indexMode;
    if (addMode === 'ADD') {
      createIndexMode(envCode, fields, indexMode);
      setTimeout(() => {
        queryIndexTable();
      }, 200);

      setAddMode('HIDE');
    } else if (addMode === 'EDIT') {
      editIndexTable(id, envCode, fields, indexMode);
      setTimeout(() => {
        queryIndexTable();
      }, 200);
      setAddMode('HIDE');
    }
  };

  return (
    <PageContainer>
      <Drawer
        visible={addMode !== 'HIDE'}
        title={addMode === 'EDIT' ? '编辑环境' : addMode === 'ADD' ? '新增环境' : null}
        onClose={() => {
          setAddMode('HIDE');
        }}
        width={640}
        footer={
          <div className="drawer-custom-footer">
            <Button type="primary" onClick={handleSubmit}>
              保存
            </Button>
            <Button
              type="default"
              onClick={() => {
                setAddMode('HIDE');
              }}
            >
              取消
            </Button>
          </div>
        }
      >
        <Form form={addIndexForm} labelCol={{ flex: '120px' }}>
          <Form.Item label="环境Code" name="envCode" rules={[{ required: true, message: '请输入环境Code' }]}>
            <Select options={envOptions} style={{ width: 440 }} placeholder="请选择" />
          </Form.Item>
          <Form.Item label="日志库(索引模式)" name="indexMode" rules={[{ required: true, message: '请输入索引模式' }]}>
            <Input placeholder="请输入" style={{ width: 440 }} />
          </Form.Item>
          <Form.Item label="字段" name="fields" >
            <Input style={{ width: 440 }} />
          </Form.Item>
        </Form>
      </Drawer>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>索引列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                addIndexForm.resetFields();
                setAddMode('ADD');
              }}
            >
              + 新增索引
            </Button>
          </div>
        </div>

        <Table
          dataSource={queryIndexModeData}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            onChange: (next) => setPageIndex(next),
            onShowSizeChange: (_, next) => setPageSize(next),
          }}
        >
          <Table.Column title="序号" dataIndex="id" width={60} />
          <Table.Column title="环境Code" dataIndex="envCode" width={120} ellipsis />
          <Table.Column title="日志库(索引模式)" dataIndex="indexMode" width={140} ellipsis />
          <Table.Column title="字段" dataIndex="fields" width={120} />
          <Table.Column
            title="操作"
            width={160}
            render={(current, record: any, index) => (
              <div className="action-cell">
                <a
                  onClick={() => {
                    setAddMode('EDIT');
                    setId(current?.id);
                    addIndexForm.setFieldsValue({
                      id: record?.id,
                      envCode: record?.envCode,
                      indexMode: record?.indexMode,
                      fields: record?.fields,
                    });
                  }}
                >
                  编辑
                </a>
                <Popconfirm
                  title="确定要删除吗？"
                  onConfirm={() => {
                    postRequest(`${appConfig.apiPrefix}/logManage/logSearch/indexMode/delete?id=${record.id}`);
                    setTimeout(() => {
                      queryIndexTable(pageIndex, pageSize);
                    }, 200);
                  }}
                >
                  <a >删除</a>
                </Popconfirm>
              </div>
            )}
          />
        </Table>
      </ContentCard>
    </PageContainer>
  );
}

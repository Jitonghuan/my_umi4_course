// 标签管理列表页
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2021/12/03 14:20

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Tag } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import LabelEditDrawer from '../label-add';
import { useLabelList, useDeleteLabel } from '../hook';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';

/** 编辑页回显数据 */
export interface LabelEdit extends Record<string, any> {
  id: number;
  tagName: string;
  tagMark: string;
  categoryCodes: string;
}
export default function LanbelList() {
  const { Option } = Select;
  const [labelForm] = Form.useForm();
  const [labelEditMode, setLabelEditMode] = useState<EditorMode>('HIDE');
  const [labelData, setLabelData] = useState<LabelEdit>();
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pageTotal, setPageTotal] = useState<number>();
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [labelListSource, getLabelList, setLabelListSource] = useLabelList(); //获取标签列表
  const [tagNameCurrent, setTagNameCurrent] = useState<string>(''); //当前输入的标签名称搜索内容
  const [deleteLabel] = useDeleteLabel(); //删除标签

  //触发分页

  const pageSizeClick = (pagination: any) => {
    let tagNameParam = labelForm.getFieldValue('tagName');
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    getLabelList(obj, tagNameParam);
    setPageIndex(pagination.current);
  };
  //抽屉保存
  const saveEditData = () => {
    setLabelEditMode('HIDE');
    setTimeout(() => {
      getLabelList({ pageIndex: 1, pageSize: 20 });
    }, 100);
  };
  //点击编辑
  const handleEditTask = useCallback(
    (record: LabelEdit, index: number) => {
      setLabelData(record);
      setLabelEditMode('EDIT');
      setLabelListSource(labelListSource);
    },
    [labelListSource],
  );
  const queryLabelList = (valus: any) => {
    setTagNameCurrent(valus);
    getLabelList(pageIndex, pageSize, valus);
  };
  return (
    <PageContainer>
      <LabelEditDrawer
        mode={labelEditMode}
        initData={labelData}
        onClose={() => setLabelEditMode('HIDE')}
        onSave={saveEditData}
      />
      <FilterCard>
        <Form
          layout="inline"
          form={labelForm}
          onFinish={queryLabelList}
          onReset={() => {
            labelForm.resetFields();
          }}
        >
          <Form.Item label="标签名称" name="tagName">
            <Input placeholder="请输入标签名称"></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset">
              重置
            </Button>
          </Form.Item>
          <div style={{ float: 'right', display: 'flex', marginLeft: '658px' }}>
            <Button type="primary" onClick={() => setLabelEditMode('ADD')}>
              新增标签
            </Button>
          </div>
        </Form>
      </FilterCard>
      <ContentCard>
        <div>
          <Table
            rowKey="id"
            dataSource={labelListSource}
            bordered
            loading={loading}
            pagination={{
              total: pageTotal,
              pageSize,
              current: pageIndex,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setPageIndex(1);
              },
              showTotal: () => `总共 ${pageTotal} 条数据`,
            }}
            // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
            onChange={pageSizeClick}
          >
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column
              title="标签名称"
              dataIndex="tagName"
              width="30%"
              render={(current, record) => {
                return <Tag color="success">{current}</Tag>;
              }}
            />
            <Table.Column title="标签备注" dataIndex="tagMark" width="26%" ellipsis />
            <Table.Column title="默认环境" dataIndex="categoryCodes" width="12%" />
            <Table.Column
              title="操作"
              width="18%"
              key="action"
              render={(_, record: LabelEdit, index) => (
                <Space size="small">
                  <a onClick={() => handleEditTask(record, index)}>编辑</a>
                  <a
                    onClick={() => {
                      history.push({
                        pathname: 'label-bind',
                        query: {
                          tagName: record.tagName,
                        },
                      });
                    }}
                  >
                    绑定
                  </a>
                  <a
                    onClick={() => {
                      history.push({
                        pathname: 'label-unbound',
                        query: {
                          tagName: record.tagName,
                        },
                      });
                    }}
                  >
                    解绑
                  </a>
                  <Popconfirm
                    title="确定要删除该信息吗？"
                    onConfirm={() => {
                      deleteLabel(record?.id);
                      setTimeout(() => {
                        getLabelList({ pageIndex: 1, pageSize: 20, tagNameCurrent });
                      }, 100);
                    }}
                  >
                    <a style={{ color: 'red' }}>删除</a>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}

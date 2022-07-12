// 标签管理列表页
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2021/12/03 14:20

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, Tag } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import LabelEditDrawer from '../label-add';
import { useDeleteLabel } from '../hook';
import { getRequest } from '@/utils/request';
import { getTagList } from '../service';
import { ContentCard, FilterCard } from '@/components/vc-page-content';

/** 编辑页回显数据 */
export interface LabelEdit extends Record<string, any> {
  id: number;
  tagName: string;
  tagMark: string;
  categoryCodes: string;
  tagCode: string;
}
export default function LanbelList() {
  const { Option } = Select;
  const [labelForm] = Form.useForm();
  const [labelEditMode, setLabelEditMode] = useState<EditorMode>('HIDE');
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [labelData, setLabelData] = useState<LabelEdit>();
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pageTotal, setPageTotal] = useState<number>();
  // const [labelListSource, getLabelList, setLabelListSource] = useLabelList(); //获取标签列表
  const [tagNameCurrent, setTagNameCurrent] = useState<string>(''); //当前输入的标签名称搜索内容
  const [deleteLabel] = useDeleteLabel(); //删除标签

  const [labelListSource, setLabelListSource] = useState<any>();

  const getLabelList = (pageIndex?: number, pageSize?: number, tagName?: string) => {
    setLoading(true);
    getRequest(getTagList, {
      data: { pageIndex: pageIndex || 1, pageSize: pageSize || 20, tagName },
    })
      .then((result) => {
        const { dataSource } = result.data || [];
        setLabelListSource(dataSource);
        const pageInfo = result.data.pageInfo;
        setPageIndex(pageInfo?.pageIndex);
        setPageTotal(pageInfo.total);
        setPageSize(pageInfo?.pageSize);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getLabelList(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  //触发分页

  const pageSizeClick = (pagination: any) => {
    let tagNameParam = labelForm.getFieldValue('tagName');
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    // getLabelList(obj.pageIndex,obj.pageSize, tagNameParam);
    setPageIndex(pagination.current);
  };
  //抽屉保存
  const saveEditData = () => {
    setLabelEditMode('HIDE');
    setTimeout(() => {
      getLabelList(1, 20);
    }, 200);
  };
  //点击编辑
  const handleEditTask = useCallback(
    (record: LabelEdit, index: number) => {
      setLabelData(record);
      setLabelEditMode('EDIT');
      // setIsDisable(true);
      setLabelListSource(labelListSource);
    },
    [labelListSource],
  );

  //点击查询按钮时按照搜索条件查询
  const queryLabelList = (values: any) => {
    setTagNameCurrent(values?.tagName);
    getLabelList(pageIndex, pageSize, values?.tagName);
  };
  return (
    <PageContainer>
      <LabelEditDrawer
        mode={labelEditMode}
        // type={isDisable}
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
            getLabelList(1, 20);
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
            <Button type="ghost" htmlType="reset" danger>
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>标签列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setLabelEditMode('ADD');
                // setIsDisable(false);
              }}
            >
              <PlusOutlined />
              新增标签
            </Button>
          </div>
        </div>
        <div>
          <Table
            rowKey="id"
            dataSource={labelListSource}
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
              width="20%"
              render={(current, record) => {
                return <Tag color="success">{current}</Tag>;
              }}
            />
            <Table.Column title="标签备注" dataIndex="tagMark" width="45%" ellipsis />
            <Table.Column title="默认应用分类" dataIndex="categoryCodes" width="20%" />
            <Table.Column
              title="操作"
              width="15%"
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
                          tagCode: record.tagCode,
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
                          tagCode: record.tagCode,
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
                        getLabelList(1, 20, tagNameCurrent);
                      }, 200);
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

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';
import HeaderTabs from '../_components/header-tabs';
import { Form, Button, Table, Input, Select, Space } from 'antd';

export default function TestPlan(props: any) {
  // const updateDataSource = async (cateId: string, keyword?: string) => {
  //   let curTree: Tree = tree as Tree;
  //   if (!tree) {
  //     const res = await getRequest(getCaseCategoryDeepList);
  //     const tree = new Tree(res.data, createTreeOptions);
  //     curTree = tree;
  //     setTree(tree);
  //   }
  //   let cateTreeNode = curTree.root.find((node) => node.id === parseInt(cateId || '0'));
  //   if (keyword) cateTreeNode = cateTreeNode?.filter((node) => node.name?.includes(keyword)) as TreeNode;
  //   void setCaseCategories(curTree.root.children);
  //   void setCateTreeData([cateTreeNode]);
  // };

  return (
    <MatrixPageContent className="test-workspace-test-plan">
      <HeaderTabs activeKey="test-plan" history={props.history} />
      <ContentCard>
        <div className="search-header">
          <Form layout="inline">
            <Form.Item label="所属">
              <Input />
            </Form.Item>

            <Form.Item label="任务名称">
              <Input />
            </Form.Item>

            <Form.Item label="计划名称">
              <Input />
            </Form.Item>

            <Form.Item label="计划名称">
              <Select>
                <Select.Option value="1">待执行</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary">查询</Button>
            </Form.Item>

            <Form.Item>
              <Button type="primary">重置</Button>
            </Form.Item>
          </Form>
        </div>

        <div className="add-test-paln-btn-container">
          <Button type="primary">新增测试计划</Button>
        </div>

        <div className="test-plan-table">
          <Table>
            <Table.Column title="ID" width={80} render={(_: any, index: number) => index + 1} />
            <Table.Column title="所属" dataIndex="?" />
            <Table.Column title="任务名称" dataIndex="?" />
            <Table.Column
              title="计划名称"
              dataIndex="?"
              render={(planName) => <Button type="link">{planName}</Button>}
            />
            <Table.Column title="状态" dataIndex="?" />
            <Table.Column title="当前责任人" dataIndex="?" />
            <Table.Column
              title="操作"
              render={() => (
                <div>
                  <Space>
                    <Button type="link">编辑</Button>
                    <Button type="link">删除</Button>
                    <Button type="link">关联用例</Button>
                  </Space>
                </div>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}

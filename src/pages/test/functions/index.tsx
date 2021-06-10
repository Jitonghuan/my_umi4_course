// 函数管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import { Form, Input, Table, Button, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FELayout from '@cffe/vc-layout';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from './service';
import { getRequest, postRequest } from '@/utils/request';
import { base64Encode, datetimeCellRender } from '@/utils';
import './index.less';

export default function FunctionManager() {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [editField] = Form.useForm<{ content: string; id?: number }>();
  const editModelTitle = useRef('新增函数');

  const handleSearch = () => {
    pageIndex === 1 ? queryData() : setPageIndex(1);
  };

  const queryData = () => {
    setLoading(true);
    getRequest(APIS.funcList, {
      data: { keyword, pageIndex, pageSize },
    })
      .then((result) => {
        const { dataSource, pageInfo } = result.data || {};

        setDataSource(dataSource || []);
        setTotal(pageInfo?.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    queryData();
  }, [pageIndex, pageSize]);

  // 新增函数
  const handleAddClick = useCallback(() => {
    editModelTitle.current = '新增函数';
    editField.resetFields();
    setEditVisible(true);
  }, []);

  const handleEditConfirm = useCallback(async () => {
    const { content, id } = await editField.validateFields();

    if (!id) {
      // 新增
      postRequest(APIS.addFunc, {
        data: {
          funcBody: base64Encode(content),
          createUser: userInfo.userName,
          modifyUser: userInfo.userName,
        },
      }).then(() => {
        message.success('新增成功！');
        setKeyword('');
        setEditVisible(false);
        pageIndex === 1 ? queryData() : setPageIndex(1);
      });
    } else {
      // 修改
      postRequest(APIS.updateFunc, {
        data: {
          id,
          funcBody: base64Encode(content),
          modifyUser: userInfo.userName,
        },
      }).then(() => {
        message.success('修改成功！');
        setEditVisible(false);
        queryData();
      });
    }
  }, [editField]);

  const handleModify = useCallback(
    (record: Record<string, any>, index: number) => {
      editModelTitle.current = '修改函数';
      editField.resetFields();
      editField.setFieldsValue({
        content: record.func || '',
        id: record.id,
      });
      setEditVisible(true);
    },
    [dataSource],
  );

  const confirmDelItem = useCallback(
    async (record: Record<string, any>, index: number) => {
      await postRequest(APIS.delFunc, {
        data: { id: record.id },
      });
      message.success('删除成功！');
      queryData();
    },
    [dataSource],
  );

  return (
    <MatrixPageContent>
      <ContentCard className="page-test-functions">
        <div className="test-page-header">
          <Input.Search
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => handleSearch()}
            onSearch={() => handleSearch()}
            style={{ width: 320 }}
          />
          <Button type="primary" onClick={handleAddClick}>
            <PlusOutlined /> 新增函数
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          loading={loading}
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
          <Table.Column title="函数名" dataIndex="name" ellipsis />
          <Table.Column title="描述" dataIndex="desc" ellipsis />
          <Table.Column title="创建人" dataIndex="createUser" width={140} />
          <Table.Column
            title="操作时间"
            dataIndex="gmtModify"
            width={180}
            render={datetimeCellRender}
          />
          <Table.Column
            title="操作"
            width={120}
            render={(_, record: Record<string, any>, index) => (
              <div className="action-cell">
                <a onClick={(e) => handleModify(record, index)}>修改</a>
                <Popconfirm
                  title="确定要删除该函数吗？"
                  onConfirm={() => confirmDelItem(record, index)}
                >
                  <a>删除</a>
                </Popconfirm>
              </div>
            )}
          />
        </Table>
      </ContentCard>
      <Modal
        visible={editVisible}
        title={editModelTitle.current}
        width={800}
        onOk={handleEditConfirm}
        onCancel={() => setEditVisible(false)}
      >
        <Form form={editField}>
          <Form.Item noStyle name="id">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="content"
            rules={[{ required: true, message: '函数内容不能为空！' }]}
          >
            <Input.TextArea placeholder="请输入函数" autoFocus rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </MatrixPageContent>
  );
}

import React, { useState } from 'react';
import { Button, Form, Modal, Table, Tooltip } from 'antd';
import DebounceSelect from '@/components/debounce-select';
import SelectVersion from './select-version';
import { getRequest } from '@/utils/request';
import { datetimeCellRender } from "@/utils";
import { searchHotFixVersion } from "@/pages/npm-manage/detail/server";
import './index.less';

export default function HotFix() {
  const [dataList, setDataList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [versionVisible, setVersionVisible] = useState(false);
  const [form] = Form.useForm();

  const searchVersion = async (keyword: string) => {
    if (!keyword) return [];

    const result = await getRequest(searchHotFixVersion, {
      data: {
        key: keyword,
        pageIndex: 1,
        pageSize: 20,
      },
    });
    const { dataSource } = result.data || {};
    return (dataSource || []).map((str: string) => ({ label: str, value: str })) as IOption[];
  };


  async function onOk() {
    const values = await form.validateFields();
  }

  return (
    <div className='publish-content-compo hot-fix-wrapper'>
      <div className="table-caption" style={{ marginTop: 16 }}>
        <h4>内容列表</h4>
        <div className="caption-right">

          <Button type="primary" onClick={() => setVisible(true)}>
            新增 hotFix
          </Button>
        </div>
      </div>

      <Table
        rowKey="id"
        dataSource={dataList}
        pagination={false}
        bordered
        scroll={{ x: '100%' }}
      >
        <Table.Column dataIndex="branchName" title="分支名" fixed="left" width={320} />
        <Table.Column
          dataIndex="desc"
          title="发布描述"
          width={200}
          ellipsis={{
            showTitle: false,
          }}
          render={(value) => (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          )}
        />
        <Table.Column dataIndex="gmtCreate" title="创建时间" width={160} render={datetimeCellRender} />
        <Table.Column dataIndex="createUser" title="创建人" width={100} />
        <Table.Column dataIndex="createUser" title="状态" width={100} />
      </Table>

      <Modal
        title="新增hotFix"
        visible={visible}
        confirmLoading={loading}
        onOk={onOk}
        onCancel={() => { setVisible(false) }}
        maskClosable={false}
      >
        <Form form={form}>
          <Form.Item label="版本号(输入x.y)" name="versionPrefix" rules={[{ required: true, message: '请选择版本' }]}>
            <DebounceSelect
              fetchOptions={searchVersion}
              labelInValue={false}
              placeholder="输入x.y搜索"
            />
          </Form.Item>
        </Form>
      </Modal>

      <SelectVersion visible={versionVisible} onClose={() => setVersionVisible(false)} />
    </div>
  )
}

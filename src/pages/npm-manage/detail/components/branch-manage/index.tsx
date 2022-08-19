import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';

import { Button, message, Form, Input, Table, Popconfirm, Tooltip, Select } from 'antd';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';

import { ContentCard } from '@/components/vc-page-content';
import BranchEditor from './branch-editor';
import MasterBranchEditor from './master-editor';

import { queryBranchListUrl, deleteBranch } from '../../server';
import { delRequest } from '@/utils/request';

import { datetimeCellRender } from '@/utils';
import DetailContext from '../../context';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { usePaginated } from '@cffe/vc-hulk-table';
import { useMasterBranchList } from '../../hooks';


export default function BranchManage() {
  const { npmData } = useContext(DetailContext);
  const { npmName } = npmData || {};
  const [searchForm] = Form.useForm();
  const [branchEditMode, setBranchEditMode] = useState<EditorMode>('HIDE'); // 新建分支弹窗
  const [masterBranchEditMode, setMasterBranchEditMode] = useState<EditorMode>('HIDE'); // 新建主干分支弹窗
  const [pending, setPending] = useState(false);
  const [masterBranchOptions, setMasterBranchOptions] = useState<any>([]);
  const [selectMaster, setSelectMaster] = useState<any>('master');
  const [masterListData] = useMasterBranchList({ branchType: 'master', appCode: npmName, isNpm: true });
  const selectRef = useRef(null) as any;

  // 查询数据
  const { run: queryBranchList, tableProps } = usePaginated({
    requestUrl: queryBranchListUrl,
    requestMethod: 'GET',
    showRequestError: true,
    pagination: {
      showSizeChanger: true,
      showTotal: (total: any) => `总共 ${total} 条数据`,
    },
  });

  // feature分支列表
  useEffect(() => {
    if (!npmName || !selectMaster) return;
    queryBranchList({ appCode: npmName, branchType: 'feature', masterBranch: selectMaster, isNpm: true });
  }, [npmName, selectMaster]);

  // 主干分支列表
  useEffect(() => {
    if (masterListData.length !== 0) {
      const option = masterListData.map((item: any) => ({ value: item.branchName, label: item.branchName }));
      setMasterBranchOptions(option);
      const initValue = option.find((item: any) => item.label === 'master');
      searchForm.setFieldsValue({ masterName: initValue?.value || '' });
    }
  }, [masterListData]);

  // 搜索
  const handleSearch = useCallback(() => {
    const values = searchForm.getFieldsValue();
    queryBranchList({
      pageIndex: 1,
      isNpm: true,
      ...values,
    });
  }, [searchForm]);

  // 删除分支
  const handleDelBranch = useCallback(async (record: any) => {
    try {
      setPending(true);
      const res = await delRequest(`${deleteBranch}/${record.id}?isNpm=true`, {
        data: { id: record.id, isNpm: true }
      });
      if (res?.success) {
        message.success('操作成功！');
        queryBranchList();
      }
    } finally {
      setPending(false);
    }
  }, []);

  const handleChange = (v: any) => {
    selectRef?.current?.blur();
    setSelectMaster(v);
  };

  return (
    <ContentCard>
      <div className="table-caption">
        <Form layout="inline" form={searchForm}>
          <Form.Item label="主干分支" name="masterName">
            <Select
              ref={selectRef}
              options={masterBranchOptions}
              value={selectMaster}
              style={{ width: '320px', marginRight: '20px' }}
              onChange={handleChange}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) => {
                // @ts-ignore
                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            />
          </Form.Item>
          <Form.Item label="分支名" name="branchName">
            <Input.Search placeholder="搜索分支名" enterButton onSearch={handleSearch} style={{ width: 320 }} />
          </Form.Item>
        </Form>
        <div>
          <Button type="primary" ghost onClick={() => setMasterBranchEditMode('ADD')}>
            <PlusOutlined />
            新建主干
          </Button>
          <Button type="primary" onClick={() => setBranchEditMode('ADD')} style={{ marginLeft: '10px' }}>
            <PlusOutlined />
            新建分支
          </Button>
        </div>
      </div>
      <Table
        rowKey="id"
        bordered
        dataSource={tableProps.dataSource}
        pagination={tableProps.pagination}
        loading={tableProps.loading || pending}
        scroll={{ y: window.innerHeight - 330, x: '100%' }}
      >
        <Table.Column title="ID" dataIndex="id" width={80} />
        <Table.Column
          title="分支名"
          dataIndex="branchName"
          width={400}
          render={(value) => (
            <div>
              <p>
                <span>{value}</span>
                <CopyToClipboard text={value} onCopy={() => message.success('复制成功！')}>
                  <span style={{ marginLeft: 8, color: '#3591ff' }}>
                    <CopyOutlined />
                  </span>
                </CopyToClipboard>
              </p>
            </div>
          )}
        />
        <Table.Column
          title="描述"
          dataIndex="desc"
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
        <Table.Column
          title="创建时间"
          dataIndex="gmtCreate"
          width={160}
          ellipsis
          render={(value) => (
            <Tooltip placement="topLeft" title={datetimeCellRender(value)}>
              {datetimeCellRender(value)}
            </Tooltip>
          )}
        />
        <Table.Column title="创建人" dataIndex="createUser" width={100} />
        <Table.Column
          title="操作"
          width={100}
          fixed="right"
          align="center"
          render={(_, record: any, index) => (
            <div className="action-cell">
              <Popconfirm title="确定要作废该项吗？" onConfirm={() => handleDelBranch(record)}>
                <a style={{ color: 'red' }}>
                  作废
                </a>
              </Popconfirm>
            </div>
          )}
        />
      </Table>

      <BranchEditor
        appCode={npmName!}
        mode={branchEditMode}
        onSubmit={() => {
          setBranchEditMode('HIDE');
          queryBranchList({
            pageIndex: 1,
            branchType: 'feature',
            masterBranch: selectMaster,
          });
        }}
        onClose={() => setBranchEditMode('HIDE')}
        masterBranchOptions={masterBranchOptions}
        selectMaster={selectMaster}
      />

      <MasterBranchEditor
        appCode={npmName!}
        mode={masterBranchEditMode}
        onSubmit={() => {
          setMasterBranchEditMode('HIDE');
        }}
        onClose={() => setMasterBranchEditMode('HIDE')}
      />
    </ContentCard>
  );
}

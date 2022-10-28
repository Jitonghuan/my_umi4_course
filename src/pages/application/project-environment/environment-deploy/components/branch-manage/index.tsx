import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import moment from 'moment';
import { Button, message, Form, Input, Table, Popconfirm, Tooltip, Select } from 'antd';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import { usePaginated } from '@cffe/vc-hulk-table';
import { datetimeCellRender } from '@/utils';
import BranchEditor from './branch-editor';
import DetailContext from '../../context';
import { queryBranchListUrl, deleteBranch } from '@/pages/application/service';
import { createReview } from '@/pages/application/service';
import { postRequest } from '@/utils/request';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useMasterBranchList } from '@/pages/application/application-detail/components/branch-manage/hook';

export default function BranchManage() {
  const { appData } = useContext(DetailContext);
  const { appCode, appCategoryCode } = appData || {};
  const [searchForm] = Form.useForm();
  const [branchEditMode, setBranchEditMode] = useState<EditorMode>('HIDE');
  const [pending, setPending] = useState(false);
  const [reviewId, setReviewId] = useState<string>('');
  const [masterOption, setMasterOption] = useState<any>([]);
  const [masterBranchOptions, setMasterBranchOptions] = useState<any>([]);
  const [selectMaster, setSelectMaster] = useState<any>('master');
  const [masterListData] = useMasterBranchList({ branchType: 'master', appCode });
  // const currentMaster = useRef();
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

  useEffect(() => {
    if (!appCode || !selectMaster) return;
    queryBranchList({ appCode, branchType: 'feature', masterBranch: selectMaster });
  }, [appCode, selectMaster]);

  useEffect(() => {
    if (masterListData.length !== 0) {
      const option = masterListData.map((item: any) => ({ value: item.branchName, label: item.branchName }));
      setMasterBranchOptions(option);
      const initValue = option.find((item: any) => item.label === 'master');
      searchForm.setFieldsValue({ masterName: initValue?.value || '' });
      // currentMaster.current = initValue?.value || '';
    }
  }, [masterListData]);

  // 搜索
  const handleSearch = useCallback(() => {
    const values = searchForm.getFieldsValue();
    queryBranchList({
      pageIndex: 1,
      ...values,
    });
  }, [searchForm]);

  // 删除分支
  const handleDelBranch = useCallback(async (record: any) => {
    try {
      setPending(true);
      const res = await deleteBranch({ id: record.id });
      if (res.success) {
        message.success('操作成功！');
        queryBranchList();
      }
    } finally {
      setPending(false);
    }
  }, []);
  //创建Review
  const creatReviewUrl = async (record: any) => {
    await postRequest(createReview, { data: { appCode: record.appCode, branch: record.branchName } }).then((reslut) => {
      if (reslut.success) {
        message.success('创建Review成功！');
        queryBranchList({ branchType: 'feature', masterBranch: selectMaster });
      } else {
        // message.error(reslut.errorMsg);
        // queryBranchList({ branchType: 'feature',masterBranch: selectMaster});
      }
    });
  };

  const reviewUrl = (reviewId: string, record: any) => {
    return (
      <a href={'http://upsource.cfuture.shop/' + appCode + '/review/' + reviewId} target="_blank">
        {reviewId}
      </a>
    );
  };

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
                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            />
          </Form.Item>
          <Form.Item label="分支名" name="branchName">
            <Input.Search placeholder="搜索分支名" enterButton onSearch={handleSearch} style={{ width: 320 }} />
          </Form.Item>
        </Form>
        <Button type="primary" onClick={() => setBranchEditMode('ADD')}>
          <PlusOutlined />
          新建分支
        </Button>
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
        {/* <Table.Column title="应用code" dataIndex="appCode" width={300} /> */}
        <Table.Column
          title="分支名"
          dataIndex="branchName"
          width={400}
          render={(value) => (
            <div>
              <p>
                <span>{value}</span>
                <CopyToClipboard text={value} onCopy={() => message.success('复制成功！')}>
                  <span style={{ marginLeft: 8, color: 'royalblue' }}>
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
        <Table.Column title="reviewID" dataIndex="reviewId" width={200} render={reviewUrl} />
        <Table.Column
          title="已部署流水线"
          dataIndex="deployedPipeline"
          width={200}
          ellipsis
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
            // datetimeCellRender(value)
          )}
        />
        <Table.Column title="创建人" dataIndex="createUser" width={100} />
        <Table.Column
          title="操作"
          width={200}
          fixed="right"
          align="center"
          render={(_, record: any, index) => (
            <div className="action-cell">
              <a onClick={() => creatReviewUrl(record)}>
                创建Review
              </a>
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
        appCode={appCode!}
        appCategoryCode={appCategoryCode || ''}
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
    </ContentCard>
  );
}

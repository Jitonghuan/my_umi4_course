// 分支管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 12:41

import React, { useState, useContext, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Button, message, Form, Input, Table, Popconfirm, Tooltip, Divider, Tag } from 'antd';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import { usePaginated } from '@cffe/vc-hulk-table';
import { datetimeCellRender } from '@/utils';
import BranchEditor from './branch-editor';
import DetailContext from '../../context';
import { queryBranchListUrl, deleteBranch } from '@/pages/application/service';
import { createReview } from '@/pages/application/service';
import { postRequest, getRequest } from '@/utils/request';
import { useBranchList, useMasterBranchList } from './hook';
import './index.less';

export default function BranchManage() {
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};
  const [mainForm] = Form.useForm();
  const [form] = Form.useForm();
  const [masterTableData, setMasterTableData] = useState([]); //主干分支表格数据源
  const [tableData, setTableData] = useState([]); //子分支表格数据
  const [masterPage, setMasterPage] = useState<any>({ total: 0, size: 10, pageIndex: 1 }); //主干分页信息
  const [page, setPage] = useState<any>({ total: 0, size: 10, pageIndex: 1 }); //开发分支分页信息
  const [branchEditMode, setBranchEditMode] = useState<EditorMode>('HIDE');
  const [pending, setPending] = useState(false);
  const [reviewId, setReviewId] = useState<string>('');
  const [rowData, setRowData] = useState<any>({});
  const [type, setType] = useState<'master' | 'other'>('master');

  useEffect(() => {
    if (!appCode) return;
    getBranchList({ branch_type: 'master', appCode });
  }, [appCode]);

  useEffect(() => {
    if (masterTableData.length !== 0) {
      // 如果用户没选中任一行或者选中了一行之后但是该行之后被删除了 都要默认选中第一行
      const idList = masterTableData.map((item: any) => item.id);
      if (!idList.includes(rowData.id) || !rowData.id) {
        let data: any = masterTableData[0];
        setRowData({ id: data.id, branchName: data.branchName });
      }
    }
  }, [masterTableData]);

  useEffect(() => {
    if (rowData?.id) {
      getBranchList({ branch_type: 'feature', appCode });
    }
  }, [rowData]);

  // 搜索
  const handleSearch = useCallback(
    (type) => {
      if (type === 'main') {
        const values = mainForm.getFieldsValue();
        getBranchList({ branch_type: 'master', appCode, ...values, pageIndex: 1 });
      } else {
        const values = form.getFieldsValue();
        getBranchList({ branch_type: 'feature', appCode, ...values, pageIndex: 1 });
      }
    },
    [mainForm, form],
  );

  // 获取分支列表
  const getBranchList = (params: any) => {
    const { branch_type } = params;
    getRequest(queryBranchListUrl, { data: { ...params } }).then((res) => {
      if (res.success) {
        let { dataSource, pageInfo } = res?.data;
        if (branch_type === 'master') {
          setMasterTableData(dataSource);
          setMasterPage(pageInfo);
        } else {
          setTableData(dataSource);
          setPage(pageInfo);
        }
      }
    });
  };

  // 删除分支
  const handleDelBranch = useCallback(async (record: any, type: string) => {
    console.log(type, 'type');
    try {
      setPending(true);
      await deleteBranch({ id: record.id });
      message.success('操作成功！');
      if (type === 'master') {
        getBranchList({ branch_type: 'master' });
      } else {
        getBranchList({ branch_type: 'feature' });
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
        // queryBranchList();
      } else {
        message.error(reslut.errorMsg);
        // queryBranchList();
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

  // 分页
  const pageChange = (pagination: any, type: string) => {
    let { current, pageSize } = pagination;
    let obj = { pageIndex: current, pageSize: pageSize };
    if (type === 'main') {
      setMasterPage((value: any) => ({ ...value, pageIndex: current, size: pageSize }));
    } else {
      setPage((value: any) => ({ ...value, pageIndex: current, size: pageSize }));
      // queryBranch(obj)
    }
  };

  const columns: any = (type: any) => [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'name',
      width: 80,
    },
    {
      title: '分支名',
      dataIndex: 'branchName',
      key: 'branchName',
      ellipsis: true,
      width: 400,
      render: (value: any) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      ellipsis: true,
      render: (value: any) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'reviewID',
      dataIndex: 'reviewId',
      key: 'reviewId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '来源主干分支',
      dataIndex: 'masterBranch',
      key: 'masterBranch',
      width: 100,
      ellipsis: true,
    },
    // ...(type !== 'master'
    //   ? [
    //       {
    //         title: '主干分支',
    //         dataIndex: 'masterBranch',
    //         key: 'masterBranch',
    //         width: 100,
    //         ellipsis: true,
    //       },
    //     ]
    //   : []),
    {
      title: '关联流水线',
      dataIndex: 'relationPipeline',
      key: 'relationPipeline',
      width: 100,
    },
    {
      title: '已部署环境',
      dataIndex: 'deployedEnv',
      key: 'deployedEnv',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 160,
      ellipsis: true,
      render: (value: any) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'desc',
      key: 'desc',
      fixed: 'right',
      width: type !== 'master' ? 200 : 100,
      render: (_: any, record: any) => (
        <div className="action-cell">
          {type !== 'master' && (
            <Button type="primary" size="small" onClick={() => creatReviewUrl(record)}>
              创建Review
            </Button>
          )}
          <Popconfirm title="确定要作废该项吗？" onConfirm={() => handleDelBranch(record, type)}>
            <Button type="primary" danger size="small">
              作废
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <ContentCard className="branch-manage-page" style={{ height: '100%' }}>
      {/* 主干分支列表部分 */}
      <div className="branch-section">
        <div className={`branch-section_title`}>主干分支列表</div>
        <div className="table-caption">
          <Form layout="inline" form={mainForm}>
            <Form.Item label="主干分支名称" name="branchName">
              <Input.Search
                placeholder="搜索主干分支名"
                enterButton
                onSearch={() => {
                  handleSearch('main');
                }}
                style={{ width: 320 }}
              />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            onClick={() => {
              setBranchEditMode('ADD'), setType('master');
            }}
          >
            <PlusOutlined />
            新建主干分支
          </Button>
        </div>
        <Table
          rowKey="id"
          bordered
          dataSource={masterTableData}
          columns={columns('master')}
          rowClassName={(record, index) => {
            return `${rowData.id == record.id ? 'selected' : ''}`;
          }}
          onRow={(record: any, index: any) => {
            return {
              onClick: (event) => {
                setRowData({
                  id: record.id,
                  branchName: record.branchName,
                });
              }, // 点击行
            };
          }}
          pagination={{
            total: masterPage.total,
            pageSize: masterPage.size,
            current: masterPage.pageIndex,
            showSizeChanger: true,
            onShowSizeChange: (_, size) => {
              setMasterPage((value: any) => ({ total: value.total, size: size, pageIndex: 1 }));
            },
            showTotal: () => `总共 ${masterPage.total} 条数据`,
          }}
          onChange={(value) => {
            pageChange(value, 'main');
          }}
          scroll={{ y: window.innerHeight - 330, x: '100%' }}
        ></Table>
      </div>

      <Divider />

      {/* 主干分支关联开发列表部分 */}
      <div className="branch-section">
        <div className={`branch-section_title`}>
          主干分支已关联开发分支列表
          <Tag color="blue" style={{ marginLeft: '10px' }}>
            {rowData.branchName}
          </Tag>
        </div>
        <div className="table-caption">
          <Form layout="inline" form={form}>
            <Form.Item label="分支名" name="branchName">
              <Input.Search
                placeholder="搜索分支名"
                enterButton
                onSearch={() => {
                  handleSearch('other');
                }}
                style={{ width: 320 }}
              />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            onClick={() => {
              setBranchEditMode('ADD'), setType('other');
            }}
          >
            <PlusOutlined />
            新建开发分支
          </Button>
        </div>
        <Table
          rowKey="id"
          bordered
          dataSource={tableData}
          columns={columns('dev')}
          pagination={{
            total: page.total,
            pageSize: page.size,
            current: page.pageIndex,
            showSizeChanger: true,
            onShowSizeChange: (_, size) => {
              setPage((value: any) => ({ total: value.total, size: size, pageIndex: 1 }));
            },
            showTotal: () => `总共 ${page.total} 条数据`,
          }}
          onChange={(value) => {
            pageChange(value, 'other');
          }}
          scroll={{ y: window.innerHeight - 330, x: '100%' }}
        ></Table>
      </div>

      <BranchEditor
        type={type}
        appCode={appCode!}
        mode={branchEditMode}
        onSubmit={() => {
          setBranchEditMode('HIDE');
          getBranchList({ branch_type: 'master', appCode, pageIndex: 1 });
        }}
        onClose={() => setBranchEditMode('HIDE')}
        masterTableData={masterTableData}
      />
    </ContentCard>
  );
}

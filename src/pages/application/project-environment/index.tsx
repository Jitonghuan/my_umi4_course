// 项目环境管理
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/14 10:20

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, Spin, message, Divider, Tooltip } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { PlusOutlined, StarFilled, StarTwoTone, CopyOutlined } from '@ant-design/icons';
import { getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { queryProjectEnvList } from './service';
import { queryMyCollectUrl } from '../service';
import { useDeleteProjectEnv, useQueryCategory, useEnvList, useUpdateProjectEnv } from './hook';
import EnvironmentEditDraw from './add-environment';
import './index.less';
import { Radio } from '@cffe/h2o-design';
import DetailList from './environment-detail/detail-list';
import { collectRequst } from '../common';
import { CopyToClipboard } from 'react-copy-to-clipboard';

/** 环境大类 */
const envTypeData = [
  {
    label: 'DEV',
    value: 'dev',
  },
  {
    label: 'TEST',
    value: 'test',
  },
  {
    label: 'PRE',
    value: 'pre',
  },
  {
    label: 'PROD',
    value: 'prod',
  },
];

/** 编辑页回显数据 */
export interface EnvironmentEdit extends Record<string, any> {
  id: number;
  envName: string;
  envCode: string;
  relEnvs: string;
  categoryCode: string;
  envTypeCode: string;
  mark: string;
}
export default function EnvironmentList() {
  const [formList] = Form.useForm();
  const [enviroInitData, setEnviroInitData] = useState<EnvironmentEdit>();
  const [deleteProjectEnv] = useDeleteProjectEnv();
  const [categoryData] = useQueryCategory();
  const [loading, envDataSource] = useEnvList();
  const [updateProjectEnv] = useUpdateProjectEnv();
  const [enviroEditMode, setEnviroEditMode] = useState<EditorMode>('HIDE');
  const [dataSource, setDataSource] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageTotal, setPageTotal] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [type, setType] = useState<'collect' | 'all'>('collect');
  const [rowData, setRowData] = useState<any>({}); //选中一行后
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const typeRef = useRef('collect');
  const [delEnvOpt, setDelEnvOpt] = useState<string>('');
  const queryProjectEnv = async (queryParamsObj: any) => {
    const url = typeRef.current === 'collect' ? queryMyCollectUrl : queryProjectEnvList;
    setListLoading(true);
    if (typeRef.current === 'collect') {
      Object.assign(queryParamsObj, { collectionType: 'projectEnv' });
    }
    await getRequest(url, { data: queryParamsObj })
      .then((res) => {
        if (res?.success) {
          let data = res.data.dataSource;
          let pageTotal = res.data.pageInfo.total;
          let pageIndex = res.data.pageInfo.pageIndex;
          setPageIndex(pageIndex);
          setDataSource(data);
          setPageTotal(pageTotal);
        } else if (!res || !res.success) {
          // 防止接口出现404两个tab页面数据出现混乱的情况
          setDataSource([]);
          setPageTotal(0);
        }
      })
      .catch(() => {
        setDataSource([]);
        setPageTotal(0);
      })
      .finally(() => {
        setListLoading(false);
      });
  };
  useEffect(() => {
    let obj = { pageIndex: 1, pageSize: 20 };
    queryProjectEnv(obj);
  }, []);

  useEffect(() => {
    if (dataSource?.length === 0 && type === 'collect') {
      setRowData({
        id: '',
        envCode: '',
        benchmarkEnvCode: '',
        type: 'projectEnvironment',
        envName: '',
      });
    }
    if (dataSource.length !== 0 && type === 'collect') {
      // 如果用户没选中任一行或者选中了一行之后但是该行之后被删除了 都要默认选中第一行
      const idList = dataSource.map((item: any) => item.id);
      if (!idList.includes(rowData.id) || !rowData.id) {
        let { id, envCode, relEnvs, envName } = dataSource[0];
        setRowData({
          id,
          envCode,
          envName,
          benchmarkEnvCode: relEnvs,
          type: 'projectEnvironment',
        });
      }
    }
  }, [dataSource]);

  // tab切换
  const handleTypeChange = useCallback(
    (e: any) => {
      const next = e.target.value;
      typeRef.current = next;
      setType(next);
      loadListData({ pageIndex, pageSize });
    },
    [type],
  );
  //触发分页
  const pageSizeClick = (pagination: any) => {
    setPageIndex(pagination.current);
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    loadListData(obj);
  };

  const loadListData = (params: any) => {
    const values = formList.getFieldsValue();
    queryProjectEnv({
      ...values,
      ...params,
    });
    // setPageCurrentIndex(pageIndex);
  };

  const saveEditData = () => {
    setEnviroEditMode('HIDE');
    loadListData({ pageIndex: 1, pageSize: 20 });
  };
  // 点击收藏图标
  const switchStar = async (record: any, e: any) => {
    e.stopPropagation();
    const envCode = record.envCode;
    const result = await collectRequst('projectEnv', record.isCollection ? 'cancel' : 'add', envCode);
    if (result) {
      loadListData({ pageIndex, pageSize });
    }
  };
  const onSpin = () => {
    setIsSpinning(true);
  };

  const stopSpin = () => {
    setIsSpinning(false);
  };
  return (
    <PageContainer className="project-env-list project-env-detail">
      <EnvironmentEditDraw
        mode={enviroEditMode}
        initData={enviroInitData}
        onClose={() => {
          setEnviroEditMode('HIDE');
          loadListData({ pageIndex: 1, pageSize: 20 });
        }}
        onSave={saveEditData}
      />
      {/* <Spin spinning={isSpinning}> */}
      <FilterCard>
        <Form
          layout="inline"
          form={formList}
          onFinish={(values: any) => {
            queryProjectEnv({
              ...values,
              pageIndex: 1,
              pageSize: 20,
            });
          }}
          onReset={() => {
            formList.resetFields();
            queryProjectEnv({
              pageIndex: 1,
              // pageSize: pageSize,
            });
          }}
        >
          <Form.Item label="默认分类：" name="categoryCode">
            <Select showSearch style={{ width: 150 }} options={categoryData} />
          </Form.Item>
          <Form.Item label="环境大类：" name="envTypeCode">
            <Select allowClear showSearch style={{ width: 140 }} options={envTypeData} />
          </Form.Item>
          <Form.Item label="基准环境：" name="benchmarkEnvCode">
            <Select showSearch allowClear style={{ width: 150 }} options={envDataSource} loading={loading} />
          </Form.Item>
          <Form.Item label="环境名：" name="envName">
            <Input style={{ width: 150 }} />
          </Form.Item>
          <Form.Item label=" 环境CODE" name="envCode">
            <Input placeholder="请输入环境CODE"></Input>
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
        </Form>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <Radio.Group value={type} onChange={handleTypeChange}>
            <Radio.Button value="collect">我的收藏</Radio.Button>
            <Radio.Button value="all">全部项目环境</Radio.Button>
          </Radio.Group>
          {/* <div className="caption-left">
            <h3>项目环境列表</h3>
          </div> */}
          {/* {type === 'all' && ( */}
          <Button
            type="primary"
            onClick={() => {
              setEnviroEditMode('ADD');
            }}
          >
            <PlusOutlined />
            新增项目环境
          </Button>
          {/* )} */}
        </div>
        <div>
          <Spin spinning={isSpinning}>
            <Table
              rowKey="id"
              bordered
              rowClassName={(record, index) => {
                return `${type === 'collect' && rowData.id == record.id ? 'selected' : ''}`;
              }}
              dataSource={dataSource}
              loading={listLoading}
              onRow={(record: any, index: any) => {
                return {
                  onClick: (event) => {
                    setRowData({
                      id: record.id,
                      envCode: record.envCode,
                      benchmarkEnvCode: record.relEnvs,
                      type: 'projectEnvironment',
                      envName: record.envName,
                    });
                  }, // 点击行
                };
              }}
              pagination={{
                current: pageIndex,
                total: pageTotal,
                pageSize,
                showSizeChanger: true,
                onShowSizeChange: (_, size) => {
                  setPageSize(size);
                  setPageIndex(1);
                },
                showTotal: () => `总共 ${pageTotal} 条数据`,
              }}
              onChange={pageSizeClick}
            >
              <Table.Column title="ID" dataIndex="id" width="4%" />
              {/* <Table.Column title="环境名" dataIndex="envName" width="20%" ellipsis />
               */}
              <Table.Column
                title="环境名"
                width="12%"
                render={(_, record: EnvironmentEdit) => (
                  <>
                    <span onClick={(e) => e.stopPropagation()}>
                      <Popconfirm
                        title={`确定${record.isCollection ? '取消该收藏' : '收藏该环境'}吗？`}
                        onConfirm={(e) => switchStar(record, e)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <span
                          style={{
                            padding: '5px',
                            color: '#ff8419',
                          }}
                        >
                          {record.isCollection ? <StarFilled /> : <StarTwoTone twoToneColor="#ff8419" />}
                        </span>
                      </Popconfirm>
                    </span>
                    {record.envName}
                  </>
                )}
              />
              <Table.Column
                title="环境CODE"
                dataIndex="envCode"
                width="20%"
                ellipsis
                render={(value) => (
                  <div>
                    <span>{value}</span>
                    <CopyToClipboard text={value} onCopy={() => message.success('复制成功！')}>
                      <span style={{ marginLeft: 8, color: 'royalblue' }}>
                        <CopyOutlined />
                      </span>
                    </CopyToClipboard>
                  </div>
                )}
              />
              <Table.Column title="基准环境" dataIndex="relEnvs" width="10%" ellipsis />
              <Table.Column title="默认分类" dataIndex="categoryCode" width="10%" ellipsis />
              <Table.Column title="环境大类" dataIndex="envTypeCode" width="8%" />
              <Table.Column title="备注" dataIndex="mark" width="18%" ellipsis />
              <Table.Column
                title="操作"
                width="18%"
                key="action"
                render={(_, record: EnvironmentEdit, index) => (
                  <Space size="small">
                    <a
                      onClick={() => {
                        history.push({
                          pathname: 'environment-detail',
                          state: {
                            envCode: record.envCode,
                            benchmarkEnvCode: record.relEnvs,
                            type: 'projectEnvironment',
                          },
                        });
                      }}
                    >
                      查看
                    </a>
                    <a
                      onClick={() => {
                        setEnviroEditMode('EDIT');
                        setEnviroInitData(record);
                      }}
                    >
                      编辑
                    </a>
                    <Popconfirm
                      title="确定要删除该信息吗？"
                      onConfirm={() => {
                        let params = formList.getFieldsValue();
                        setDelEnvOpt('del');
                        deleteProjectEnv(record?.envCode).then(() => {
                          queryProjectEnv({
                            pageIndex: 1,
                            ...params,
                            // pageSize: pageSize,
                          });
                        });
                      }}
                    >
                      <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                  </Space>
                )}
              />
            </Table>
          </Spin>
        </div>
        {type === 'collect' && (
          <DetailList dataInfo={rowData} onSpin={onSpin} stopSpin={stopSpin} opt={delEnvOpt}></DetailList>
        )}
      </ContentCard>
      {/* </Spin> */}
    </PageContainer>
  );
}

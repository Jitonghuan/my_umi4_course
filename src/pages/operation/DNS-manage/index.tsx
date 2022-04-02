// DNS管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/04/1 14:15

import React, { useState, useEffect, useCallback } from 'react';
import { history } from 'umi';
import { Input, Table, Popconfirm, Form, Button, Select, Switch, message, Modal, Divider, Tag } from 'antd';
import { LoginOutlined, HighlightOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, delRequest, putRequest } from '@/utils/request';
import AddRecordModal from './addRecordEnv';
import ImportDataModal from './importData';
import { useDnsManageList, useDeleteDnsManage, useUpdateDnsManageStatus } from './hooks';
import appConfig from '@/app.config';

import './index.less';

/** 编辑页回显数据 */
export interface EnvEditData extends Record<string, any> {
  envTypeCode: string;
  envName: string;
  envCode: string;
  categoryCode: string;
  mark: any;
  isBlock: number;
  useNacos: number;
  nacosAddress: string;
  clusterName: string;
  clusterType: string;
  clusterNetType: string;
  ngInstCode: string;
  proEnvType: string;
}

export default function envManageList(props: any) {
  const [tableLoading, pageInfo, dataSource, setPageInfo, getDnsManageList] = useDnsManageList();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageCurrentIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [envDataSource, setEnvDataSource] = useState<Record<string, any>[]>([
    {
      envName: 'his.seenew.com',
      envCode: 'CNAME',
      envTypeCode: '192.168.0.1',
      categoryCode: '正常',
    },
  ]);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [total, setTotal] = useState<number>(0);
  const [addEnvMode, setAddEnvMode] = useState<EditorMode>('HIDE');
  const [importDataMode, setImportDataMode] = useState<EditorMode>('HIDE');
  const [EnvForm] = Form.useForm();
  const [initEnvData, setInitEnvData] = useState<any>([]); //初始化数据
  const [ngModalVisiable, setNgModalVisiable] = useState<boolean>(false);
  const [currentNgCode, setCurrentNgCode] = useState<string>('');
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
  ]; //环境大类
  const proEnvTypeData = [
    {
      label: '项目环境',
      value: 'project',
    },
    {
      label: '基准环境',
      value: 'benchmark',
    },
  ]; //项目环境分类选择

  const handleAddEnv = () => {
    setAddEnvMode('ADD');
  };

  const handleEditEnv = useCallback(
    (record: EnvEditData, index: number, type) => {
      setInitEnvData(record);
      setAddEnvMode(type);
      setEnvDataSource(envDataSource);
    },
    [envDataSource],
  );

  //触发分页
  const pageSizeClick = (pagination: any) => {
    //  setPageIndexInfo(pagination.current);
    setPageInfo({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    });
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    // loadListData(obj);
  };

  const loadListData = (params: any) => {
    const values = EnvForm.getFieldsValue();
  };

  //删除数据
  const handleDelEnv = (record: any) => {
    let id = record.id;
    delRequest(`${appConfig.apiPrefix}/appManage/env/delete/${record.envCode}`).then(() => {
      message.success('删除成功！');
      loadListData({
        pageIndex: 1,
        pageSize: 20,
      });
    });
    // message.success('删除成功！');
  };
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  return (
    <PageContainer className="DNS-list-content">
      <AddRecordModal
        mode={addEnvMode}
        //   initData={initEnvData}
        //   onSave={() => {
        //     setAddEnvMode('HIDE');
        //     setTimeout(() => {
        //       queryEnvData({ pageIndex: 1, pageSize: 20 });
        //     }, 100);
        //   }}
        onClose={() => setAddEnvMode('HIDE')}
      />
      <ImportDataModal mode={importDataMode} onClose={() => setImportDataMode('HIDE')} />
      <ContentCard>
        <div className="dns-server">当前的DNS服务器是：192.9.213.13， 192.9.213.14</div>
        <Divider />
        <div className="table-caption">
          <div className="caption-left">
            <Form layout="inline">
              <Form.Item>
                <Input style={{ width: 220 }} placeholder="请输入关键字"></Input>
              </Form.Item>
              <Form.Item>
                <Button type="primary">搜索</Button>
              </Form.Item>
            </Form>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setInitEnvData(undefined);
                setImportDataMode('ADD');
              }}
            >
              <LoginOutlined />
              导入导出
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setInitEnvData(undefined);
                setAddEnvMode('ADD');
              }}
            >
              <HighlightOutlined />
              添加记录
            </Button>
          </div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <Table
            rowSelection={{ ...rowSelection }}
            dataSource={dataSource}
            loading={tableLoading}
            rowKey="id"
            pagination={{
              current: pageInfo.pageIndex,
              total: pageInfo.total,
              pageSize: pageInfo.pageSize,
              showSizeChanger: true,
              // onChange: (next) => setPageIndex(next),
              onShowSizeChange: (_, size) => {
                setPageInfo({
                  pageIndex: 1,
                  pageSize: size,
                });
              },
              showTotal: () => `总共 ${pageInfo.total} 条数据`,
            }}
            onChange={pageSizeClick}
          >
            <Table.Column title="主机记录" dataIndex="envName" width={150} />
            <Table.Column title="记录类型" dataIndex="envCode" width={130} />
            <Table.Column title="记录值" dataIndex="envTypeCode" width={90} />
            <Table.Column
              title="状态"
              dataIndex="categoryCode"
              width={130}
              render={(value: string, record: any) => (
                <span>
                  <Tag color="green">{value}</Tag>
                </span>
              )}
            />
            <Table.Column title="备注" dataIndex="mark" width={200} />
            <Table.Column
              title="操作"
              width={180}
              render={(_, record: EnvEditData, index) => (
                <div className="action-cell">
                  <Button size="small" type="primary" onClick={() => handleEditEnv(record, index, 'EDIT')}>
                    修改
                  </Button>
                  <Button size="small" type="primary" onClick={() => handleEditEnv(record, index, 'EDIT')}>
                    暂停
                  </Button>
                  <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelEnv(record)}>
                    <Button size="small" style={{ color: 'red' }}>
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}

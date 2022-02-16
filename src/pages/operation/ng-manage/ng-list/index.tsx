// 操作日志
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:35

import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Button, DatePicker, Select, Popconfirm } from 'antd';
import { datetimeCellRender } from '@/utils';
import { PlusOutlined } from '@ant-design/icons';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import { getRequest, delRequest, putRequest } from '@/utils/request';
import { queryNgList } from '../service';
import AddNgDraw from '../add-ng';
import appConfig from '@/app.config';
import { record } from '../type';
import ConfigModal from './config-template';
const mock: any = [
  {
    id: 1,
    ngInstCode: 'testCode1',
    ngInstName: 'testName1',
    confFilePath: '/etc/nginx/conf.d/1-dev.conf',
    templateContext: 'this is for test',
    resourceFilePath: '/usr/share/nginx/1-dev',
    ipAddress: '192.168.54.123',
    reMark: 'test',
    createUser: '王安楠',
    modifyUser: '王安楠',
    gmtCreate: '2022-02-16T15:52:04.000704+08:00',
    gmtModify: '2022-02-16T15:52:04.000707+08:00',
    value: 'fasdfds',
  },
  {
    id: 2,
    ngInstCode: 'testCode2',
    ngInstName: 'testName2',
    confFilePath: '/etc/nginx/conf.d/2-dev.conf',
    templateContext: 'this is for test',
    resourceFilePath: '/usr/share/nginx/2-dev',
    ipAddress: '192.168.54.123',
    reMark: 'test2',
    createUser: '王安楠',
    modifyUser: '王安楠',
    gmtCreate: '2022-02-16T15:52:04.000704+08:00',
    gmtModify: '2022-02-16T15:52:04.000707+08:00',
    value: 'fasdfds',
  },
];
export default function NgList() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParams, setSearchParams] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [detailItem, setDetailItem] = useState<any>();
  const [pageTotal, setPageTotal] = useState<number>();
  const [total, setTotal] = useState<number>(0);
  const [pageCurrentIndex, setPageCurrentIndex] = useState<number>(1);
  const [logList, setLogList] = useState<any>([]); //查看日志列表信息
  const [NgDataSource, setNgDataSource] = useState<any>(mock); //ng实例列表
  const [NgForm] = Form.useForm();
  const [ngMode, setNgMode] = useState<EditorMode>('HIDE');
  const [initNgData, setInitNgData] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [code, setCode] = useState<string>('');
  //  查询
  const queryNgData = (value: any) => {
    // setLoading(true);
    getRequest(queryNgList, {
      data: value,
    })
      .then((result) => {
        if (result?.success) {
          let { pageTotal, pageIndex } = result.data.pageInfo.total;
          setNgDataSource(result?.data?.dataSource);
          setTotal(pageTotal);
          setPageCurrentIndex(pageIndex);
        }
      })
      .finally(() => {
        setLoading(false);
        setPageCurrentIndex(1);
      });
  };
  //   编辑 查看实例
  const handleEditNg = (data: record, index: number, type: EditorMode) => {
    setInitNgData(data);
    setNgMode(type);
  };
  //   删除实例
  const handleDelNg = (data: record) => {
    let id = data.id;
    delRequest(`${appConfig.apiPrefix}/opsManage/ngInstance/delete/id:${id}`);
    loadListData({
      pageIndex: 1,
      pageSize: 20,
    });
  };
  //   分页
  const pageSizeClick = (pagination: any) => {
    setPageCurrentIndex(pagination.current);
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    loadListData(obj);
  };
  //   加载列表数据
  const loadListData = (params: any) => {
    const values = NgForm.getFieldsValue();
    queryNgData({
      ...values,
      ...params,
    });
  };
  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <PageContainer className="tmpl-detail">
      <FilterCard>
        <div>
          <Form
            layout="inline"
            form={NgForm}
            onFinish={(values: any) => {
              queryNgData({
                ...values,
                pageIndex: 1,
                pageSize: 20,
              });
            }}
            onReset={() => {
              NgForm.resetFields();
              queryNgData({
                pageIndex: 1,
                // pageSize: pageSize,
              });
            }}
          >
            <Form.Item label="实例CODE" name="ngInstCode">
              <Input placeholder="请输入实例CODE" style={{ width: 130 }} />
            </Form.Item>
            <Form.Item label="实例名称：" name="ngInstName">
              <Input placeholder="请输入实例名称" style={{ width: 130 }}></Input>
            </Form.Item>
            <Form.Item label="实例IP：" name="ipAddress">
              <Input placeholder="请输入实例IP" style={{ width: 130 }}></Input>
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
            <div style={{ marginLeft: '32px' }}>
              {/* onClick={() => handleAddEnv()} */}
              <Button
                type="primary"
                onClick={() => {
                  initNgData(undefined);
                  setNgMode('ADD');
                }}
              >
                <PlusOutlined />
                新增实例
              </Button>
            </div>
          </Form>
        </div>
      </FilterCard>
      <ContentCard>
        <AddNgDraw
          mode={ngMode}
          initData={initNgData}
          onSave={() => {
            setNgMode('HIDE');
            setTimeout(() => {
              queryNgData({ pageIndex: 1, pageSize: 20 });
            }, 100);
          }}
          onClose={() => setNgMode('HIDE')}
        />
        <ConfigModal visible={visible} handleCancel={handleCancel} value={value} code={code} />
        <div style={{ marginTop: '15px' }}>
          <Table
            dataSource={NgDataSource}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pageIndex,
              total,
              pageSize,
              showSizeChanger: true,
              // onChange: (next) => setPageIndex(next),
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setPageCurrentIndex(1); //
              },
              showTotal: () => `总共 ${total} 条数据`,
            }}
            onChange={pageSizeClick}
          >
            <Table.Column title="ID" dataIndex="id" width={50} />
            <Table.Column title="实例名" dataIndex="ngInstName" width={150} />
            <Table.Column title="实例CODE" dataIndex="ngInstCode" width={130} />
            <Table.Column title="实例IP" dataIndex="ipAddress" width={90} />
            <Table.Column title="配置文件路径" dataIndex="confFilePath" width={180} />
            <Table.Column title="静态资源路径" dataIndex="resourceFilePath" width={180} />
            <Table.Column
              title="配置模版"
              width={80}
              render={(_, record: record, index) => (
                <Button
                  type="link"
                  onClick={() => {
                    setValue(record.value);
                    setCode(record.ngInstCode);
                    setVisible(true);
                  }}
                >
                  查看
                </Button>
              )}
            />
            <Table.Column title="备注" dataIndex="reMark" width={200} />
            <Table.Column
              title="操作"
              width={180}
              render={(_, record: any, index) => (
                <div className="action-cell">
                  <a onClick={() => handleEditNg(record, index, 'VIEW')}>查看</a>

                  <a onClick={() => handleEditNg(record, index, 'EDIT')}>编辑</a>
                  <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelNg(record)}>
                    <a style={{ color: 'red' }}>删除</a>
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

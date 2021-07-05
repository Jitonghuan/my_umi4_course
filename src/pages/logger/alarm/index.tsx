// 日志告警
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:25

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Tag, message, Popconfirm } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { getRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';
import { useAppOptions, useEnvOptions, useStatusOptions } from './hooks';
import { EditorMode } from './interface';
import AlarmEditor from './editor';
import './index.less';

export default function LoggerAlarm() {
  const [searchField] = Form.useForm();
  const [appOptions] = useAppOptions();
  const [envOptions] = useEnvOptions();
  const [statusOptions] = useStatusOptions();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [tableSource, setTableSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [editorMode, setEditorMode] = useState<EditorMode>('HIDE');
  const [editData, setEditData] = useState<any>();

  const queryTableData = (page = pageIndex) => {
    const values = searchField.getFieldsValue();
    setLoading(true);
    getRequest(APIS.getMonitorList, {
      data: {
        ...values,
        pageIndex: page,
        pageSize,
      },
    })
      .then((result) => {
        const { dataSource, pageInfo } = result.data || {};
        setTableSource(dataSource || []);
        setTotal(pageInfo?.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = () => {
    pageIndex === 1 ? queryTableData() : setPageIndex(1);
  };

  const handleEditorSave = () => {
    setEditorMode('HIDE');
    handleSearch();
  };

  useEffect(() => {
    queryTableData();
  }, [pageIndex, pageSize]);

  const handleEditItem = (item: any, index: number) => {
    setEditorMode('EDIT');
    setEditData(item);
  };

  const handleDelItem = async (item: any, index: number) => {
    await delRequest(`${APIS.deleteRule}/${item.ruleId}`);

    message.success('规则删除成功！');
    handleSearch();
  };

  const handleSwitchStatus = async (item: any, index: number) => {
    const nextStatus = item.status === '0' ? '1' : '0';
    await putRequest(APIS.switchRule, {
      data: { ruleId: item.ruleId, status: nextStatus },
    });

    message.success(nextStatus ? '启用成功！' : '停用成功！');

    const nextSource = tableSource.slice(0);
    nextSource[index] = {
      ...nextSource[index],
      status: nextStatus,
    };

    setTableSource(nextSource);
  };

  return (
    <MatrixPageContent className="page-logger-alarm">
      <FilterCard>
        <Form form={searchField} layout="inline" onReset={() => handleSearch()}>
          <Form.Item label="告警名称" name="name">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="应用名称" name="appCode">
            <Select placeholder="请选择" options={appOptions} style={{ width: 168 }} />
          </Form.Item>
          <Form.Item label="环境Code" name="envCode">
            <Select placeholder="请选择" options={envOptions} style={{ width: 168 }} />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select placeholder="请选择" options={statusOptions} style={{ width: 168 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" ghost onClick={handleSearch}>
              查询
            </Button>
            <Button type="default" htmlType="reset" style={{ marginLeft: 12 }}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <h3>告警列表</h3>
          <Button type="primary" onClick={() => setEditorMode('ADD')}>
            + 新增日志告警
          </Button>
        </div>
        <Table
          loading={loading}
          dataSource={tableSource}
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            defaultPageSize: 20,
            onChange: (next) => setPageIndex(next),
            onShowSizeChange: (_, next) => setPageSize(next),
          }}
        >
          <Table.Column dataIndex="id" title="ID" />
          <Table.Column dataIndex="name" title="报警名称" />
          <Table.Column dataIndex="appCode" title="应用Code" />
          <Table.Column dataIndex="envCode" title="环境Code" />
          <Table.Column dataIndex="group" title="报警分类" />
          <Table.Column dataIndex="completeExpression" title="报警表达式" />
          <Table.Column
            dataIndex="level"
            title="告警级别"
            render={(v: string) => {
              const map: Record<string, string> = { '2': '警告', '3': '严重', '4': '灾难' };
              const colors: Record<string, string> = { '2': 'orange', '3': 'red', '4': '#f50' };
              const text = map[v];
              return text ? <Tag color={colors[v]}>{text}</Tag> : null;
            }}
          />
          <Table.Column
            dataIndex="status"
            title="状态"
            render={(v, record) => {
              return v === '1' ? (
                <Tag color="success">已启用</Tag>
              ) : +v === 0 ? (
                <Tag color="default">已关闭</Tag>
              ) : null;
            }}
          />
          <Table.Column
            title="操作"
            width={160}
            render={(_, record: any, index) => {
              const isEnable = record.status === '1';

              return (
                <div className="action-cell">
                  <a onClick={() => handleEditItem(record, index)}>编辑</a>
                  <Popconfirm title="确定要删除该规则吗？" onConfirm={() => handleDelItem(record, index)}>
                    <a style={{ color: 'red' }}>删除</a>
                  </Popconfirm>
                  <Popconfirm
                    title={`确定要${isEnable ? '停用' : '启用'}该规则吗？`}
                    onConfirm={() => handleSwitchStatus(record, index)}
                  >
                    <a style={{ color: isEnable ? 'orange' : 'green' }}>{isEnable ? '停用' : '启用'}</a>
                  </Popconfirm>
                </div>
              );
            }}
          />
        </Table>

        <AlarmEditor
          mode={editorMode}
          onClose={() => setEditorMode('HIDE')}
          onSave={handleEditorSave}
          initData={editData}
        />
      </ContentCard>
    </MatrixPageContent>
  );
}

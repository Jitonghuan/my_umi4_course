import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Form, Input, Button, Popconfirm, Switch, message, Tag } from 'antd';
import { history } from 'umi';
import { queryRuleList } from './hook';
import { dependecyTableSchema } from './schema';
import { PlusOutlined } from '@ant-design/icons';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import { getRequest, delRequest } from '@/utils/request';
import appConfig from '@/app.config';
import { addRule, getRuleList, updateRule } from './service';
import RuleDrawer from './component/rule-drawer';
import WhiteListModal from './component/white-list-modal';

export default function RelyMangement() {
  const [form] = Form.useForm();
  const [ruleList, setRuleList] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [whiteListDrawer, setWhiteListDrawer] = useState<EditorMode>('HIDE');
  const [curRecord, setCurRecord] = useState<any[]>([]);
  const [dependencyMode, setDependencyMode] = useState<EditorMode>('HIDE');
  useEffect(() => {
    getRuleList();
  }, []);
  // 获取列表数据
  const getRuleList = (params?: any) => {
    const value = form.getFieldsValue();
    setLoading(true);
    queryRuleList({ ...params, ...value })
      .then((res: any) => {
        debugger;
        console.log('res?.dataSource', res);
        setRuleList(res?.dataSource);
        setTotal(res?.pageInfo?.total);
      })
      .catch((error) => {
        setRuleList([]);
        setTotal(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  console.log('ruleList', ruleList);
  // 表格列配置
  const tableColumns = useMemo(() => {
    return dependecyTableSchema({
      onEditClick: (record, index) => {
        setCurRecord(record);
        setDependencyMode('EDIT');
      },
      onViewClick: (record, index) => {
        setCurRecord(record);
        setDependencyMode('VIEW');
      },
      onDelClick: async (record, index) => {
        await handleDeleteRule(record?.id).then(() => {
          getRuleList();
        });
      },
      onSwitchEnableClick: (record, index) => {
        switchChange(record);
      },
    }) as any;
  }, []);

  const pageSizeClick = (pagination: any) => {
    setPageIndex(pagination.current);
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    getRuleList(obj);
  };

  const handleDeleteRule = async (id: number) => {
    const res = await delRequest(`${appConfig.apiPrefix}/appManage/dependencyManage/deleteRule/${id}`);
    if (res?.success) {
      getRuleList({ pageIndex: 1, pageSize });
    }
  };
  // 切换校验开关
  const switchChange = async (record: any) => {
    const res = await updateRule({ isEnable: record.isEnable ? 0 : 1, id: record.id });
    if (res.success) {
      message.success('操作成功！');
      getRuleList({ pageIndex: 1, pageSize });
    }
  };

  return (
    <PageContainer className="dependency-list">
      <FilterCard>
        <div>
          <Form
            layout="inline"
            form={form}
            onFinish={(values: any) => {
              getRuleList({
                ...values,
                pageIndex: 1,
                pageSize: 20,
              });
            }}
            onReset={() => {
              form.resetFields();
              getRuleList({
                pageIndex: 1,
                pageSize: 20,
              });
            }}
          >
            <Form.Item label="规则名称：" name="ruleName">
              <Input placeholder="请输入规则名称" style={{ width: 240 }} />
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
        </div>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>依赖规则列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setWhiteListDrawer('VIEW');
              }}
            >
              全局白名单
            </Button>

            <Button
              type="primary"
              onClick={() => {
                setDependencyMode('ADD');
              }}
            >
              <PlusOutlined />
              新增规则
            </Button>
          </div>
        </div>
        <div style={{ marginTop: '15px' }}>
          <Table
            columns={tableColumns}
            dataSource={ruleList}
            bordered
            loading={loading}
            pagination={{
              current: pageIndex,
              total,
              pageSize,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setPageIndex(1); //
              },
              showTotal: () => `总共 ${total} 条数据`,
            }}
            onChange={pageSizeClick}
          />
        </div>
      </ContentCard>
      <RuleDrawer
        mode={dependencyMode}
        onSave={() => {
          setDependencyMode('HIDE');
          getRuleList({ pageIndex, pageSize });
        }}
        onClose={() => {
          setDependencyMode('HIDE');
        }}
        initData={curRecord}
      />
      <WhiteListModal
        mode={whiteListDrawer}
        onSave={() => {
          setWhiteListDrawer('HIDE');
        }}
        onClose={() => {
          setWhiteListDrawer('HIDE');
        }}
        initData={curRecord}
      />
    </PageContainer>
  );
}

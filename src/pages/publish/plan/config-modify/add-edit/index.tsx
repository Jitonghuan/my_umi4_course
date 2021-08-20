import React, { useState, useEffect, useContext } from 'react';
import { Form, Card, Button, Input, Row, Col, Space, message, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { history } from 'umi';
import { ContentCard } from '@/components/vc-page-content';
import BaseForm from '../../components/base-form';
import { InitValue, BaseFormProps } from '../../../typing';
import { addPublishPlanMultiReq, queryFunctionReq, updatePublishPlanReq } from '@/pages/publish/service';
import usePublicData from '@/utils/usePublicData';
import FEContext from '@/layouts/basic-layout/fe-context';
import { queryAppList } from '../../../service';
import { createTableColumns } from './schema';

import './index.less';

interface ModifyProps extends InitValue {
  config?: string;
  planId?: string;
  DDL?: string;
  DML?: string;
  appCategoryCode?: string;
  appGroupCode?: string;
}

interface IProps {
  initValueObj?: {
    plan: ModifyProps;
    funcIds: any[];
  };
  type: 'add' | 'edit' | 'check';
}

// 搜索节流
let searchTimeout: NodeJS.Timeout;
let currentSearchValue: string;

const Coms: React.FC<IProps> = ({ initValueObj, type }) => {
  const [form] = Form.useForm();
  const isCheck = type === 'check';

  const { categoryData = [], businessData: businessDataList = [] } = useContext(FEContext);

  const { envsUrlList } = usePublicData({
    isEnvType: false,
    isUseAppBranch: false,
    isUseAppEnv: false,
    isUseAppLists: false,
    isUseAppType: false,
    isEnvsUrl: true,
  });

  const mergeTableColumns = [
    ...createTableColumns({
      categoryData,
      businessDataList,
      envsUrlList,
    }),
    ...(!isCheck
      ? [
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text: string, record: any, index: number) => {
              return (
                <Button
                  type="link"
                  onClick={() => {
                    tableData.splice(index, 1);
                    setTableData([...tableData]);
                  }}
                >
                  删除
                </Button>
              );
            },
          },
        ]
      : []),
  ];

  const [searchFunc, setSearchFunc] = useState<string | undefined>(undefined);
  // 发布功能搜索结果
  const [options, setOptions] = useState<any[]>([]);
  // 已关联的发布功能
  const [tableData, setTableData] = useState<any[]>([]);

  const [appList, setAppList] = useState<any[]>([]);

  useEffect(() => {
    queryAppList().then((resp) => {
      setAppList(
        resp.map((el: any) => {
          return {
            ...el,
            key: el.value,
            value: el.label,
          };
        }),
      );
    });
  }, []);

  useEffect(() => {
    if (!initValueObj) {
      form.setFieldsValue({});
    } else {
      form.setFieldsValue(initValueObj?.plan);
      if (initValueObj?.funcIds?.length) {
        const { appCategoryCode = '', appGroupCode = '' } = initValueObj?.plan;
        initValueObj.funcIds.map((funcId) => {
          queryFuncs({ appCategoryCode, funcId }); //appGroupCode
        });
      }
    }
  }, [initValueObj]);

  const queryFuncs = (params: {
    appCategoryCode: string;
    // appGroupCode: string;
    funcName?: string;
    funcId?: string;
    // 是否是输入框搜索，否表示编辑时初始化查询
    isSearch?: boolean;
  }) => {
    queryFunctionReq({ ...params }).then((result) => {
      if (!result) return;
      if (params.isSearch) {
        if (currentSearchValue === params.funcName) {
          setOptions(
            result.map((el: any) => {
              return {
                ...el,
                value: el.id,
                label: el.funcName,
              };
            }),
          );
        }
      } else {
        tableData.push(...result);
        setTableData([...tableData]);
      }
    });
  };

  const submit = () => {
    form.validateFields().then((value) => {
      const { configs, DDL, DML } = value;
      console.log('validateFields', value);
      if (!tableData.length && !configs && !DDL && !DML) {
        message.error('至少配置一种变更内容！');
        return;
      }
      const { preDeployTime, ...rest } = value;
      const reqFunc = type === 'add' ? addPublishPlanMultiReq : updatePublishPlanReq;
      reqFunc({
        plan: {
          ...(type === 'edit' ? { planId: initValueObj?.plan.planId } : {}),
          ...rest,
          preDeployTime: preDeployTime.format('YYYY-MM-DD'),
        },
        funcIds: tableData.map((row) => row.funcId),
      }).then((resp) => {
        if (resp.success) {
          message.info('保存发布计划成功!');
          history.goBack();
        }
      });
    });
  };

  const handleSearch = (value: string) => {
    const appCode = form.getFieldValue('appCode');
    if (appCode) {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      currentSearchValue = value;
      searchTimeout = setTimeout(() => {
        const appInfo = appList.filter((app) => app.appCode === appCode);
        if (appInfo && appInfo[0]) {
          const { appCategoryCode, appGroupCode } = appInfo[0];
          queryFuncs({
            appCategoryCode,
            // appGroupCode,
            funcName: value,
            isSearch: true,
          });
        }
      }, 300);
    } else {
      message.info('请先选择应用');
    }
  };

  const handleChange = (value: string) => {
    if (value) {
      const func = options.filter((option) => option.id === value);
      if (func && func[0]) {
        const rest = tableData.filter((row) => row.id !== value);
        rest.push(...func);
        setTableData(rest);
      }
    }
    setSearchFunc(value);
  };

  return (
    <ContentCard>
      <Card bordered={false} title="基本信息" className="base-info" headStyle={{ paddingLeft: 0 }}>
        <Form form={form} className="form-list">
          {
            <BaseForm
              initValueObj={initValueObj?.plan}
              isCheck={isCheck}
              appList={appList}
              appChange={() => {
                setTableData([]);
                setOptions([]);
              }}
            />
          }
        </Form>
      </Card>
      <Card bordered={false} title="关联相关功能" headStyle={{ paddingLeft: 0 }} className="content-info">
        <Row>
          <Col span={22} offset={2}>
            {!isCheck && (
              <Select
                showSearch
                placeholder="请输入关键词搜索发布功能"
                onSearch={handleSearch}
                onChange={handleChange}
                defaultActiveFirstOption={false}
                value={searchFunc}
                showArrow={false}
                filterOption={false}
                style={{ width: '60%', marginBottom: 10 }}
              >
                {options.map((d) => (
                  <Select.Option key={d.value} value={d.value}>
                    {d.label}
                  </Select.Option>
                ))}
              </Select>
            )}
            <Table columns={mergeTableColumns as ColumnsType<any>} dataSource={tableData} pagination={false} bordered />
          </Col>
        </Row>
      </Card>
      <Card bordered={false} title="配置变更内容" headStyle={{ paddingLeft: 0 }} className="content-info">
        <Row>
          <Col span={24}>
            <Form form={form} className="form-list">
              <Form.Item
                label="配置变更"
                name="configs"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 18 }}
                initialValue={initValueObj?.plan?.config}
              >
                <Input.TextArea rows={18} placeholder="请在此输入配置变更内容" disabled={isCheck} />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
      <Card bordered={false} title="配置数据库变更内容" headStyle={{ paddingLeft: 0 }} className="content-info">
        <Row>
          <Col span={24}>
            <Form form={form} className="form-list">
              <Form.Item
                label="DDL"
                name="DDL"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 18 }}
                initialValue={initValueObj?.plan?.DDL}
              >
                <Input.TextArea rows={18} placeholder="请在此输入数据库变更内容" disabled={isCheck} />
              </Form.Item>
              <Form.Item
                label="DML"
                name="DML"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 18 }}
                initialValue={initValueObj?.plan?.DML}
              >
                <Input.TextArea rows={18} placeholder="请在此输入数据库变更内容" disabled={isCheck} />
              </Form.Item>
              {!isCheck && (
                <Form.Item wrapperCol={{ span: 18, offset: 2 }}>
                  <Space>
                    <Button type="primary" onClick={submit}>
                      确定
                    </Button>
                    <Button onClick={() => history.goBack()}>取消</Button>
                  </Space>
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>
      </Card>
    </ContentCard>
  );
};

export default Coms;

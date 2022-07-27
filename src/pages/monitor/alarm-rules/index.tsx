// 告警规则
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, {useEffect, useState} from 'react';
import {Form, Select, Input, Button, Row} from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import RulesTable from './_components/rules-table';
import { useAppOptions, useStatusOptions, useEnvListOptions } from './hooks';
import useTable from '@/utils/useTable';
import { queryGroupList, queryRulesList } from '../basic/services';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import useRequest from "@/utils/useRequest";
import UserSelector from "@/components/user-selector";
import './index.less';
import {getRequest} from "@/utils/request";

const rulesOptions = [
  {
    key: 2,
    value: 2,
    label: '警告',
  },
  {
    key: 3,
    value: 3,
    label: '严重',
  },
  {
    key: 4,
    value: 4,
    label: '灾难',
  },
];

export default function AlarmRules() {
  const [searchRulesForm] = Form.useForm();
  const [statusOptions] = useStatusOptions();
  const [appOptions] = useAppOptions();
  const [clusterEnvOptions, queryEnvCodeList] = useEnvListOptions();
  const [expand, setExpand] = useState(false);
  const [groupData, setGroupData] = useState<any[]>([]);
  const [tableProps, setTableProps] = useState<any>({});

  const [currentEnvType, setCurrentEnvType] = useState('');
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code

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

  const queryList = async (page?: any) => {
    const param = await searchRulesForm.getFieldsValue();
    const res = await getRequest(queryRulesList, {
      data: {
        ...param,
        pageIndex: page?.pageIndex || 1,
        pageSize: page?.pageSize || 20,
        envCode: currentEnvCode
      }
    })
    if (res?.success) {
      setTableProps(res.data);
    }
  }

  //分类
  const { run: groupList } = useRequest({
    api: queryGroupList,
    method: 'GET',
    onSuccess: (data) => {
      setGroupData(
        data?.map((v: any) => {
          return {
            key: v,
            value: v,
          };
        }),
      );
    },
  });

  useEffect(() => {
    void groupList();
    void queryList();
  }, [])

  return (
    <PageContainer>
      <FilterCard>
        <Form
          layout="inline"
          className="alarm-rules-search-wrapper"
          form={searchRulesForm}
          onFinish={(values: any) => {
            queryList();
          }}
          onReset={() => {
            searchRulesForm.resetFields();
            queryList();
          }}
        >
          <Form.Item label="环境" name="envCode">
            <Select
              style={{ width: '100px' }}
              options={envTypeData}
              value={currentEnvType}
              placeholder="分类"
              onChange={(value) => {
                setCurrentEnvType(value);
                setCurrentEnvCode('');
                void queryEnvCodeList(value);
              }}
              allowClear
            />
            <Select
              style={{ width: '140px', marginLeft: '5px' }}
              options={clusterEnvOptions}
              placeholder="环境名称"
              onChange={(value) => {
                setCurrentEnvCode(value);
              }}
              value={currentEnvCode}
              allowClear
            />
          </Form.Item>
          <Form.Item label="关联应用" name="appCode">
            <Select showSearch allowClear style={{ width: 140 }} options={appOptions} />
          </Form.Item>
          <Form.Item label="报警名称" name="name">
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select showSearch allowClear style={{ width: 120 }} options={statusOptions} />
          </Form.Item>
          {
            expand && (
              <>
                <Form.Item label="分类" name="group">
                  <Select options={groupData} placeholder="请选择" style={{ width: '245px' }} allowClear />
                </Form.Item>
                <Form.Item label="级别" name="level">
                  <Select options={rulesOptions} placeholder="请选择" style={{ width: '170px' }} allowClear />
                </Form.Item>
                <Form.Item label="通知对象" name="receiver">
                  <UserSelector style={{ width: '380px' }} />
                </Form.Item>
                <Row>
                  <Form.Item label="表达式" name="expression">
                    <Input style={{ width: '460px' }} />
                  </Form.Item>
                </Row>
              </>
            )
          }
          <Form.Item>
            <a
              onClick={() => {
                setExpand(!expand);
              }}
              style={{ marginRight: '10px' }}
            >
              {expand ? <><UpOutlined />收起</>: <><DownOutlined />更多</>}
            </a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset" danger>
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <RulesTable dataSource={tableProps} onQuery={queryList} />
      </ContentCard>
    </PageContainer>
  );
}

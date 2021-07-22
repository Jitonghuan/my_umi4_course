// 应用同步页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/13 15:30
import React, { useContext, useState, useEffect } from 'react';
import { Radio, Button, Card, Tag, Row, Col, Space, Select, Table, Modal, message, Form, Popconfirm } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import HeaderTabs from '../components/header-tabs';
import { result } from '_@types_lodash@4.14.171@@types/lodash';
import { copyScene } from '@/pages/test/autotest/service';
export default function Application(props: any) {
  const { confirm } = Modal;
  const [searchField] = Form.useForm();
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableSource, setTableSource] = useState<any[]>([]);
  // const [tableSource, setTableSource] = useState<Record<string, any>[]>([]);

  // useEffect(() => {
  //   queryTableData();
  // }, [pageIndex, pageSize]);
  const queryTableData = () => {
    // const values = searchField.getFieldsValue();
  };
  const onFinish = (values: any) =>
    getRequest('/v1/appManage/env/list', {
      data: { AppName: 'ac' },
    })
      .then((result) => {
        console.log('>>>>>>>, in res', result);

        // const dataSource = [
        //   {
        //     Name: 'A集群',
        //     appName: result.data?.ClusterA?.name,
        //     RegionId: result.data?.ClusterA?.RegionId,
        //     PackageVersion: result.data?.ClusterA?.PackageVersion,
        //     PackageMd5: result.data?.ClusterA?.PackageMd5,
        //   },
        //   {
        //     Name: 'B集群',
        //     // appName: result.data.ClusterB.name,
        //     // RegionId:result.data.ClusterB.RegionId,
        //     // PackageVersion: result.ClusterB.PackageVersion,
        //     // PackageMd5: result.ClusterB.PackageMd5,
        //   },
        // ];
        // setTableSource(dataSource || []);
      })
      .catch((error) => {
        console.log('发生错误');
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  const handleSearch = () => {
    queryTableData();
  };

  const { Option } = Select;
  const [total, setTotal] = useState<number>(0);
  const showConfirm = () => {};

  function onChange(value: any) {
    console.log('onChange:', `selected ${value}`);
  }

  function onBlur() {
    console.log('+++++', 'blur');
  }

  function onFocus() {
    console.log('+++++', 'focus');
  }

  function onSearch(val: any) {
    console.log('search:', val);
  }
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="application-synchro" history={props.history} />
      <ContentCard>
        <div className="search" style={{ height: '50px' }}>
          <Form layout="inline" form={searchField} onFinish={onFinish}>
            <Form.Item label="需要同步的应用" name="AppName">
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="浙医应用名"
                defaultValue="esr"
                // optionFilterProp="children"
                // onChange={onChange}
                // onFocus={onFocus}
                // onBlur={onBlur}
                // onSearch={onSearch}
                // filterOption={(input, options) =>
                //     options.OptionData.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // }
              >
                <Option value="ac">Jack</Option>
                <Option value="ac">Lucy</Option>
                <Option value="ac">Tom</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="submit" onClick={handleSearch}>
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="ghost"
                htmlType="reset"
                onClick={() => {
                  searchField.resetFields();
                }}
              >
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="table">
          <ul>
            <li>
              <Table dataSource={tableSource} bordered pagination={false}>
                <Table.Column title="集群" dataIndex="Name" />
                <Table.Column title="版本号" dataIndex="PackageVersion" ellipsis />
                <Table.Column title="版本MD5值" dataIndex="PackageMd5" ellipsis />
              </Table>
            </li>

            <li style={{ height: '30px', marginTop: '30px' }}>
              <Space size="large" style={{ float: 'right' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    confirm({
                      title: '确认同步',
                      icon: <QuestionCircleOutlined />,
                      content: '请确认同步应用配置已经是最新',
                      onOk() {
                        console.log('OK');
                      },
                      onCancel() {
                        console.log('Cancel');
                      },
                    });
                  }}
                >
                  同步
                </Button>
                <Button type="default" htmlType="reset">
                  取消
                </Button>
              </Space>
            </li>
          </ul>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}

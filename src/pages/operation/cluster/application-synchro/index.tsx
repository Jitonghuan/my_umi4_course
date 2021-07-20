// 应用集群页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/13 15:30
import React, { useContext, useState, useEffect } from 'react';
import { Radio, Button, Card, Tag, Row, Col, Space, Select, Table, Modal, message, Form, Popconfirm } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import HeaderTabs from '../components/header-tabs';
export default function Application(props: any) {
  const { confirm } = Modal;
  const [options, setOptions] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([
    {
      key: '1',
      Name: 'A集群',
      PackageVersion: '1',
      PackageMd5: '44',
    },
    {
      key: '2',
      Name: 'B集群',
      PackageVersion: '7',
      PackageMd5: '000',
    },
  ]);
  //     const res =  getRequest('https://release.zy91.com:4443/futuredog/v1/opsManage/diffApp', {
  //     Appname:'integrated-platform'

  //   });
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
          <Form layout="inline">
            <Form.Item label="需要同步的应用">
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="浙医应用名"
                optionFilterProp="children"
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                // filterOption={(input, options) =>
                //     options.OptionData.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="submit">
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
        <div className="table">
          <ul>
            <li>
              <Table dataSource={dataSource} bordered pagination={false}>
                <Table.Column title="集群" dataIndex="Name" />
                <Table.Column title="版本号" dataIndex="PackageVersion" ellipsis />
                <Table.Column title="版本MD5值" dataIndex="PackageMd5" ellipsis />
              </Table>
            </li>

            {/* <li style={{height:'30px',marginTop:'10px'}}>
                        <span style={{ float: 'left',color:'red'}}>提示：请确认同步应用配置已经是最新！</span>
                    </li> */}

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

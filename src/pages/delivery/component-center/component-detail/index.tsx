//组件详情
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import AceEditor from '@/components/ace-editor';
import { Form, Tabs, Input, Select, Button, Descriptions, Typography, Card, message, Popconfirm, Divider } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useQueryComponentList, useQueryComponentInfo, useUpdateComponent } from './hooks';
import './index.less';
export default function ComponentDetail() {
  const { initRecord, componentName, componentVersion, componentDescription, componentType, activeTab }: any =
    history.location.state;
  const { TabPane } = Tabs;
  const tabOnclick = (key: any) => {};
  const { Paragraph } = Typography;
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [buttonText, setButtonText] = useState<string>('编辑');
  const [editableStr, setEditableStr] = useState(initRecord?.componentDescription);
  const [loading, versionOptions, queryComponentVersionList] = useQueryComponentList();
  const [infoLoading, componentInfo, queryComponentInfo] = useQueryComponentInfo();
  const [updateLoading, updateComponent] = useUpdateComponent();
  useEffect(() => {
    if (componentVersion && componentName) {
      queryComponentVersionList(componentName, componentType);
      queryComponentInfo(componentName, componentVersion, componentType);
    } else {
      return;
    }
  }, [componentName]);
  const changeVersion = () => {};
  return (
    <PageContainer>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>组件名称：{componentName}</h3>
            <Select
              style={{ width: 220, paddingLeft: 20 }}
              loading={loading}
              options={versionOptions}
              defaultValue={componentVersion}
              onChange={changeVersion}
            ></Select>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                history.push({
                  pathname: '/matrix/delivery/component-center',
                });
              }}
            >
              返回
            </Button>
          </div>
        </div>
        <Tabs defaultActiveKey="1" onChange={tabOnclick} type="card">
          <TabPane tab="组件信息" key="component-info">
            <div>
              <Descriptions title="基本信息" column={2}>
                <Descriptions.Item label="组件名称">{componentInfo?.componentName}</Descriptions.Item>
                <Descriptions.Item label="组件描述">
                  <Paragraph
                    editable={{
                      onChange: (componentDescription: string) => {
                        updateComponent({ componentDescription, ...componentInfo }).then(() => {
                          setEditableStr(componentDescription);
                        });
                      },
                    }}
                  >
                    {editableStr}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="组件类型">{componentInfo?.componentType}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{componentInfo?.gmtCreate}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{componentInfo?.gmtModify}</Descriptions.Item>
                <Descriptions.Item label="组件地址" span={2}>
                  {componentInfo?.componentUrl}
                </Descriptions.Item>
              </Descriptions>
              <Divider />
              <div>
                <div className="instruction">组件说明:{componentInfo?.componentExplanation}</div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="组件配置" key="component-config">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
              <p>
                <Button
                  type={buttonText === '编辑' ? 'primary' : 'default'}
                  onClick={() => {
                    if (readOnly) {
                      setReadOnly(false);
                      setButtonText('取消编辑');
                    } else {
                      setReadOnly(true);
                      setButtonText('编辑');
                    }
                  }}
                >
                  {buttonText}
                </Button>
              </p>
            </div>
            <div>
              <Form>
                <Form.Item>
                  <AceEditor
                    mode="yaml"
                    height={'52vh'}
                    readOnly={readOnly}
                    defaultValue={componentInfo?.componentConfiguration}
                  />
                </Form.Item>
                <Form.Item>
                  <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary">保存配置</Button>
                  </span>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </Tabs>
      </ContentCard>
    </PageContainer>
  );
}

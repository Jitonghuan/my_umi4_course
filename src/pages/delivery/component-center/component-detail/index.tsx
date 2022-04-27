//组件详情
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import AceEditor from '@/components/ace-editor';
import { Form, Tabs, Input, Select, Button, Descriptions, Typography, Divider } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import {
  useQueryComponentList,
  useQueryComponentInfo,
  useUpdateComponent,
  useUpdateDescription,
  useUpdateConfiguration,
} from './hooks';
import './index.less';
export default function ComponentDetail() {
  const { initRecord, componentName, componentVersion, componentDescription, componentType, activeTab, type }: any =
    history.location.state;
  const { TabPane } = Tabs;
  const tabOnclick = (key: any) => {};
  const [configForm] = Form.useForm();
  const { Paragraph } = Typography;
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [buttonText, setButtonText] = useState<string>('编辑');
  const [editableStr, setEditableStr] = useState(initRecord?.componentDescription);
  const [editLoading, updateDescription] = useUpdateDescription();
  const [updateLoading, updateConfiguration] = useUpdateConfiguration();
  const [loading, versionOptions, queryComponentVersionList] = useQueryComponentList();
  const [infoLoading, componentInfo, queryComponentInfo] = useQueryComponentInfo();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  // const [updateLoading, updateComponent] = useUpdateComponent();
  useEffect(() => {
    if (componentVersion && componentName) {
      queryComponentVersionList(componentName, componentType);
      queryComponentInfo(componentName, componentVersion, componentType);
    } else {
      return;
    }
    if (type === 'componentCenter') {
      setButtonDisabled(true);
    }
    return () => {
      setButtonDisabled(false);
    };
  }, [componentName]);

  const changeVersion = (value: string) => {
    queryComponentInfo(componentName, value, componentType);
  };
  const saveConfig = () => {
    const configuration = configForm.getFieldsValue();
    updateConfiguration(configuration.config);
  };
  return (
    <PageContainer>
      <ContentCard className="component-detail">
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
              <Descriptions
                title="基本信息"
                column={2}
                bordered={true}
                // labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
                // contentStyle={{ color: '#000' }}
              >
                <Descriptions.Item label="组件名称">{componentInfo?.componentName || '--'}</Descriptions.Item>
                <Descriptions.Item label="组件描述">
                  <Paragraph
                    editable={{
                      onChange: (componentDescription: string) => {
                        updateDescription(componentDescription).then(() => {
                          setEditableStr(componentDescription);
                        });
                      },
                    }}
                  >
                    {editableStr || '--'}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="组件类型">{componentInfo?.componentType || '--'}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{componentInfo?.gmtCreate || '--'}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{componentInfo?.gmtModify || '--'}</Descriptions.Item>
                <Descriptions.Item label="组件地址" span={2}>
                  {componentInfo?.componentUrl || '--'}
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
                  disabled={buttonDisabled}
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
              <Form form={configForm}>
                <Form.Item name="config">
                  <AceEditor
                    mode="yaml"
                    height={'52vh'}
                    readOnly={readOnly}
                    defaultValue={componentInfo?.componentConfiguration}
                  />
                </Form.Item>
                <Form.Item>
                  <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={saveConfig} loading={updateLoading}>
                      保存配置
                    </Button>
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

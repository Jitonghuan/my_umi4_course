//组件详情
import { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import moment from 'moment';
import { queryComponentInfoApi } from '../../service';
import { getRequest } from '@/utils/request';
import AceEditor from '@/components/ace-editor';
import { Form, Tabs, Select, Button, Descriptions, Typography, Divider, Spin } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useQueryComponentList, useUpdateDescription, useUpdateConfiguration } from './hooks';
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
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [componentInfo, setComponentInfo] = useState<any>({});
  const [editableStr, setEditableStr] = useState('');
  const [editLoading, updateDescription] = useUpdateDescription();
  const [updateLoading, updateConfiguration] = useUpdateConfiguration();
  const [loading, versionOptions, queryComponentVersionList] = useQueryComponentList();

  //查询组件配置详情
  const queryComponentInfo = async (componentName: string, componentVersion: string, componentType: string) => {
    setInfoLoading(true);
    try {
      await getRequest(queryComponentInfoApi, {
        data: { componentName, componentVersion, componentType },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data;
            setComponentInfo(dataSource);
            setEditableStr(dataSource.componentDescription);
            configForm.setFieldsValue({
              config: dataSource?.componentConfiguration,
            });
          } else {
            return {};
          }
        })
        .finally(() => {
          setInfoLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (componentVersion && componentName) {
      queryComponentVersionList(componentName, componentType);
      queryComponentInfo(componentName, componentVersion, componentType);
    } else {
      return;
    }
  }, [componentName, componentVersion]);

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
              style={{ width: 220, marginLeft: 20 }}
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
              <Spin spinning={infoLoading}>
                <Descriptions title="基本信息" column={2} bordered={true} className="component-info-description">
                  <Descriptions.Item label="组件名称">{componentInfo?.componentName || '--'}</Descriptions.Item>
                  <Descriptions.Item label="组件描述">
                    <Paragraph
                      editable={{
                        onChange: (componentDescription: string) => {
                          updateDescription({ ...componentInfo, componentDescription }).then(() => {
                            setEditableStr(componentDescription);
                          });
                        },
                      }}
                    >
                      {editableStr}
                    </Paragraph>
                  </Descriptions.Item>
                  <Descriptions.Item label="组件类型">{componentInfo?.componentType || '--'}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {moment(componentInfo?.gmtCreate).format('YYYY-MM-DD HH:mm:ss') || '--'}{' '}
                  </Descriptions.Item>
                  <Descriptions.Item label="更新时间">
                    {moment(componentInfo?.gmtModify).format('YYYY-MM-DD HH:mm:ss') || '--'}
                  </Descriptions.Item>
                  <Descriptions.Item label="组件地址" span={2}>
                    {componentInfo?.componentUrl || '--'}
                  </Descriptions.Item>
                </Descriptions>
              </Spin>
              <Divider />
              <div>
                <h3 style={{ borderLeft: '4px solid #1973cc', paddingLeft: 8, height: 20, fontSize: 16 }}>组件说明:</h3>
                <div className="instruction">
                  <div className="instruction-info">
                    <Spin spinning={infoLoading}>{componentInfo?.componentExplanation}</Spin>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="组件配置" key="component-config">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
              <p>
                {type !== 'componentCenter' && (
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
                )}
              </p>
            </div>
            <div>
              <Form form={configForm}>
                <Form.Item name="config">
                  <AceEditor mode="yaml" height={'52vh'} readOnly={readOnly} />
                </Form.Item>
                <Form.Item>
                  <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {type !== 'componentCenter' && (
                      <Button type="primary" onClick={saveConfig} loading={updateLoading}>
                        保存配置
                      </Button>
                    )}
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

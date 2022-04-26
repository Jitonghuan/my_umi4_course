//制品管理-配置交付参数
import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import moment from 'moment';
import AceEditor from '@/components/ace-editor';
import { Tabs, Spin, Button, Descriptions, Typography, Table, Tag, Form } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import ParameterEditModal from './editModal';
import {
  useQueryIndentInfo,
  useQueryIndentParamList,
  useQueryIndentConfigParamList,
  useEditDescription,
  useCreatePackageInde,
  useGenerateIndentConfig,
  useEditIndentConfigYaml,
} from '../hook';
import { compontentsSchema, configDeliverySchema } from './schema';
import './index.less';

export default function ProductConfig() {
  const configInfo: any = history.location.state;
  const { TabPane } = Tabs;
  const { Paragraph } = Typography;
  const [configForm] = Form.useForm();
  const [infoLoading, configInfoData, queryIndentInfo] = useQueryIndentInfo();
  const [editableStr, setEditableStr] = useState(configInfo.indentDescription);
  const [downloading, createPackageInde] = useCreatePackageInde();
  const [loading, dataSource, queryIndentParamList] = useQueryIndentParamList();
  const [configLoading, configDataSource, queryIndentConfigParamList] = useQueryIndentConfigParamList();
  const [editLoading, editDescription] = useEditDescription();
  const [buttonText, setButtonText] = useState<string>('编辑');
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [editVisable, setEditVisable] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
  const [curRecord, setCurRecord] = useState<any>({});
  const [editConfigLoading, editIndentConfigYaml] = useEditIndentConfigYaml();
  const [configInfoLoading, indentConfigInfo, queryIndentConfigInfo] = useGenerateIndentConfig();
  useEffect(() => {
    if (configInfo.id) {
      queryIndentInfo(configInfo.id);
      queryIndentConfigParamList({ id: configInfo.id, isGlobal: true });
      queryIndentParamList({ id: configInfo.id, isGlobal: false });
    } else {
      return;
    }
  }, [configInfo.id]);
  const tabOnclick = (key: any) => {};

  //  全局参数表格列配置 configTableColumns
  const configTableColumns = useMemo(() => {
    return configDeliverySchema({
      onEditClick: (record, index) => {
        setEditVisable(true);
        setType('config');
        setCurRecord(record);
      },
    }) as any;
  }, []);

  //组件参数表格列配置
  const componentTableColumns = useMemo(() => {
    return compontentsSchema({
      onEditClick: (record, index) => {
        setEditVisable(true);
        setCurRecord(record);
        setType('compontent');
      },
    }) as any;
  }, []);
  const handleSubmit = () => {
    if (type === 'config') {
      queryIndentConfigParamList({ id: configInfo.id, isGlobal: true });
      queryIndentInfo(configInfo.id);
      setEditVisable(false);
    } else {
      queryIndentParamList({ id: configInfo.id, isGlobal: false });
      queryIndentInfo(configInfo.id);
      setEditVisable(false);
    }
  };
  const downLoadIndent = () => {
    createPackageInde(configInfo.id);
  };
  const getConfigInfo = () => {
    queryIndentConfigInfo(configInfo.id);
  };
  const saveConfig = () => {
    const value = configForm.getFieldsValue();
    editIndentConfigYaml(configInfo.id, value.configInfo).then(() => {
      queryIndentInfo(configInfo.id);
      queryIndentConfigInfo(configInfo.id);
    });
  };

  return (
    <PageContainer>
      <ParameterEditModal
        visible={editVisable}
        initData={curRecord}
        type={type}
        onClose={() => {
          setEditVisable(false);
        }}
        onSubmit={handleSubmit}
      />
      <ContentCard>
        <div>
          <Spin spinning={infoLoading}>
            <Descriptions
              title="局点管理"
              column={2}
              bordered
              className="local-management-info-description"
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    history.push('/matrix/delivery/product-management');
                  }}
                >
                  返回
                </Button>
              }
            >
              <Descriptions.Item label="局点名称">{configInfoData.indentName || '--'}</Descriptions.Item>
              <Descriptions.Item label="局点描述">
                {/* <Spin spinning={saveLoading}> */}
                <Paragraph
                  editable={{
                    onChange: (description: string) => {
                      editDescription(configInfo.id, description).then(() => {
                        setEditableStr(description);
                      });
                    },
                  }}
                >
                  {editableStr || '--'}
                </Paragraph>
                {/* </Spin> */}
              </Descriptions.Item>
              <Descriptions.Item label="交付产品">{configInfoData.productName || '--'}</Descriptions.Item>
              <Descriptions.Item label="交付版本">{configInfoData.productVersion || '--'}</Descriptions.Item>
              <Descriptions.Item label="交付项目">{configInfoData.deliveryProject || '--'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(configInfoData.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              {/* <Descriptions.Item label="创建时间" span={2}>
                  empty
                </Descriptions.Item> */}
            </Descriptions>
          </Spin>
          {/* <Divider /> */}
          <div>
            <h3 style={{ borderLeft: '4px solid #1973cc', paddingLeft: 8, height: 20, fontSize: 16, marginTop: 16 }}>
              交付管理
            </h3>
          </div>
        </div>
        <div style={{ paddingTop: 10 }}>
          <Tabs defaultActiveKey="1" onChange={tabOnclick} type="card">
            <TabPane tab="配置交付参数" key="1">
              <Tabs defaultActiveKey="1" onChange={tabOnclick}>
                <TabPane tab="全局参数" key="1">
                  <Table columns={configTableColumns} dataSource={configDataSource} loading={configLoading}></Table>
                </TabPane>
                <TabPane tab="组件参数" key="2">
                  <Table columns={componentTableColumns} dataSource={dataSource} loading={loading}></Table>
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane tab="出包和部署" key="2">
              <div>
                {/* <p>产品部署包：{configInfoData?.indentPackageUrl || '---'}</p> */}
                <p>
                  产品部署包：
                  <Tag color={configInfoData?.indentPackageStatus === '已出包' ? 'success' : 'yellow'}>
                    {configInfoData?.indentPackageStatus || '--'}
                  </Tag>
                  {configInfoData?.indentPackageStatus === '已出包' && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        window.open(configInfoData?.indentPackageUrl, '_blank');
                      }}
                    >
                      下载部署包
                    </Button>
                  )}
                  {/* <Button type="primary" size="small" onClick={downLoadIndent} loading={downloading}> */}
                  {configInfoData?.indentPackageStatus !== '已出包' && (
                    <Button type="primary" size="small" onClick={downLoadIndent} loading={downloading}>
                      出部署包
                    </Button>
                  )}
                  {/* </Button> */}
                  {configInfoData?.indentPackageStatus === '已出包' && (
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginLeft: 10 }}
                      onClick={downLoadIndent}
                      loading={downloading}
                    >
                      重新出包
                    </Button>
                  )}
                </p>
              </div>
              <div style={{ marginBottom: 10 }}>
                安装配置文件：
                <Button type="primary" size="small" onClick={getConfigInfo}>
                  获取制品配置文件信息
                </Button>
                （请将文件中的内容复制到安装包所在目录下的config.yaml）
                <Button
                  type={buttonText === '编辑' ? 'primary' : 'default'}
                  style={{ float: 'right' }}
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
              </div>
              <div>
                <Form form={configForm}>
                  <Spin spinning={configInfoLoading}>
                    <Form.Item name="configInfo" noStyle>
                      <AceEditor mode="yaml" height={450} value={indentConfigInfo} readOnly={readOnly} />
                    </Form.Item>
                  </Spin>

                  <Form.Item>
                    <span style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                      <Button type="primary" onClick={saveConfig} loading={editConfigLoading}>
                        保存配置
                      </Button>
                    </span>
                  </Form.Item>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </ContentCard>
    </PageContainer>
  );
}

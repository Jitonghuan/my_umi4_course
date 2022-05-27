//制品管理-配置交付参数
import React, { useState, useEffect, useMemo, useRef } from 'react';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { queryIndentInfoApi, generateIndentConfig, getPackageStatus } from '../../service';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getRequest, postRequest } from '@/utils/request';
import AceEditor from '@/components/ace-editor';
import { Tabs, Spin, Button, Descriptions, Typography, Table, Tag, Form, message, Tooltip, Modal } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import ParameterEditModal from './editModal';
import {
  useQueryIndentParamList,
  useQueryIndentConfigParamList,
  useEditDescription,
  useCreatePackageInde,
  useEditIndentConfigYaml,
  useUpdateParamIndent,
} from '../hook';
import { compontentsSchema, configDeliverySchema } from './schema';
import './index.less';
type packageStatus = {
  text: string;
  color: any;
};
export const STATUS_TYPE: Record<string, packageStatus> = {
  未出包: { text: '未出包', color: 'gray' },
  出包中: { text: '出包中', color: 'green' },
  出包异常: { text: '出包异常', color: 'red' },
  已出包: { text: '已出包', color: 'blue' },
  未知: { text: '未知', color: 'default' },
};

export default function ProductConfig() {
  const configInfo: any = history.location.state;
  const { TabPane } = Tabs;
  const { Paragraph } = Typography;
  const [configForm] = Form.useForm();
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [configInfoData, setConfigInfoData] = useState<any>({});
  const [editableStr, setEditableStr] = useState('');
  const [downloading, createPackageInde] = useCreatePackageInde();
  const [loading, dataSource, queryIndentParamList] = useQueryIndentParamList();
  const [configLoading, configDataSource, queryIndentConfigParamList] = useQueryIndentConfigParamList();
  const [updateLoading, updateParamIndent] = useUpdateParamIndent();
  const [editLoading, editDescription] = useEditDescription();
  const [buttonText, setButtonText] = useState<string>('编辑');
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [editVisable, setEditVisable] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
  const [curRecord, setCurRecord] = useState<any>({});
  const [packageLoading, setPackageLoading] = useState<boolean>(false);
  const [editConfigLoading, editIndentConfigYaml] = useEditIndentConfigYaml();
  const [indentConfigInfo, setIndentConfigInfo] = useState<any>({});
  const [configInfoLoading, setConfigInfoLoading] = useState<boolean>(false);
  const [curIndentPackageStatus, setCurIndentPackageStatus] = useState<string>('未知');
  const cacheRef = useRef<any>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [tabActiveKey, setTabActiveKey] = useState<string>('1');

  const queryPackageStatus = async (id: number) => {
    setPackageLoading(true);
    try {
      await getRequest(`${getPackageStatus}?id=${id}`)
        .then((res) => {
          if (res.success) {
            setCurIndentPackageStatus(res.data);
            if (cacheRef.current && (res.data === '已出包' || res.data === '出包异常')) {
              clearInterval(cacheRef.current);
            }
          }
        })
        .finally(() => {
          setPackageLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const queryIndentInfo = async (id: number) => {
    setInfoLoading(true);
    try {
      await getRequest(`${queryIndentInfoApi}?id=${id}`)
        .then((res) => {
          if (res.success) {
            setConfigInfoData(
              res.data || {
                indentName: '',
                indentDescription: '',
                productName: '',
                productVersion: '',
                deliveryProject: '',
                indentPackageStatus: '',
                indentPackageUrl: '',
                gmtCreate: '',
              },
            );
            setEditableStr(res.data.indentDescription || '');

            configForm.setFieldsValue({
              configInfo: res.data.indentConfigYaml,
            });
            setIndentConfigInfo(res.data.indentConfigYaml);
          } else {
            return;
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
    if (configInfo.id) {
      queryPackageStatus(configInfo.id);
      queryIndentInfo(configInfo.id);
      queryIndentConfigParamList({ id: configInfo.id, isGlobal: true });
      queryIndentParamList({ id: configInfo.id, isGlobal: false });
    } else {
      return;
    }
  }, [configInfo.id]);
  const tabOnclick = (key: any) => {
    setTabActiveKey(key);
  };

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
      queryIndentInfo(configInfo.id).then(() => {
        queryIndentConfigParamList({ id: configInfo.id, isGlobal: true });
      });
      setEditVisable(false);
    } else {
      queryIndentInfo(configInfo.id).then(() => {
        queryIndentParamList({ id: configInfo.id, isGlobal: false });
      });
      setEditVisable(false);
    }
  };

  const downLoadIndent = () => {
    createPackageInde(configInfo.id);
    cacheRef.current = setInterval(() => {
      queryPackageStatus(configInfo.id);
    }, 100);
  };
  const queryIndentConfigInfo = async (id: number) => {
    setConfigInfoLoading(true);
    try {
      await postRequest(`${generateIndentConfig}?id=${id}`)
        .then((res) => {
          if (res.success) {
            setIndentConfigInfo(res.data || '');
            configForm.setFieldsValue({
              configInfo: res.data,
            });
          } else {
            return;
          }
        })
        .finally(() => {
          setConfigInfoLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const getConfigInfo = () => {
    queryIndentConfigInfo(configInfo.id);
  };
  const saveConfig = () => {
    const value = configForm.getFieldsValue();
    editIndentConfigYaml(configInfo.id, value.configInfo)
      .then(() => {
        queryIndentInfo(configInfo.id);
        setReadOnly(true);
        setButtonText('编辑');
      })
      .then(() => {
        setVisible(false);
      });
  };
  const afreshText = '由最新的交付参数等配置生成新的制品配置，会覆盖原有的自定义配置';
  const updateText = '获取产品版本里最新的交付参数并更新到此处，不会改动参数值';

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
              title="制品管理"
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
              <Descriptions.Item label="制品名称">{configInfoData.indentName || '--'}</Descriptions.Item>
              <Descriptions.Item label="制品描述">
                <Paragraph
                  editable={{
                    onChange: (description: string) => {
                      editDescription(configInfo.id, description).then(() => {
                        setEditableStr(description);
                      });
                    },
                  }}
                >
                  {editableStr}
                </Paragraph>
              </Descriptions.Item>
              <Descriptions.Item label="交付产品">{configInfoData.productName || '--'}</Descriptions.Item>
              <Descriptions.Item label="交付版本">{configInfoData.productVersion || '--'}</Descriptions.Item>
              <Descriptions.Item label="交付项目">{configInfoData.deliveryProject || '--'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(configInfoData.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </Spin>

          <div>
            <h3 style={{ borderLeft: '4px solid #1973cc', paddingLeft: 8, height: 20, fontSize: 16, marginTop: 16 }}>
              出包管理
              {/* <Button
                icon={infoFoldOut ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                style={{ marginLeft: 8 }}
                type="primary"
                size="small"
                onClick={() => {
                  if (!infoFoldOut) {
                    queryIndentConfigParamList({ id: configInfo.id, isGlobal: true });
                    queryIndentParamList({ id: configInfo.id, isGlobal: false });
                    setInfoFoldOut(true);
                  } else {
                    setInfoFoldOut(false);
                  }
                }}
              >
                {infoFoldOut ? '收起详情' : '展开详情'}
              </Button> */}
            </h3>
          </div>
        </div>

        <div style={{ paddingTop: 10 }}>
          <Tabs type="card">
            <TabPane tab="配置交付参数" key="1">
              <Tabs
                defaultActiveKey="1"
                activeKey={tabActiveKey}
                onChange={tabOnclick}
                tabBarExtraContent={
                  <Button
                    type="primary"
                    loading={updateLoading}
                    onClick={() => {
                      updateParamIndent(configInfo.id).then(() => {
                        queryIndentConfigParamList({ id: configInfo.id, isGlobal: true });
                        queryIndentParamList({ id: configInfo.id, isGlobal: false });
                      });
                    }}
                  >
                    更新交付参数{' '}
                    <Tooltip placement="topRight" title={updateText}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Button>
                }
              >
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
                <p>
                  产品部署包：
                  <Tag color={STATUS_TYPE[curIndentPackageStatus].color || 'default'}>
                    {STATUS_TYPE[curIndentPackageStatus].text || '--'}
                  </Tag>
                  {curIndentPackageStatus === '已出包' && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        window.open(configInfoData?.indentPackageUrl);
                      }}
                    >
                      下载部署包
                    </Button>
                  )}
                  {curIndentPackageStatus !== '已出包' && (
                    <Button type="primary" size="small" onClick={downLoadIndent} loading={downloading}>
                      出部署包
                    </Button>
                  )}
                  {/* </Button> */}
                  {curIndentPackageStatus === '已出包' && (
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginLeft: 10 }}
                      onClick={downLoadIndent}
                      loading={curIndentPackageStatus !== '已出包' && curIndentPackageStatus !== '出包失败'}
                    >
                      重新出包
                    </Button>
                  )}
                </p>
              </div>
              <div style={{ marginBottom: 10 }}>
                安装配置文件：
                <Button
                  style={{ marginRight: 10 }}
                  // type="primary"
                  size="small"
                  onClick={getConfigInfo}
                  loading={configInfoLoading}
                >
                  重新生成制品配置{' '}
                  <Tooltip placement="topLeft" title={afreshText}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Button>
                <CopyToClipboard
                  text={JSON.stringify(indentConfigInfo || {})}
                  onCopy={() => message.success('复制成功！')}
                >
                  <Button size="small"> 一键复制</Button>
                </CopyToClipboard>
                <div style={{ float: 'right' }}>
                  <Button
                    type={buttonText === '编辑' ? 'primary' : 'default'}
                    onClick={() => {
                      setVisible(true);
                      // if (readOnly) {
                      //   setReadOnly(false);
                      //   setButtonText('取消编辑');
                      // } else {
                      //   setReadOnly(true);
                      //   setButtonText('编辑');
                      // }
                    }}
                  >
                    编辑
                  </Button>
                  {/* <Button type="primary" style={{ marginLeft: 8 }} onClick={saveConfig} loading={editConfigLoading}>
                    保存配置
                  </Button> */}
                </div>
              </div>
              <div>
                <Form form={configForm}>
                  <Spin spinning={configInfoLoading}>
                    <Form.Item name="configInfo" noStyle>
                      <AceEditor mode="yaml" height={550} value={indentConfigInfo} readOnly={true} />
                    </Form.Item>
                  </Spin>

                  <Form.Item></Form.Item>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </ContentCard>
      <Modal
        title="编辑配置"
        visible={visible}
        width={800}
        onOk={saveConfig}
        maskClosable={false}
        onCancel={() => {
          setVisible(false);
        }}
        confirmLoading={editConfigLoading}
      >
        <div>
          <Form form={configForm}>
            <Spin spinning={configInfoLoading}>
              <Form.Item name="configInfo" noStyle>
                <AceEditor mode="yaml" height={550} value={indentConfigInfo} />
              </Form.Item>
            </Spin>

            <Form.Item></Form.Item>
          </Form>
        </div>
      </Modal>
    </PageContainer>
  );
}

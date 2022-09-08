//制品管理-配置建站参数
import React, { useState, useEffect, useMemo, useRef } from 'react';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { QuestionCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { queryIndentInfoApi, generateIndentConfig, getPackageStatus } from '../../service';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getRequest, postRequest } from '@/utils/request';
import StationConfig from '../product-config/components/station-config';
import StationDeploy from '../product-config/components/station-deploy';
import StationPlan from '../product-config/components/station-plan'
import AceEditor from '@/components/ace-editor';
import { Tabs, Spin, Button, Descriptions, Typography, Table, Tag, Form, message, Tooltip, Modal,Segmented } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import {packageOutOptions} from './schema'

import {
  useQueryIndentParamList,
  useQueryIndentConfigParamList,
  useEditDescription,
  useCreatePackageInde,
  useEditIndentConfigYaml,
  useUpdateParamIndent,
} from '../hook';

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
  const [activeValue, setActiveValue] = useState<string>("1");
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
              queryIndentInfo(configInfo.id);
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
  const afreshText = '由最新的建站参数等配置生成新的制品配置，会覆盖原有的自定义配置';
  const updateText = '获取产品版本里最新的建站参数并更新到此处，不会改动参数值';

  return (
    <PageContainer>
     
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
                    history.push('/matrix/station/product-management');
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
              <Descriptions.Item label="建站产品">{configInfoData.productName || '--'}</Descriptions.Item>
              <Descriptions.Item label="建站版本">{configInfoData.productVersion || '--'}</Descriptions.Item>
              <Descriptions.Item label="建站项目">{configInfoData.deliveryProject || '--'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(configInfoData.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </Spin>

          <div style={{paddingBottom:12}}>
            <h3 style={{ borderLeft: '4px solid #3591ff', paddingLeft: 8, height: 20, fontSize: 16, marginTop: 16 }}>
              出包管理
            </h3>
          </div>

          <Segmented
          size="large"
          //  block
          options={packageOutOptions}
          defaultValue="1"
          value={activeValue}
          onChange={(value: any) => {
            setActiveValue(value);
           
          }}
        />
        {activeValue==="1"&&(<StationPlan/>)}
        {activeValue==="2"&&(
        <StationConfig 
          configInfo={configInfo}
          onUpdate={()=>{
            queryIndentConfigParamList({ id: configInfo.id, isGlobal: true });
            queryIndentParamList({ id: configInfo.id, isGlobal: false });
          }}
          onSaveGlobal={()=>{
            queryIndentInfo(configInfo.id).then(() => {
              queryIndentConfigParamList({ id: configInfo.id, isGlobal: true });
            });
          }}
          onSave={()=>{
            queryIndentInfo(configInfo.id).then(() => {
              queryIndentConfigParamList({ id: configInfo.id, isGlobal: false });
            });
          }}

          configTableInfo={{configDataSource,configLoading}}
          compontentTableInfo={{loading, dataSource}}
        
        
        />)}
        {activeValue==="3"&&(<StationDeploy/>)}




        </div>
      </ContentCard>

    </PageContainer>
  );
}

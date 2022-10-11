//制品管理-配置建站参数
import React, { useState, useEffect} from 'react';
import PageContainer from '@/components/page-container';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';
import { queryIndentInfoApi,} from '../../service';
import moment from 'moment';
import { getRequest} from '@/utils/request';
import StationConfig from '../product-config/components/station-config';
import StationDeploy from '../product-config/components/station-deploy';
import StationPlan from '../product-config/components/station-plan'
import { Spin, Button, Descriptions, Typography, Tag, Form, Segmented } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import {packageOutOptions} from './schema';
import {useQueryIndentParamList,useQueryIndentConfigParamList,useEditDescription,useCreatePackageInde,useUpdateParamIndent,useQueryIndentServerList} from '../hook';
import './index.less';


export default function ProductConfig() {
  let location:any = useLocation();
  const query:any = parse(location.search);
  const configInfo: any = location.state;
  const { Paragraph } = Typography;
  const [configForm] = Form.useForm();
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [configInfoData, setConfigInfoData] = useState<any>({});
  const [editableStr, setEditableStr] = useState('');
  //useQueryIndentServerList
  const [serverLoading, serverDataSource, queryIndentServerList] = useQueryIndentServerList();
  const [loading, dataSource, queryIndentParamList] = useQueryIndentParamList();
  const [configLoading, configDataSource, queryIndentConfigParamList] = useQueryIndentConfigParamList();
  const [editLoading, editDescription] = useEditDescription();
  const [activeValue, setActiveValue] = useState<string>("1");

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
      queryIndentInfo(configInfo.id);
      queryIndentConfigParamList({ id: configInfo.id, paramComponent:"global" });
      queryIndentParamList({ id: configInfo.id,  });
      queryIndentServerList({id: configInfo.id, paramComponent:"server" })
    } else {
      return;
    }
  }, [configInfo.id]);
  


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
                <Spin spinning={editLoading}>
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

                </Spin>
                
              </Descriptions.Item>
              <Descriptions.Item label="建站产品">{configInfoData.productName || '--'}</Descriptions.Item>
              <Descriptions.Item label="建站版本"><Tag color="geekblue">{configInfoData.productVersion || '--'}</Tag></Descriptions.Item>
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
        {activeValue==="1"&&(<StationPlan indentId={configInfo.id} onUpdate={()=>{   queryIndentInfo(configInfo.id)}} />)}
        {activeValue==="2"&&(
        <StationConfig 
          configInfo={configInfo}
          onUpdate={()=>{
            queryIndentConfigParamList({ id: configInfo.id, paramComponent:"global" });
            queryIndentParamList({ id: configInfo.id,  });
            queryIndentServerList({ id: configInfo.id, paramComponent:"server" });
          
          }}
          onSaveGlobal={()=>{
            queryIndentInfo(configInfo.id).then(() => {
              queryIndentConfigParamList({ id: configInfo.id, paramComponent:"global" });
            });
          }}
          onSave={()=>{
            queryIndentInfo(configInfo.id).then(() => {
             
              queryIndentParamList({ id: configInfo.id,  });
            });
          }}
          onSaveServer={()=>{
            queryIndentInfo(configInfo.id).then(() => {
             
              queryIndentServerList({ id: configInfo.id, paramComponent:"server" });
            });
          }}

          configTableInfo={{configDataSource,configLoading}}
          compontentTableInfo={{loading, dataSource}}
          serverTableInfo={{ serverDataSource,serverLoading,}}  
        />)}
        {activeValue==="3"&&(<StationDeploy indentId={configInfo.id}/>)}
        </div>
      </ContentCard>

    </PageContainer>
  );
}

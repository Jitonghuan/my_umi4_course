import React, { useState,  useMemo } from 'react';
import { Tabs, Button,Table, Tooltip} from 'antd';
import {useUpdateParamIndent,} from '../../../hook';
import { QuestionCircleOutlined} from '@ant-design/icons';
import { compontentsSchema, configDeliverySchema,serviceConfigSchema } from '../../schema';
import ParameterEditModal from './editModal';

export interface IProps {
    configInfo:any;
    onUpdate:()=>void;
    onSaveGlobal:()=>void;
    onSave:()=>void;
    onSaveServer:()=>void;
    configTableInfo:any;
    compontentTableInfo:any
    serverTableInfo:any
  }
  
export default function StationConfig(props:IProps){
    const {configInfo,onUpdate,onSaveGlobal,onSave,serverTableInfo,onSaveServer,configTableInfo,compontentTableInfo} =props
    const { TabPane } = Tabs;
    const [tabActiveKey, setTabActiveKey] = useState<string>('1');
    const [editVisable, setEditVisable] = useState<boolean>(false);
    const [updateLoading, updateParamIndent] = useUpdateParamIndent();
    const [type, setType] = useState<string>('');
    const [curRecord, setCurRecord] = useState<any>({});
    const updateText = '获取产品版本里最新的建站参数并更新到此处，不会改动参数值';
    const tabOnclick = (key: string) => {
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
//   serviceConfigSchema
const serviceConfigTableColumns = useMemo(() => {
    return serviceConfigSchema({
      onEditClick: (record, index) => {
        setEditVisable(true);
        setCurRecord(record);
        setType('server');
      },
    }) as any;
  }, []);

  const handleSubmit = () => {
    if (type === 'config') {
    onSaveGlobal()
      setEditVisable(false);
    } else if(type === 'compontent') {
     onSave();
      setEditVisable(false);
    }else if(type === 'server'){
      onSaveServer();
      setEditVisable(false)

    }
  };

    return(
        <>
        <div style={{ paddingTop: 10 }}>
     
            <Tabs
              defaultActiveKey="1"
              activeKey={tabActiveKey}
              onChange={tabOnclick}
              tabBarExtraContent={
                <>
              
                  <Button
                  type="primary"
                  loading={updateLoading}
                  onClick={() => {
                    updateParamIndent(configInfo.id).then(() => {
                        onUpdate()
                    });
                  }}
                >
                  更新建站参数
                  <Tooltip placement="topRight" title={updateText}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Button>
               
             
              
              </>}
            >
              <TabPane tab="全局参数" key="1">
                <Table columns={configTableColumns} dataSource={configTableInfo?.configDataSource} loading={configTableInfo?.configLoading}></Table>
              </TabPane>
              <TabPane tab="组件参数" key="2">
                <Table columns={componentTableColumns} dataSource={compontentTableInfo?.dataSource} loading={compontentTableInfo?.loading}></Table>
              </TabPane>
              <TabPane tab="服务配置" key="3">
                <Table columns={serviceConfigTableColumns} dataSource={serverTableInfo?.dataSource} loading={serverTableInfo?.loading}></Table>
              </TabPane>
            </Tabs>
            <ParameterEditModal
              visible={editVisable}
              initData={curRecord}
              type={type}
              onClose={() => {
               setEditVisable(false);
              }}
              onSubmit={handleSubmit}
      />
    
        
    </div>
   
    </>
    )
}
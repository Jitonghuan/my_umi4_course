import React, { useState} from 'react';
import {Modal,  Form, Select } from 'antd';
import { history } from 'umi';
import { getRequest } from '@/utils/request';
import {queryProjectEnvList} from '@/pages/application/service'
interface Iprops{
  envProjectVisible:boolean;
  onClose:()=>void;
  appData:any;
  projectEnvCodeOptions:any;
  envLoading:boolean;
}
export default function EntryProject(props:Iprops){
  const {envProjectVisible,onClose,appData,projectEnvCodeOptions,envLoading}=props
  const [envProjectForm] = Form.useForm();
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [projectEnvName, setProjectEnvName] = useState<string>('');
  // const queryProjectEnv = async (benchmarkEnvCode: any) => {
  //   setListLoading(true);
  //   await getRequest(queryProjectEnvList, { data: { benchmarkEnvCode, pageSize: 9999, pageIndex: 1 } })
  //     .then((res) => {
  //       if (res?.success) {
  //         let data = res.data.dataSource;
  //         let option = (data || []).map((item: any) => ({
  //           label: item.envName,
  //           value: item.envCode,
  //         }));
  //         setProjectEnvCodeOptions(option);
  //       }
  //     })
  //     .finally(() => {
  //       setListLoading(false);
  //     });
  // };
  // const selectEnvProject = (value: string, option: any) => {
  //   queryProjectEnv(value);
  // };

  const selectProjectEnv = (value: string, option: any) => {
    setProjectEnvName(option.label);
  };
  const ensureProjectEnv = () => {
    envProjectForm.validateFields().then((value) => {
      history.push({
        pathname: `/matrix/application/environment-deploy/appDeploy`,
        search:`appCode=${appData?.appCode}&id=${appData?.id + ''}&projectEnvCode=${value.envCode}&projectEnvName=${projectEnvName}`
       
      });
    });
  };


    return(
        <Modal
        key="envProjectDetail"
        title="选择环境"
        visible={envProjectVisible}
        onCancel={onClose}
        onOk={ensureProjectEnv}
        maskClosable={false}
      >
        <div>
          <Form form={envProjectForm}>
            <Form.Item label="项目环境:" name="envCode" rules={[{ required: true, message: '请选择项目环境' }]}>
              <Select
                style={{ width: 180 }}
                allowClear
                showSearch
                loading={envLoading}
                options={projectEnvCodeOptions}
                onChange={selectProjectEnv}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    )
}
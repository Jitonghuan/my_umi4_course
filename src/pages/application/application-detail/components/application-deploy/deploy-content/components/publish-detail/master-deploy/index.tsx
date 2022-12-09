import React, { useState } from 'react';
import { Modal, message, Checkbox, Form, Select,Radio } from 'antd';
import {deployMaster} from '@/pages/application/service';
interface Iprops{
    deployMasterVisible:boolean;
    masterBranchOptions:any
    onSave:()=>void;
    onClose:()=>void;
    changeMaster:(value:string)=>void;
    envDataList:any
    curPipelineCode:string
    selectMaster:string
    deployModel?:string
    feType?:string
    appData:any;
}
export default function EntryProject(props:Iprops){
    const {deployMasterVisible,onClose,onSave,masterBranchOptions,selectMaster,changeMaster,envDataList,curPipelineCode,deployModel,feType,appData}=props;
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [pdaDeployType, setPdaDeployType] = useState('bundles');
    const [form]=Form.useForm()
    const getBuildType = () => {
        let { appType, isClient } = appData || {};
        if (appType === 'frontend') {
          return 'feMultiBuild';
        } else {
          return isClient ? 'beClientBuild' : 'beServerBuild';
        }
      };
    
      
   // 确认发布操master作
  const confirmPublishToMaster = async () => {
    const params=await form.validateFields()
    setConfirmLoading(true);
    try {
      const res = await deployMaster({
          ...params,
        deployModel: deployModel,
        pipelineCode:curPipelineCode,
        // envCodes: deployMasterEnv,
        buildType: getBuildType(),
        pdaDeployType: feType === 'pda' ? pdaDeployType : '',
        masterBranch: selectMaster, //主干分支
      });
      if (res?.success) {
        message.success('操作成功，正在部署中...');
        onSave()
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleChange = (v: string) => {
    changeMaster(v);
  };

    return(
        <Modal
        key="deployMaster"
        title="选择发布环境"
        visible={deployMasterVisible}
        confirmLoading={confirmLoading}
        onOk={confirmPublishToMaster}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
      >
        <div>
            <Form form={form} preserve={false}>
                <Form.Item label="主干分支" name="masterBranch" rules={[{ required: true, message: '请输入' }]}>
                <Select
              options={masterBranchOptions}
              value={selectMaster}
              style={{ width: '200px', marginRight: '20px' }}
              onChange={handleChange}
              showSearch
              size="small"
              optionFilterProp="label"
              // labelInValue
              filterOption={(input, option) => {
                  //@ts-ignore
                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            />

                </Form.Item>
                <Form.Item name="envCodes" label="发布环境" rules={[{ required: true, message: '请输入' }]}>
                <Checkbox.Group  options={envDataList} />
                    
                </Form.Item>
                { feType === 'pda' &&(
                      <Form.Item name="pdaDeployType" label="打包类型" rules={[{ required: true, message: '请输入' }]}>
                      <Radio.Group onChange={(e) => setPdaDeployType(e.target.value)} value={pdaDeployType}>
                        <Radio value='bundles'>bundles</Radio>
                        <Radio value='apk'>apk</Radio>
                      </Radio.Group>
      
                      </Form.Item>

                )}
              

            </Form>
        
        </div>
      </Modal>

    )}
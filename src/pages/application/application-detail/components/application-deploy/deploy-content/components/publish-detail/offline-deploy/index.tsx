import React, { useState } from 'react';
import { Modal, message, Upload,Button, Form,Radio,Spin } from 'antd';
import {feOfflineDeploy,} from '@/pages/application/service';
import { UploadOutlined,CloseOutlined } from '@ant-design/icons';
interface Iprops{
    deployVisible:boolean;
    curPipelineCode:string
    deployModel?:string;
    feType?:string;
    onSave:()=>void;
    onClose:()=>void;
    envLoading:boolean
    beforeUploadInfo:boolean
    changeEnv:(e:any)=>void
    deployEnv:any;
    offlineEnvData:any;
}
export default function EntryProject(props:Iprops){
    const {deployVisible,onClose,onSave,curPipelineCode,deployModel,feType,envLoading,beforeUploadInfo,changeEnv,deployEnv,offlineEnvData}=props;
    const [pdaDeployType, setPdaDeployType] = useState('bundles');
    const uploadImages = () => {
    return `${feOfflineDeploy}?pipelineCode=${curPipelineCode}&envCodes=${deployEnv}&deployModel=${deployModel}&pdaDeployType=${feType === 'pda' ? pdaDeployType : ''}`;
  };

   


  // 上传按钮 message.error(info.file.response?.errorMsg) ||
  const uploadProps = {
    name: 'file',
    action: uploadImages,
    maxCount: 1,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
      showInfo: '上传中请不要关闭弹窗',
    },

    beforeUpload: (file: any, fileList: any) => {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '操作提示',
          content: `确定要上传文件：${file.name}进行离线部署吗？`,
          onOk: () => {
            return resolve(file);
          },
          onCancel: () => {
            return reject(false);
          },
        });
      });
    },
    onChange: (info: any) => {
      if (info.file.status === 'uploading') {
      }
      if (info.file.status === 'done' && info.file?.response.success) {
        message.success(`${info.file.name} 上传成功`);
       onSave()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      } else if (info.file?.response?.success === false) {
        message.error({
          content: <>{info.file.response?.errorMsg}<CloseOutlined onClick={() => { message.destroy('upload') }} style={{ marginLeft: '10px', color: '#c6c4c4' }} /></>,
          duration: 0,
          key: 'upload',
        })

      } else if (info.file.status === 'removed') {
        message.warning('上传取消！');
      }
    },
  };


    return(
        <Modal
        key="deployOffline"
        title="选择部署环境"
        visible={deployVisible}
        width={700}
        footer={null}
        onCancel={onClose}
        maskClosable={false}
      >
        <Spin spinning={envLoading}>
        <div>
          <span>发布环境：</span>
          <Radio.Group
            onChange={(e: any) => {
                changeEnv(e)
            }}
            value={deployEnv}
            options={offlineEnvData || []}
          />
       
        </div>
        {
          feType === 'pda' && (
            <div style={{ marginTop: "10px" }}>
              <span>打包类型：</span>
              <Radio.Group onChange={(e) => setPdaDeployType(e.target.value)} value={pdaDeployType}>
                <Radio value='bundles'>bundles</Radio>
                <Radio value='apk'>apk</Radio>
              </Radio.Group>
            </div>
          )
        }

        <div style={{ display: 'flex', marginTop: '12px' }} key={Math.random()}>
          <span>配置文件：</span>
          <Upload {...uploadProps} accept=".tgz,.gz">
            <Button icon={<UploadOutlined />} type="primary" ghost disabled={beforeUploadInfo}>
              离线部署
            </Button>
          </Upload>
        </div>

       </Spin>
   
       
      </Modal>

    )}
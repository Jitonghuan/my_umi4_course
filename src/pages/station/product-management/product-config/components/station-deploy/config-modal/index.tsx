import AceEditor from '@/components/ace-editor';
import { useEffect, } from 'react';
import { Modal,Form,Spin } from 'antd';
import {useEditIndentConfigYaml} from '../../../../hook';
interface Iprops{
    configInfoLoading:boolean
    indentConfigInfo:any;
    indentId:number;
    onSave:()=>void;
    onClose:()=>void;
    visible:boolean
}
export default function ConfigModal(props:Iprops){
    const [editConfigLoading, editIndentConfigYaml] = useEditIndentConfigYaml();
    const {configInfoLoading,indentConfigInfo,indentId,onSave,onClose,visible}=props
    const [configForm] = Form.useForm();
   
    const saveConfig = () => {
       
        const value = configForm.getFieldsValue();
        editIndentConfigYaml(indentId, value.configInfo).then(()=>{
            onSave()

        }).finally(()=>{
         
        })
          
      }
      useEffect(()=>{
        if(visible){
          configForm.setFieldValue("configInfo",indentConfigInfo)

        }

      },[visible])
    
    return(

        <Modal
        destroyOnClose
        width={800}
        title={"编辑配置"}
        visible={visible}
        onOk={saveConfig}
        onCancel={onClose}
        confirmLoading={editConfigLoading}
        maskClosable={false}
        
      >
          <Spin spinning={configInfoLoading}>
          <Form form={configForm} labelCol={{ flex: '120px' }}>
         
         <Form.Item name="configInfo" noStyle>
           <AceEditor mode="yaml" value={indentConfigInfo} />
         </Form.Item>
       </Form>

          </Spin>
       
      </Modal>
    )
}
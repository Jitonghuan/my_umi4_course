import {Form,Input,Select,Button,Modal,Switch} from 'antd';
import {InfoCircleOutlined} from '@ant-design/icons';
import {useCreateProductVersion} from '../hooks'
interface Iprops{
    visible:boolean;
    onCancel:()=>void;

}
export default function CreateVersionModal(props:Iprops){
    const {visible,onCancel}=props;
    const [createVersionForm] = Form.useForm();
    const [creatLoading, createProductVersion] = useCreateProductVersion();

  const handleSubmit = () => {
    let params = createVersionForm.getFieldsValue();
    console.log("params---",params)
 
    // createProductVersion({...params,productId:descriptionInfoData.id}).then(() => {
    //   setCreatVersionVisiable(false);
    //   queryProductVersionList(descriptionInfoData.id);
    // });
  };
    return(

        <Modal
          title="创建版本"
          visible={visible}
          width={700}
          onCancel={onCancel}
          footer={
            <div className="drawer-footer">
              <Button type="primary" loading={creatLoading} onClick={handleSubmit}>
                确定
              </Button>
              <Button
                type="default"
                onClick={onCancel}
              >
                取消
              </Button>
            </div>
          }
        >
          <Form layout="horizontal" form={createVersionForm} labelCol={{flex:'140px'}}>
            <Form.Item label="版本名称:" name="versionName" rules={[{ required: true, message: '请输入版本号' }]}>
              <Input style={{ width: 400 }} placeholder="请输入版本号"></Input>
            </Form.Item>
            <Form.Item label="版本描述:" name="versionDescription">
              <Input style={{ width: 400 }} placeholder="请输入版本描述"></Input>
            </Form.Item>
            <Form.Item label="引入基础设施组件:" 
              tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
             name="baseStatus" initialValue={false}>
            <Switch   />
            </Form.Item>
            <Form.Item label="版本复刻:" name="copyName">
              <Select style={{ width: 400 }} loading={verisonLoading} options={versionOptions}  showSearch allowClear/>
            </Form.Item>
          </Form>
        </Modal>
    )
}
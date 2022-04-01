// 导入数据弹窗
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { history } from 'umi';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio, Tag, Modal, Upload } from 'antd';
import './index.less';

// import { createEnv, appTypeList, updateEnv, queryNGList } from '../service';
const { Dragger } = Upload;
export interface EnvEditorProps {
  mode?: EditorMode;
  //   initData?: EnvEditData;
  onClose: () => any;
  //   onSave: () => any;
}

export default function addEnvData(props: EnvEditorProps) {
  const [createEnvForm] = Form.useForm();
  const { mode, onClose } = props;
  //   const { mode, onClose, onSave, initData } = props;
  const [checkedOption, setCheckedOption] = useState<number>(0); //是否启用nacos
  const [nacosChecked, setNacosChecked] = useState<boolean>(false);
  const [needApplyOption, setNeedApplyOption] = useState<number>(1); //是否启用发布审批
  const [needApplyChecked, setNeedApplyChecked] = useState<boolean>(false);
  //ngInstCode
  const [isBlockChangeOption, setIsBlockChangeOption] = useState<number>(0); //是否封网
  const [isBlockChecked, setIsBlockChecked] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [editEnvCode, setEditEnvCode] = useState<boolean>(false);

  //   useEffect(() => {
  //     // selectCategory();
  //   }, [mode]);

  //   useEffect(() => {
  //     if (mode === 'HIDE') return;
  //     queryNGlist();
  //     createEnvForm.resetFields();
  //     if (mode === 'VIEW') {
  //       setIsDisabled(true);
  //     } else {
  //       setIsDisabled(false);
  //     }
  //     if (mode === 'EDIT') {
  //       setEditEnvCode(true);
  //     }
  //     if (initData) {
  //       if (initData?.isBlock === 1) {
  //         setIsBlockChecked(true);
  //         setIsBlockChangeOption(1);
  //       } else {
  //         setIsBlockChecked(false);
  //         setIsBlockChangeOption(0);
  //       }

  //       if (initData?.useNacos === 1) {
  //         setNacosChecked(true);
  //         setCheckedOption(1);
  //       } else {
  //         setNacosChecked(false);
  //         setCheckedOption(0);
  //       }
  //       if (initData?.needApply === 0) {
  //         setNeedApplyChecked(true);
  //         setNeedApplyOption(0);
  //       } else {
  //         setNeedApplyChecked(false);
  //         setNeedApplyOption(1);
  //       }

  //       createEnvForm.setFieldsValue({
  //         ...initData,
  //         isBlock: isBlockChecked,
  //         useNacos: nacosChecked,
  //         needApply: needApplyChecked,
  //       });
  //     }
  //   }, [mode]);
  // 加载应用分类下拉选择
  //   const selectCategory = () => {
  //     getRequest(appTypeList).then((result) => {
  //       const list = (result.data.dataSource || []).map((n: any) => ({
  //         label: n.categoryName,
  //         value: n.categoryCode,
  //         data: n,
  //       }));
  //       setCategoryData(list);
  //     });
  //   };
  const UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info: any) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: any) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Modal
      visible={mode !== 'HIDE'}
      title={mode === 'ADD' ? '导入数据' : ''}
      //   // maskClosable={false}
      //   initData={initData}
      onCancel={() => onClose()}
      width={'40%'}
    >
      <div className="import-data-info">导入数据</div>

      <Dragger {...UploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或者拖拽文件到此区域进行导入</p>
        <p className="ant-upload-hint">请确保上传的文件是根据模版下载的Excel格式，否则会导致导入失败！</p>
      </Dragger>
      <div className="export-data-info">导出数据:</div>
      <div className="export-button">
        <Button type="primary">导出下载</Button>
      </div>
    </Modal>
  );
}

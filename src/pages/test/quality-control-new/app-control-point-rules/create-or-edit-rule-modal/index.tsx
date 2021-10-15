import React, { useEffect, useState, useContext } from 'react';
import { Modal, Select, Form } from 'antd';
import ConfigurePointRulesForm from '../../_components/configure-point-rules-form';
import * as HOOKS from '../../hooks';
import * as APIS from '../../service';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import FELayout from '@cffe/vc-layout';

/**
 * ModalType = 新增 编辑 查看
 */
type ModalType = 'add' | 'edit' | 'view';
interface ICreateOrEditRuleModal {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  ruleModalType: ModalType;
  loadData: () => void;
  ruleId?: any;
}

export default function CreateOrEditRuleModal(props: ICreateOrEditRuleModal) {
  const { visible, setVisible, ruleId, ruleModalType, loadData } = props;
  const isCreate = ruleId === undefined;
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [form] = Form.useForm();
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [appCategoryOptions] = HOOKS.useAppCategoryOptions();

  const [appCodeOptions, setAppCodeOptions] = useState<IOption[]>();

  useEffect(() => {
    if (ruleModalType === 'view') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [ruleModalType]);

  useEffect(() => {
    if (ruleModalType !== 'add' && ruleId) {
      getRequest(APIS.getCodeQualityConf, { data: { id: ruleId } }).then((res) => {
        const { data } = res;
        const formdata = {
          ...data,
          utSwitch: data.utSwitch == 0 ? false : true,
          sonarSwitch: data.sonarSwitch == 0 ? false : true,
        };
        form.setFieldsValue(res.data);
      });
    }
  }, [ruleId, ruleModalType]);

  const getAppCodeByCategory = (value: any) => {
    getRequest(APIS.getAppInfoList, { data: { appCategoryCode: value } }).then((res) => {
      const source = res.data.dataSource.map((item: any) => ({
        label: item.appCode,
        value: item.appCode,
        data: item,
      }));
      setAppCodeOptions(source);
    });
  };

  const onModalOk = () => {
    if (ruleModalType === 'add') {
      const formdata = form.getFieldsValue();
      const requestParams = {
        ...formdata,
        createUser: userInfo.userName,
        utSwitch: formdata.utSwitch ? 1 : 0,
        sonarSwitch: formdata.sonarSwitch ? 1 : 0,
      };
      postRequest(APIS.addCodeQualityConf, { data: requestParams }).then((res) => {
        loadData();
        cancelModal();
      });
    } else if (ruleModalType === 'edit') {
      const formdata = form.getFieldsValue();
      const requestParams = {
        ...formdata,
        modifyUser: userInfo.userName,
        utSwitch: formdata.utSwitch ? 1 : 0,
        sonarSwitch: formdata.sonarSwitch ? 1 : 0,
        id: ruleId,
      };
      postRequest(APIS.updateConf, { data: requestParams }).then((res) => {
        loadData();
        cancelModal();
      });
    } else {
      cancelModal();
    }
  };

  const cancelModal = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      maskClosable={false}
      onOk={() => {
        onModalOk();
      }}
      onCancel={() => {
        cancelModal();
      }}
      title={isCreate ? '新增卡点规则' : '编辑卡点规则'}
      width={700}
    >
      <Form form={form}>
        <Form.Item label="应用分类" name="categoryCode">
          <Select
            options={appCategoryOptions}
            onChange={(value) => {
              getAppCodeByCategory(value);
            }}
            disabled={ruleModalType !== 'add'}
          />
        </Form.Item>
        <Form.Item label="应用code" name="appCode">
          <Select options={appCodeOptions} disabled={ruleModalType !== 'add'} />
        </Form.Item>
      </Form>
      <ConfigurePointRulesForm form={form} isEdit={isEdit} />
    </Modal>
  );
}

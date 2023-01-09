import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, message, Radio } from 'antd';
import DebounceSelect from '@/components/debounce-select';
import { npmCreate, npmUpdate, searchGitAddress } from '@/pages/npm-manage/list/server';
import EditorTable from '@cffe/pc-editor-table';
import UserSelector, { stringToList } from '@/components/user-selector';
import { postRequest, putRequest } from '@/utils/request';

interface IProps {
  type: string;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  param?: any;
}

const shouldUpdate = (keys: string[]) => {
  return (prev: any, curr: any) => {
    return keys.some((key) => prev[key] !== curr[key]);
  };
};

const EditNpm = (props: IProps) => {
  const { type, visible, onClose, onConfirm, param } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  async function handleSubmit() {
    const params = await form.validateFields();
    const { ownerList, gitDir, linkage, relationNpm, materialCenter, openLint, openTest, ...others } = params;

    const submitData: any = {
      ...others,
      npmOwner: ownerList?.join(',') || '',
      customParams: JSON.stringify({
        gitDir,
        linkage,
        relationNpm,
        materialCenter,
        openTest,
        openLint,
      }),
    };

    setLoading(true);
    let res = null;
    if (type === 'add') {
      res = await postRequest(npmCreate, {
        data: submitData,
      });
    } else {
      res = await putRequest(npmUpdate, {
        data: submitData,
      });
    }
    setLoading(false);
    if (res?.success) {
      message.success(type === 'add' ? '新增成功!' : '修改成功');
      form.resetFields();
      void onConfirm();
    }
  }

  function handleClose() {
    form.resetFields();
    onClose();
  }

  useEffect(() => {
    if (visible) {
      const customParams = param?.customParams ? JSON.parse(param.customParams) : {};
      form.setFieldsValue({
        ...(param || {}),
        ...customParams,
        ownerList: stringToList(param?.npmOwner),
      });
    }
  }, [visible]);

  return (
    <Drawer
      width={660}
      title={type === 'add' ? '新增' : '编辑'}
      visible={visible}
      onClose={handleClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={handleClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={form} labelCol={{ flex: '100px' }}>
        <Form.Item label="包名" name="npmName" rules={[{ required: true, message: '请输入包名' }]}>
          <Input disabled={type !== 'add'} />
        </Form.Item>
        <Form.Item label="Git 地址" name="gitAddress" rules={[{ required: true, message: '请输入 gitlab 地址' }]}>
          <DebounceSelect fetchOptions={searchGitAddress} labelInValue={false} placeholder="输入仓库名搜索" />
        </Form.Item>
        <Form.Item label="包目录" name="gitDir">
          <Input placeholder="适用于一个仓库下多个包的模式，填写包的目录" />
        </Form.Item>
        <Form.Item label="多包一起发布" name="linkage">
          <Radio.Group>
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={shouldUpdate(['linkage'])}>
          {({ getFieldValue }) =>
            getFieldValue('linkage') === 1 && (
              <Form.Item label="关联包信息设置:" name="relationNpm">
                <EditorTable
                  columns={[
                    { dataIndex: 'npmName', title: '包名' },
                    { dataIndex: 'gitDir', title: '目录' },
                  ]}
                />
              </Form.Item>
            )
          }
        </Form.Item>
        <Form.Item label="发布物料中心" name="materialCenter" extra="PROD下发布npm同时发布至物料中心">
          <Radio.Group>
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="单测卡口" name="openTest">
          <Radio.Group>
            <Radio value={0}>关闭</Radio>
            <Radio value={1}>开启</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="eslint卡口" name="openLint">
          <Radio.Group>
            <Radio value={0}>关闭</Radio>
            <Radio value={1}>开启</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="负责人" name="ownerList" rules={[{ required: true, message: '请输入负责人' }]}>
          <UserSelector />
        </Form.Item>
        <Form.Item label="描述" name="desc">
          <Input.TextArea placeholder="请输入描述" rows={3} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditNpm;

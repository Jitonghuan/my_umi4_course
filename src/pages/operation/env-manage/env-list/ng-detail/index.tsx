/*
 * @Author: muxi.jth
 * @Date: 2022-03-02 15:09:17
 * @LastEditTime: 2022-03-02 16:01:06
 * @LastEditors: Please set LastEditors
 * @Description: 查看NG实例详情Modal
 * @FilePath: /fe-matrix/src/pages/operation/env-manage/env-list/ng-detail/index.tsx
 */
import React, { useState, useEffect, useCallback } from 'react';
import { history } from 'umi';
import { Input, Spin, Form, Button, Modal, message } from 'antd';
import AceEditor from '@/components/ace-editor';
import { queryNGList } from '../../service';
import { getRequest } from '@/utils/request';

export interface NGInfo extends Record<string, any> {
  visible: boolean;
  onClose: () => any;
  ngCode: string;
}

export default function NGModalDetail(props: NGInfo) {
  const [createNgForm] = Form.useForm();
  const { visible, onClose, ngCode } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [editIsable, setEditIsable] = useState<boolean>(false);
  useEffect(() => {
    if (ngCode) {
      queryNgData();
    }
    return () => {
      setEditIsable(false);
    };
  }, [ngCode]);
  //  查询
  const queryNgData = () => {
    setLoading(true);
    getRequest(queryNGList, {
      data: {
        ngInstCode: ngCode,
      },
    })
      .then((result) => {
        if (result?.success) {
          let data = result?.data.dataSource[0];
          if (!data) {
            message.warning('此NG实例详情为空！');
            createNgForm.setFieldsValue({
              ngInstCode: ngCode,
            });
            setEditIsable(true);
          }
          createNgForm.setFieldsValue({
            ...data,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Modal
      title="NG实例详情"
      visible={visible}
      width={800}
      onCancel={() => {
        onClose();
      }}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            onClose();
          }}
        >
          关闭
        </Button>,
        <Button
          type="primary"
          disabled={editIsable}
          onClick={() => {
            history.push({
              pathname: '/matrix/operation/ng-manage/ng-list',
              state: {
                type: 'editNGInfo',
                ngCode: ngCode,
              },
            });
          }}
        >
          编辑
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Form form={createNgForm} labelCol={{ flex: '120px' }}>
          <Form.Item label="实例CODE：" name="ngInstCode" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 220 }} placeholder="请输入实例CODE" disabled={true}></Input>
          </Form.Item>
          <Form.Item label="实例名：" name="ngInstName" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 220 }} placeholder="请输入实例名" disabled={true}></Input>
          </Form.Item>

          <Form.Item label="实例IP：" name="ipAddress" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 220 }} placeholder="请输入实例IP" disabled={true}></Input>
          </Form.Item>

          <Form.Item label="配置文件路径：" name="confFilePath" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 220 }} placeholder="请输入配置文件路径" disabled={true}></Input>
          </Form.Item>

          <Form.Item label="静态资源路径：" name="resourceFilePath" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 220 }} placeholder="请输入静态资源路径" disabled={true}></Input>
          </Form.Item>

          <Form.Item label="前端域名：" name="serverName" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 220 }} placeholder="请输入前端域名" disabled={true}></Input>
          </Form.Item>
          <Form.Item label="后端域名：" name="beDomainName" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 220 }} placeholder="请输入后端域名" disabled={true}></Input>
          </Form.Item>

          <Form.Item name="reMark" label="备注：">
            <Input.TextArea placeholder="请输入" style={{ width: 480, height: 80 }} disabled={true}></Input.TextArea>
          </Form.Item>
          <div>
            <Form.Item label="配置模版" name="templateContext" className="form-ace" style={{ flexDirection: 'column' }}>
              <AceEditor mode="yaml" height={450} readOnly={true} />
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
}

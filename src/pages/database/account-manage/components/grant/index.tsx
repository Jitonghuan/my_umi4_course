/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 17:24:55
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-07 18:56:28
 * @FilePath: /fe-matrix/src/pages/database/account-manage/components/grant/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useCallback } from 'react';
import { Modal, Input, message, Card, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export interface ScriptEditorProps extends Record<string, any> {
  value?: string;
  onChange?: (next: string) => any;
  title?: string;
  focus?: boolean;
}

export default function ScriptEditor(props: ScriptEditorProps) {
  const { onChange, mode = 'text', title = '编辑脚本', focus = false, ...others } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState('');

  const handleChange = useCallback(
    (e: any) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  const handleShowModal = useCallback(() => {
    setModalVisible(true);
    setTempValue(props.value || '');
  }, [props.value]);

  const handleOk = useCallback(() => {
    onChange?.(tempValue);
    setModalVisible(false);
  }, [tempValue, mode]);

  const handleCancel = useCallback(() => setModalVisible(false), []);
  const handleAceTempChange = useCallback((v: string) => setTempValue(v), []);

  return (
    <>
      <Modal
        title="授权变更"
        width={720}
        visible={modalVisible}
        maskClosable={false}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={[
          <Button key="cancel" style={{ marginRight: 10 }} danger onClick={() => {}}>
            取消
          </Button>,
          <Button key="getValue" type="primary" onClick={() => {}}>
            执行
          </Button>,
        ]}
      >
        <div>
          <h3>实例：&nbsp;&nbsp;账号：</h3>
        </div>
        <div style={{ display: 'flex' }}>
          <Card title="对象选择" extra={<a href="#">More</a>} style={{ width: 300 }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
          <Card title="权限选择" extra={<a href="#">More</a>} style={{ width: 300 }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </div>
      </Modal>
    </>
  );
}

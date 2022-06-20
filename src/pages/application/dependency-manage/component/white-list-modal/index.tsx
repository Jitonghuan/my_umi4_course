import React from 'react';
import { useState, useEffect } from 'react';
import { Input, Button, Form, Select, Space, message, Switch, DatePicker, Transfer, Modal } from 'antd';
import { addRule, updateRule } from '../../service';
import moment from 'moment';

export default function WhiteListModal(props: any) {
  const { mode, onClose, onSave, initData, visible } = props;
  const handleSubmit = () => {};
  return (
    <Modal title="全局白名单" visible={visible} maskClosable={false} footer={false} width={960} onCancel={onClose}>
      <div className="white-list-container">
        {/* <Transfer
                    dataSource={mockData}
                    showSearch
                    filterOption={filterOption}
                    targetKeys={targetKeys}
                    onChange={handleChange}
                    onSearch={handleSearch}
                    render={item => item.title}
                /> */}
      </div>
    </Modal>
  );
}

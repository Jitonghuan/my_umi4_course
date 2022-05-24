/*
 * @Author: muxi.jth
 * @Date: 2022-05-24 10:18:17
 * @LastEditors: Please set LastEditors
 * @Description: 执行详情Modal
 */
import React, { useState, useEffect } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Spin, Form, Modal, Table } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import './index.less';
import { tableColumns } from './schema';

export interface NGInfo extends Record<string, any> {
  visible?: boolean;
  optType?: string;
  onClose?: () => any;
  initData?: any;
}

export default function NGModalDetail(props: NGInfo) {
  const [createBlockForm] = Form.useForm();
  let categoryCurrent: any = [];
  let unSelectedCategoryCurrent: any = [];
  const { visible, onClose, initData, optType } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [ensureLoading, setEnsureLoading] = useState<boolean>(false);
  const [appsListData, setAppsListData] = useState<any>([]);
  const [targetKeys, setTargetKeys] = useState([]); //目标选择的key值
  const [selectedKeys, setSelectedKeys] = useState<any>([]); //已经选择的key值
  const [disabled, setDisabled] = useState<boolean>(false);
  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction: any, e: any) => {};
  let getfilterOption = (inputValue: string, option: any) => option?.title?.indexOf(inputValue) > -1;

  const handleSearch = (dir: any, value: any) => {
    console.log('search:', dir, value);
  };

  return (
    <Modal
      title="执行详情"
      visible={visible}
      width={830}
      onCancel={() => {
        onClose();
      }}
      footer={null}
    >
      <div className="block-data-info">
        <CheckCircleOutlined style={{ color: 'green' }} />
        <span style={{ marginLeft: 10, fontSize: 14 }}>
          <b>
            执行详情：{''}
            <span style={{ marginLeft: 6 }}>({''})</span>
          </b>
        </span>
      </div>
      <Spin spinning={loading}>
        <Table columns={tableColumns} />
      </Spin>
    </Modal>
  );
}

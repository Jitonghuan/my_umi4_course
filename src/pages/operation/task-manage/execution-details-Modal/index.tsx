/*
 * @Author: muxi.jth
 * @Date: 2022-05-24 10:18:17
 * @LastEditors: Please set LastEditors
 * @Description: 执行详情Modal
 */
import React, { useState, useEffect } from 'react';
import { CheckCircleOutlined,RedoOutlined } from '@ant-design/icons';
import { Spin, Form, Modal, Table } from 'antd';
import { useTaskImplementList } from '../hooks';
import './index.less';
import { tableColumns } from './schema';

export interface NGInfo extends Record<string, any> {
  mode: string;
  curRecord: any;
  onClose: () => any;
}

export default function NGModalDetail(props: NGInfo) {
  const [createBlockForm] = Form.useForm();
  const { onClose, mode, curRecord } = props;
  const [loading, pageInfo, source, setSource, setPageInfo, getTaskImplementList] = useTaskImplementList();

  useEffect(() => {
    if (curRecord?.jobCode) {
      getTaskImplementList({ jobCode: curRecord?.jobCode });
    } else {
      return;
    }
  }, [mode]);
  const onFresh=()=>{
    getTaskImplementList({ jobCode: curRecord?.jobCode });
  }
  //触发分页
  const pageSizeClick = (pagination: any) => {
    setPageInfo({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };

    getTaskImplementList({ jobCode: curRecord?.jobCode,...obj });
  };

  return (
    <Modal
      title="执行详情"
      visible={mode !== 'HIDE'}
      width={1000}
      onCancel={() => {
        onClose();
      }}
      footer={null}
    >
      <div className="task-data-info">
        <span>
        <CheckCircleOutlined style={{ color: 'green' }} />
        <span style={{ marginLeft: 10, fontSize: 14 }}>
          <b>
            当前JobCode：
            <span style={{ marginLeft: 6 }}>{curRecord?.jobCode}</span>
          </b>
        </span>

        </span>

        <span><RedoOutlined   onClick={onFresh} /></span>
      </div>
      <Spin spinning={loading}>
        <Table 
          columns={tableColumns} 
          dataSource={source} 
          bordered 
          pagination={{
            current: pageInfo.pageIndex,
            total: pageInfo.total,
            pageSize: pageInfo.pageSize,
            showSizeChanger: true,
            showTotal: () => `总共 ${pageInfo.total} 条数据`,
          }}
          onChange={pageSizeClick}
          />
      </Spin>
    </Modal>
  );
}

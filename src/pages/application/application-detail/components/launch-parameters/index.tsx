/**
 * LaunchParameters
 * @description 启动参数
 * @author moting.nq
 * @create 2021-04-14 14:16
 */

import React, { useState } from 'react';
import { Button, Table } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import { createApp } from './service';
import { IProps, DataSourceType } from './types';
import './index.less';

const rootCls = 'launch-parameters-compo';

const LaunchParameters = (props: IProps) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);

  return (
    <ContentCard className={rootCls}>
      <EditableProTable<DataSourceType>
        className={`${rootCls}__edit-table`}
        rowKey="id"
        size="small"
        bordered
        columnEmptyText={false}
        recordCreatorProps={{
          position: 'bottom',
          newRecordType: 'dataSource',
          creatorButtonText: '新增',
          record: { id: (Math.random() * 1000000).toFixed(0) },
        }}
        columns={[
          {
            title: 'Key',
            dataIndex: 'key',
          },
          {
            title: 'Value',
            dataIndex: 'value',
          },
          {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
              <a
                key="editable"
                onClick={() => {
                  action?.startEditable?.(record.id);
                }}
              >
                编辑
              </a>,
              <a
                key="delete"
                onClick={() => {
                  setDataSource(
                    dataSource.filter((item) => item.id !== record.id),
                  );
                }}
              >
                删除
              </a>,
            ],
          },
        ]}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'single',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
      />

      <div className={`${rootCls}__btns`}>
        <Button
          type="primary"
          onClick={() => {
            // TODO 去除 id
            createApp({}).then((res) => {
              if (res.success) {
                // TODO
                return;
              }
              // TODO
            });
          }}
        >
          发布
        </Button>
        <Button
          onClick={() => {
            // TODO 取消是什么操作
          }}
        >
          取消
        </Button>
      </div>
    </ContentCard>
  );
};

LaunchParameters.defaultProps = {};

export default LaunchParameters;

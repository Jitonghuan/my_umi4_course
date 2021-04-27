/**
 * AddConfigParameters
 * @description
 * @author moting.nq
 * @create 2021-04-14 14:16
 */

import React, { useEffect, useState } from 'react';
import { Button, Table, message } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import { configMultiAdd } from '../../../service';
import { IProps, DataSourceType } from './types';
import './index.less';

const rootCls = 'add-config-parameters-compo';

const AddConfigParameters = ({
  location: {
    query: { appCode, env, type },
  },
}: IProps) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);

  return (
    <ContentCard className={rootCls}>
      <EditableProTable<DataSourceType>
        className={`${rootCls}__edit-table`}
        rowKey="id"
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
            configMultiAdd({
              appCode,
              env,
              type,
              configs: dataSource
                .filter((item) => item.key && item.value)
                .map((item) => ({
                  env,
                  appCode,
                  type,
                  key: item.key!,
                  value: item.value!,
                })),
            }).then((res: any) => {
              if (res.success) {
                message.success('操作成功');
                history.back();
                return;
              }
              message.error(res.errorMsg);
            });
          }}
        >
          发布
        </Button>
        <Button
          onClick={() => {
            history.back();
          }}
        >
          取消
        </Button>
      </div>
    </ContentCard>
  );
};

AddConfigParameters.defaultProps = {};

export default AddConfigParameters;

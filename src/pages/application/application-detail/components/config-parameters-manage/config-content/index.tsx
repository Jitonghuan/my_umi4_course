/**
 * ConfigContent
 * @description 配置内容
 * @author moting.nq
 * @create 2021-04-19 18:29
 */

import React, { useState, useRef } from 'react';
import { history } from 'umi';
import { useEffectOnce, useListData } from 'white-react-use';
import { Popconfirm, Button, message } from 'antd';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import { InlineForm, BasicForm } from '@cffe/fe-backend-component';
import EditConfig, { EditConfigIProps } from './edit-config';
import ImportConfig from './import-config';
import { createFilterFormSchema, createTableSchema } from './schema';
import {
  queryConfigListUrl,
  deleteConfig,
  deleteMultipleConfig,
} from '../../../../service';
import { IProps } from './types';
import { ConfigData } from '../types';
import './index.less';

const rootCls = 'config-content-compo';

const ConfigContent = ({ env, configType, appCode }: IProps) => {
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const [importCfgVisible, setImportCfgVisible] = useState(false);
  const [editCfgData, setEditCfgData] = useState<{
    type: EditConfigIProps['type'];
    visible: boolean;
    curRecord?: ConfigData;
  }>({
    type: 'look',
    visible: false,
  });

  // 查询数据
  const { run: queryConfigList, tableProps, reset } = usePaginated({
    requestUrl: queryConfigListUrl,
    requestMethod: 'GET',
    formatResult: (res) => ({
      dataSource: res.data?.dataSource?.configs || [],
      pageInfo: res.data?.pageInfo || {},
    }),
    pagination: {
      showSizeChanger: true,
      showTotal: (total) => `总共 ${total} 条数据`,
    },
  });

  useEffectOnce(() => {
    queryConfigList({
      env,
      type: configType,
    });
  });

  return (
    <div className={rootCls}>
      <ImportConfig
        env={env}
        configType={configType}
        appCode={appCode}
        visible={importCfgVisible}
        onClose={() => setImportCfgVisible(false)}
        onSubmit={() => {
          setImportCfgVisible(false);
          // 提交成功后，重新请求数据
          queryConfigList({
            pageIndex: 1,
          });
        }}
      />

      <EditConfig
        env={env}
        configType={configType}
        appCode={appCode}
        type={editCfgData.type}
        formValue={editCfgData.curRecord}
        visible={editCfgData.visible}
        onClose={() =>
          setEditCfgData({
            type: 'look',
            visible: false,
            curRecord: undefined,
          })
        }
        onSubmit={() => {
          setEditCfgData({
            type: 'look',
            visible: false,
            curRecord: undefined,
          });
          // 提交成功后，重新请求数据
          queryConfigList();
        }}
      />

      <div className={`${rootCls}__filter`}>
        <InlineForm
          className={`${rootCls}__filter-form`}
          {...(createFilterFormSchema() as any)}
          submitText="查询"
          onFinish={(values) => {
            if (tableProps.loading) return;
            queryConfigList({
              pageIndex: 1,
              ...values,
            });
          }}
        />

        <div className={`${rootCls}__filter-btns`}>
          <Button
            onClick={() => {
              setImportCfgVisible(true);
            }}
          >
            导入配置
          </Button>
          <Button
            onClick={() => {
              history.push({
                pathname:
                  configType === 'app' ? 'addConfig' : 'addLaunchParameters',
                query: {
                  env,
                  type: configType,
                  appCode,
                },
              });
            }}
          >
            新增
          </Button>
          <Popconfirm
            title="确定要删除选中项吗？"
            onConfirm={() => {
              deleteMultipleConfig({ ids: selectedKeys }).then((res: any) => {
                if (res.success) {
                  queryConfigList();
                  return;
                }
                message.error(res.errorMsg);
              });
            }}
            okText="确定"
            cancelText="取消"
            placement="topLeft"
          >
            <Button disabled={!selectedKeys.length}>删除</Button>
          </Popconfirm>
        </div>
      </div>

      <HulkTable
        rowKey="id"
        size="small"
        className={`${rootCls}__table`}
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(
              `selectedRowKeys: ${selectedRowKeys}`,
              'selectedRows: ',
              selectedRows,
            );
            setSelectedKeys(selectedRowKeys);
          },
          // getCheckboxProps: (record: any) => ({
          //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
          //   name: record.name,
          // }),
        }}
        columns={
          createTableSchema({
            onOperateClick: (type, record, i) => {
              if (type === 'detail' || type === 'edit') {
                setEditCfgData({
                  type: type === 'detail' ? 'look' : 'edit',
                  visible: true,
                  curRecord: record,
                });
              } else if (type === 'delete') {
                deleteConfig(record.id).then((res: any) => {
                  if (res.success) {
                    queryConfigList();
                    return;
                  }
                  message.error(res.errorMsg);
                });
              }
            },
          }) as any
        }
        {...tableProps}
      />
    </div>
  );
};

ConfigContent.defaultProps = {};

export default ConfigContent;

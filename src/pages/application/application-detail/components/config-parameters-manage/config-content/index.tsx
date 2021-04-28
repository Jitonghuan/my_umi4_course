/**
 * ConfigContent
 * @description 配置内容
 * @author moting.nq
 * @create 2021-04-19 18:29
 */

import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Form, Popover, Popconfirm, Button, message } from 'antd';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import VCForm, { IColumns } from '@cffe/vc-form';
import { InlineForm, BasicForm } from '@cffe/fe-backend-component';
import EditConfig, { EditConfigIProps } from './edit-config';
import ImportConfig from './import-config';
import {
  createFilterFormSchema,
  createTableSchema,
  getFilterColumns,
} from './schema';
import VersionSelect from './version-select';
import {
  queryConfigListUrl,
  deleteConfig,
  deleteMultipleConfig,
} from '../../../../service';
import { IProps } from './types';
import { ConfigData } from '../types';
import { queryVersionApi, doRestoreVersionApi } from './service';
import './index.less';
import { postRequest } from '@/utils/request';

const rootCls = 'config-content-compo';

const ConfigContent = ({ env, configType, appCode, appId }: IProps) => {
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

  const [filterFormRef] = Form.useForm();

  // 当前选中版本
  const [currentVersion, setCurrentVersion] = useState<{
    id: number;
    versionNumber: string;
  }>();

  // 查询数据
  const { run: queryConfigList, tableProps, reset } = usePaginated({
    requestUrl: queryConfigListUrl,
    requestMethod: 'GET',
    showRequestError: true,
    formatResult: (res: any) => {
      let version = res.data?.dataSource?.version;
      if (version) {
        setCurrentVersion(version);
      }

      return {
        dataSource: res.data?.dataSource?.configs || [],
        pageInfo: res.data?.pageInfo || {},
      };
    },
    pagination: {
      showSizeChanger: true,
      showTotal: (total: number) => `总共 ${total} 条数据`,
    },
  });

  // 查询版本数据
  const { run: queryVersionData, tableProps: versionTableProps } = usePaginated(
    {
      requestUrl: queryVersionApi,
      requestMethod: 'GET',
      showRequestError: true,
      initPageInfo: {
        pageSize: 30, // 默认加载30条版本数据
      },
      successFunc: (resp: any) => {
        const { dataSource = [] } = resp.data || {};

        if (dataSource.length === 0) {
          return;
        }

        filterFormRef.setFieldsValue({
          versionID: dataSource[0].id,
        });
      },
    },
  );

  useEffect(() => {
    if (!appCode) return;
    queryConfigList({
      env,
      appCode,
      type: configType,
    });
  }, [appCode]);

  useEffect(() => {
    if (!appCode) return;

    queryVersionData({
      appCode,
      env,
      type: configType,
    });
  }, [appCode, env, configType]);

  // 回退操作
  const handleRollBack = async () => {
    if (!currentVersion) {
      return;
    }

    const resp = await postRequest(doRestoreVersionApi, {
      data: {
        id: currentVersion.id,
      },
    });

    if (!resp.success) {
      return;
    }

    message.success('回退成功');
    queryVersionData({
      appCode,
      env,
      type: configType,
    });
  };

  const { dataSource = [] } = versionTableProps;

  return (
    <div className={rootCls}>
      <ImportConfig
        env={env}
        configType={configType}
        appCode={appCode!}
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
        appCode={appCode!}
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
        {/* <InlineForm
          className={`${rootCls}__filter-form`}
          {...(createFilterFormSchema({
            versionOptions:
              dataSource?.map((el: any) => ({
                label: el.versionNumber,
                value: el.id,
              })) || [],
          }) as any)}
          submitText="查询"
          customMap={{
            versionSelect: VersionSelect,
          }}
          onValuesChange={(changeVals, values) => {
            const [name, value] = (Object.entries(changeVals)?.[0] || []) as [
              string,
              any,
            ];
            if (name && name === 'versionID') {
              const version = versionTableProps.dataSource?.find(
                (item: any) => item.id === value,
              );
              if (version && tableProps.pagination) {
                const { pageSize = 10 } = tableProps.pagination;
                queryConfigList({
                  pageIndex: 1,
                  pageSize,
                  versionID: version.id,
                });
              }
              setCurrentVersion(version || undefined);
            }
          }}
          onFinish={(values) => {
            if (tableProps.loading) return;
            queryConfigList({
              pageIndex: 1,
              ...values,
            });
          }}
        /> */}

        <VCForm
          className={`${rootCls}__filter-form`}
          layout="inline"
          form={filterFormRef}
          columns={
            getFilterColumns(
              dataSource?.map((el: any) => ({
                label: el.versionNumber,
                value: el.id,
              })) || [],
            ) as IColumns[]
          }
          onValuesChange={(changeVals, values) => {
            const [name, value] = (Object.entries(changeVals)?.[0] || []) as [
              string,
              any,
            ];
            if (name && name === 'versionID') {
              const version = versionTableProps.dataSource?.find(
                (item: any) => item.id === value,
              );
              if (version && tableProps.pagination) {
                const { pageSize = 10 } = tableProps.pagination;
                queryConfigList({
                  pageIndex: 1,
                  pageSize,
                  versionID: version.id,
                });
              }
              setCurrentVersion(version || undefined);
            }
          }}
          submitText="查询"
          onReset={() => {
            queryConfigList({
              versionID: undefined,
              key: undefined,
              value: undefined,
              pageIndex: 1,
            });
          }}
          onSubmit={(values) => {
            if (tableProps.loading) return;
            queryConfigList({
              pageIndex: 1,
              ...values,
            });
          }}
        />

        <div className={`${rootCls}__filter-btns`}>
          <Popconfirm
            title="确定回退到当前版本？"
            disabled={
              !currentVersion ||
              versionTableProps.dataSource?.[0]?.id === currentVersion?.id
            }
            onConfirm={handleRollBack}
          >
            <Button
              type="primary"
              danger
              disabled={
                !currentVersion ||
                versionTableProps.dataSource?.[0]?.id === currentVersion?.id
              }
            >
              回退
            </Button>
          </Popconfirm>
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
                  appCode: appCode!,
                  id: appId,
                },
              });
            }}
          >
            新增
          </Button>
          <Popconfirm
            title="确定要删除选中项吗？"
            disabled={!selectedKeys.length}
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
            currentVersion,
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

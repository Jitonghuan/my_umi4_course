/**
 * ConfigContent
 * @description 配置内容
 * @author moting.nq
 * @create 2021-04-19 18:29
 */

import React, { useEffect, useState, useContext } from 'react';
import { history } from 'umi';
import { Form, Select, Input, Popconfirm, Button, message } from 'antd';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import DetailContext from '@/pages/application/application-detail/context';
import EditConfig, { EditConfigIProps } from './edit-config';
import ImportConfig from './import-config';
import { createTableSchema } from './schema';
import { queryConfigListUrl, deleteConfig, deleteMultipleConfig } from '@/pages/application/service';
import { IProps } from './types';
import { ConfigData } from '../types';
import { queryVersionApi, doRestoreVersionApi } from './service';
import './index.less';
import { getRequest, postRequest } from '@/utils/request';

const rootCls = 'config-content-compo';

export default function ConfigContent({ env, configType }: IProps) {
  const { appData } = useContext(DetailContext);
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
  const [versionData, setVersionData] = useState<any[]>([]);

  // 当前选中版本
  const [currentVersion, setCurrentVersion] = useState<{
    id: number;
    versionNumber: string;
  }>();

  const { appCode, id: appId } = appData || {};

  // 查询数据
  const {
    run: queryConfigList,
    tableProps,
    reset,
  } = usePaginated({
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
    initParams: {
      appCode,
    },
  });

  // 查询版本数据
  const queryVersionData = async (listParams?: any) => {
    const resp = await getRequest(queryVersionApi, {
      data: {
        pageSize: 30,
        pageIndex: 1,
        appCode,
        env,
        type: configType,
      },
    });

    const { dataSource = [] } = resp?.data || {};

    if (dataSource.length === 0) {
      return;
    }

    setVersionData(dataSource);
    filterFormRef.setFieldsValue({
      versionID: dataSource[0].id,
    });
    queryConfigList({
      versionID: dataSource[0].id,
      ...(listParams || {}),
    });
  };

  useEffect(() => {
    if (!appCode) return;

    queryVersionData();
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
    queryVersionData();
  };

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
          queryVersionData({
            pageIndex: 1,
          });
          // queryConfigList({
          //   pageIndex: 1,
          // });
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
          queryVersionData();
          // queryConfigList();
        }}
      />

      <div className={`${rootCls}__filter`}>
        <Form
          className={`${rootCls}__filter-form`}
          layout="inline"
          form={filterFormRef}
          onValuesChange={(changeVals, values) => {
            const [name, value] = (Object.entries(changeVals)?.[0] || []) as [string, any];
            if (name && name === 'versionID') {
              const version = versionData?.find((item: any) => item.id === value);
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
          onReset={() => {
            queryConfigList({
              versionID: undefined,
              key: undefined,
              value: undefined,
              pageIndex: 1,
            });
          }}
          onFinish={(values) => {
            if (tableProps.loading) return;
            queryConfigList({
              pageIndex: 1,
              ...values,
            });
          }}
        >
          <Form.Item label="版本" name="versionID">
            <Select
              options={versionData?.map((el: any) => ({
                label: el.versionNumber,
                value: el.id,
              }))}
              placeholder="请选择版本"
              style={{ width: 140 }}
            />
          </Form.Item>
          <Form.Item label="Key" name="key">
            <Input placeholder="请输入key" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item label="Value" name="value">
            <Input placeholder="请输入value" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ marginRight: 12 }}>
              查询
            </Button>
            <Button htmlType="reset" type="default">
              重置
            </Button>
          </Form.Item>
        </Form>

        <div className={`${rootCls}__filter-btns`}>
          <Popconfirm
            title="确定回退到当前版本？"
            disabled={!currentVersion || versionData?.[0]?.id === currentVersion?.id}
            onConfirm={handleRollBack}
          >
            <Button type="primary" danger disabled={!currentVersion || versionData?.[0]?.id === currentVersion?.id}>
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
                pathname: configType === 'app' ? 'addConfig' : 'addLaunchParameters',
                query: {
                  env,
                  type: configType,
                  appCode: appCode!,
                  id: `${appId}`,
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
                  // queryConfigList();
                  queryVersionData();
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
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedKeys(selectedRowKeys);
          },
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
                    queryVersionData();
                    // queryConfigList();
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
}

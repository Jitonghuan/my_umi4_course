/**
 * ConfigContent
 * @description 配置内容
 * @author moting.nq
 * @create 2021-04-19 18:29
 */

import React, { useEffect, useState, useContext } from 'react';
import { history } from 'umi';
import { Form, Select, Input, Popconfirm, Button, message, Space } from 'antd';
import { usePaginated } from '@cffe/vc-hulk-table';
import DetailContext from '@/pages/application/application-detail/context';
import EditConfig, { EditConfigIProps } from './edit-config';
import ImportConfig from './import-config';
import AceEditor from '@/components/ace-editor';
import { queryConfigListUrl, deleteConfig, deleteMultipleConfig, tmplType, envList } from '@/pages/application/service';
import { IProps } from './types';
import { ConfigData } from '../types';
import { queryVersionApi, doRestoreVersionApi } from './service';
import './index.less';
import { getRequest, postRequest } from '@/utils/request';

const rootCls = 'config-content-compo';

export default function ConfigContent({ env, configType }: IProps) {
  const { appData } = useContext(DetailContext);
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
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
  // 进入页面显示结果
  const { appCategoryCode } = appData || {};
  useEffect(() => {
    selectAppEnv(appCategoryCode).then((result) => {
      const listEnv = result.data.dataSource?.map((n: any) => ({
        value: n?.envCode,
        label: n?.envName,
        data: n,
      }));
      setEnvDatas(listEnv);
    });
  }, []);

  //通过appCategoryCode查询环境信息
  const selectAppEnv = (categoryCode: any) => {
    return getRequest(envList, { data: { categoryCode: categoryCode } });
  };
  //改变下拉选择后查询结果
  let getEnvCode: any;
  const changeEnvCode = (getEnvCodes: string) => {
    getEnvCode = getEnvCodes;
    console.log('getEnvCodes', getEnvCodes);
    queryVersionData();
  };
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
    console.log('listParams', listParams);
    const resp = await getRequest(queryVersionApi, {
      data: {
        pageSize: 30,
        pageIndex: 1,
        appCode,
        env: getEnvCode,
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

  // useEffect(() => {
  //   if (!appCode) return;

  //   queryVersionData();
  // }, [appCode, env, configType]);

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
          <Form.Item label="环境" name="appEnvCode">
            <Select placeholder="请选择" style={{ width: 140 }} options={envDatas} onChange={changeEnvCode} />
          </Form.Item>
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
            <Button type="primary" danger disabled={!currentVersion} style={{ marginRight: '34%' }}>
              回退
            </Button>
          </Popconfirm>
        </div>
      </div>

      <div style={{ fontStyle: '#f7f8fa' }}>
        <span>
          版本号：<Input disabled style={{ width: 140, marginTop: 20, marginBottom: 10 }} bordered={false}></Input>
        </span>
      </div>

      <Form>
        <div style={{ width: '96%' }}>
          <Form.Item name="configYaml" rules={[{ required: true, message: '这是必填项' }]}>
            <AceEditor mode="yaml" height={600} />
          </Form.Item>
        </div>
        <div style={{ marginTop: '10px', float: 'right' }}>
          <Form.Item name="ensure">
            <Button
              type="ghost"
              htmlType="reset"
              onClick={() =>
                history.push({
                  pathname: 'tmpl-list',
                })
              }
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit" disabled={true} style={{ marginLeft: '4px' }}>
              确定
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}

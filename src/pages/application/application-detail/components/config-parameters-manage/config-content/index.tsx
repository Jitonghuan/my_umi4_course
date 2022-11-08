/**
 * ConfigContent
 * @description 配置内容
 * @author moting.nq
 * @create 2021-04-19 18:29
 */

import React, { useEffect, useState, useContext } from 'react';
import { Form, Select, Popconfirm, Button, message } from 'antd';
import DetailContext from '@/pages/application/application-detail/context';
import AceEditor from '@/components/ace-editor';
import { queryConfigList} from '@/pages/application/service';
import { IProps } from './types';
import { queryVersionApi, doRestoreVersionApi, configAdd, configUpdate } from './service';
import { listAppEnv } from '@/pages/application/service';
import './index.less';
import { getRequest, postRequest, putRequest } from '@/utils/request';
const rootCls = 'config-content-detail';
export default function ConfigContent({ env, configType }: IProps) {
  const { appData } = useContext(DetailContext);
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [currentEnvData, setCurrentEnvData] = useState(); //当前选中的环境；
  const [version, setVersion] = useState(''); //版本号
  const [configId, setConfigId] = useState(''); //配置内容的Id
  const [filterFormRef] = Form.useForm();
  const [editVersionForm] = Form.useForm();
  const [versionData, setVersionData] = useState<any[]>([]); //版本下拉选择框的全部数据
  const { appCategoryCode, appCode, id: appId } = appData || {};
  const [currentVersion, setCurrentVersion] = useState<any>(0); //当前选中的Version
  const [latestVersion, setLatestVersion] = useState<any>(0); //最新的版本
  const [versionConfig, setversionConfig] = useState(''); //展示配置内容
  const [editDisable, setEditDisable] = useState<boolean>(false);
  let currentEnvCode = '';
  useEffect(() => {
    if (!appCode) return;

    return () => {
      setEditDisable(false);
    };
  }, []);

  function fixString(envCode: string) {
    let appointString = 'clusterb';
    try {
      envCode = envCode?.toLowerCase(); //不区分大小写：全部转为小写后进行判断
      let start = envCode.length - appointString.length;
      var char = envCode.substr(start, appointString.length); //将相差长度作为开始下标，特定字符长度为截取长度

      if (char == appointString) {
        //两者相同，则代表是以clusterb结尾，则需要禁用编辑功能；
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  // 查询应用环境数据  获取到的该应用的环境信息用来判断useNacose的值
  // 进入页面加载环境和版本信息
  useEffect(() => {
    try {
      selectAppEnv().then((result: any) => {
        const dataSources = result.data?.map((n: any) => ({
          value: n?.envCode,
          label: n?.envName,
          useNacos: n?.useNacos,
          data: n,
        }));
        let listEnv: any = [];
        dataSources.forEach((el: any) => {
          if (el.useNacos === 1) {
            listEnv.push(el);
          }
        });
        setEnvDatas(listEnv);
        currentEnvCode = listEnv[0]?.data?.envCode;
        if (fixString(listEnv[0]?.data?.envCode)) {
          setEditDisable(true);
        } else {
          setEditDisable(false);
        }
        setCurrentEnvData(listEnv[0]?.data?.envCode);

        if (listEnv.length === 0) {
          return;
        }

        queryVersionData(currentEnvCode); //一进入页面根据默认显示的环境查询的版本信息选项
        //加载环境、版本、版本号默认显示在页面上
        filterFormRef.setFieldsValue({
          envCode: listEnv[0]?.data?.envCode, //环境一进入页面显示
        });
      });
    } catch (error) {
      message.warning(error);
    }
  }, [env]);

  //通过appCode,appCategoryCode和env查询环境信息
  const selectAppEnv = () => {
    return getRequest(listAppEnv, { data: { appCode, envTypeCode: env, proEnvType: 'benchmark' } });
  };

  //改变环境下拉选择后查询结果
  let getEnvCode: any;
  const changeEnvCode = (getEnvCodes: string) => {
    getEnvCode = getEnvCodes;
    if (fixString(getEnvCodes)) {
      setEditDisable(true);
    } else {
      setEditDisable(false);
    }

    editVersionForm.setFieldsValue({
      configYaml: '',
    }); //清除上个环境配置信息
    setCurrentEnvData(getEnvCode);
    queryVersionData(getEnvCode); //改变环境后查询版本信息选项
  };
  // 查询版本下拉框数据
  let getVersionData: any = [];
  let currentVersionNumber = '';
  let currentVersionId = 0;
  const queryVersionData = async (envCodeParams?: any) => {
    await getRequest(queryVersionApi, {
      data: {
        pageSize: 30,
        pageIndex: 1,
        appCode,
        envCode: envCodeParams,
      },
    }).then((resp: any) => {
      if (resp.success) {
        resp?.data.dataSource?.map((el: any) => {
          getVersionData.push({
            label: el.versionNumber,
            value: el.id,
            isLatest: el.isLatest,
          });
          if (el.isLatest === 0) {
            currentVersionId = el.id;
            currentVersionNumber = el.versionNumber;
            setLatestVersion(currentVersionId);
            setVersion(el.versionNumber);
          }
        });
        filterFormRef.setFieldsValue({
          versionID: currentVersionId, //版本一进入页面显示
        });

        let queryConfigValue = {
          appCode,
          pageIndex: 1,
          envCode: currentEnvCode || getEnvCode || currentEnvData,
          versionID: currentVersionId || '',
        };
        getQueryConfig(queryConfigValue); //一进入页面查询配置信息
        setVersion(currentVersionNumber); //存储版本号
        setCurrentVersion(currentVersionId); //存储当前的版本ID
        setVersionData(getVersionData);
      }
    });
  };
  //改变版本
  let getVersionNumber = '';
  const changeVersion = (el: any) => {
    setCurrentVersion(el);
    versionData?.map((item: any) => {
      if (item.value == el) {
        getVersionNumber = item.label;
      }
    });
    let getConfigValue = {
      appCode,
      pageIndex: 1,
      envCode: currentEnvData || getEnvCode,
      versionID: el || '',
    };
    getQueryConfig(getConfigValue); //切换版本后自动去查询配置信息
    setVersion(getVersionNumber); //切换版本后去刷新版本号展示
  };
  // 查询配置信息
  const getQueryConfig = (values: any) => {
    queryConfigList({ appCode: appCode, pageIndex: 1, ...values }).then((reslut: any) => {
      let configs = reslut?.list[0]?.value;
      if (configs) {
        if (values.versionID === '') {
          window.location.reload();
        }
        setversionConfig(configs); //存储当前的配置信息
        // setCurrentVersion(configs);
        setConfigId(reslut?.list[0].id); //存储当前的配置ID
        editVersionForm.setFieldsValue({
          configYaml: configs,
        });
      }
    });
  };

  // 确认配置
  const editVersion = (values: any) => {
    if (currentVersion === 0 || configId === '') {
      postRequest(configAdd, {
        data: {
          appCode,
          value: values.configYaml,
          envCode: currentEnvData,
        },
      })
        .then((res) => {
          if (res.success) {
            message.success('配置创建成功！');
          }
        })
        .finally(() => {
          queryVersionData(currentEnvData);
        });
    } else {
      putRequest(configUpdate, {
        data: {
          id: configId,
          appCode,
          value: values.configYaml,
        },
      })
        .then((res) => {
          if (res.success) {
            message.success('配置编辑成功！');
          }
        })
        .finally(() => {
          queryVersionData(currentEnvData);
        });
    }
  };

  // 回退操作
  const handleRollBack = async () => {
    const resp = await postRequest(doRestoreVersionApi, {
      data: {
        id: currentVersion,
      },
    });
    if (!resp.success) {
      return;
    }
    message.success('回退成功');
    queryVersionData(currentEnvData);
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__filter`}>
        <Form
          className={`${rootCls}__filter-form`}
          layout="inline"
          form={filterFormRef}
          onValuesChange={(changeVals, values) => {
            if (values) {
              // const version = versionData?.find((item: any) => item.id === value);
              setCurrentVersion(values.versionID);
              setCurrentEnvData(values.envCode);
            }
          }}
          onReset={() => {
            editVersionForm.setFieldsValue({
              configYaml: '',
            });
            setVersion('');
          }}
          onFinish={getQueryConfig}
        >
          <Form.Item label="环境" name="envCode">
            <Select placeholder="请选择" style={{ width: 200 }} options={envDatas} onChange={changeEnvCode} />
          </Form.Item>
          <Form.Item label="版本" name="versionID">
            <Select
              options={versionData || []}
              placeholder="请选择版本"
              onChange={changeVersion}
              style={{ width: 220 }}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="reset">
              重置
            </Button>
          </Form.Item>
        </Form>
        {/* versionData.length > 1 && */}
        <div className={`${rootCls}__filter-btns`} style={{ marginRight: '4%' }}>
          <Popconfirm
            title="确定回退到当前版本？"
            disabled={latestVersion === currentVersion}
            onConfirm={handleRollBack}
          >
            <Button type="primary" danger disabled={latestVersion === currentVersion}>
              回退
            </Button>
          </Popconfirm>
        </div>
      </div>
      <div style={{ color: '#A9A9A9', marginTop: '18px' }}>
        <span>版本号：{version}</span>
      </div>
      <Form
        form={editVersionForm}
        onReset={() => {
          editVersionForm.setFieldsValue({
            configYaml: versionConfig,
          });
        }}
        onFinish={editVersion}
      >
        <div className="content-ace-editor">
          <Form.Item name="configYaml" rules={[{ required: true, message: '这是必填项' }]}>
            <AceEditor mode="yaml" height={'100%'} readOnly={editDisable} />
          </Form.Item>
        </div>
        <div style={{ marginTop: '14px', marginRight: '4%', float: 'right' }}>
          <Form.Item name="ensure">
            <Button type="ghost" htmlType="reset" danger>
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: '4px' }}
              disabled={latestVersion !== currentVersion}
            >
              确定
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}

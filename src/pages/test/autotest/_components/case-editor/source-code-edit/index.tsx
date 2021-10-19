import React, { useState, useEffect, useContext } from 'react';
import AceEditor from '@/components/ace-editor';
import FELayout from '@cffe/vc-layout';
import YAML from 'yaml';
import * as APIS from '../../../service';
import * as HOOKS from '../../../hooks';
import DebounceSelect from '@/components/debounce-select';
import YmlDebug from '../../yml-debug';
import { getCaseListByIds } from '../common';
import { Button, Input, Table, ConfigProvider, Space, Empty, Select, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import './index.less';

export default function SourceCodeEdit(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { data, editorValue, setEditorValue, defaultProjectId } = props;

  const [editStatus, setEditStatus] = useState<'success' | 'error' | 'warning' | 'default'>();
  const [debugModalVisible, setDebugModalVisible] = useState<boolean>(false);
  const [ymlData, setYmlData] = useState<any>();
  const [preCases, setPreCases] = useState<React.Key[]>([]);
  const [preSavedVars] = HOOKS.usePreSavedVars(preCases);
  const [finalVariableData, setFinalVariableData] = useState<any[]>(preSavedVars);
  const [varKeyword, setVarKeyword] = useState<string>('');

  const [hideRight, setHideRight] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const [projectOptions] = HOOKS.useProjectOptions();
  const [projectId, setProjectId] = useState<any>();

  useEffect(() => {
    setProjectId(defaultProjectId);
  }, [defaultProjectId]);

  useEffect(() => {
    let JsonData;
    try {
      JsonData = YAML.parse(editorValue);
    } catch (e) {
      message.error('格式不正确');
      setEditStatus('error');
      return;
    }

    setPreCases(JsonData?.pre_cases);
  }, []);

  useEffect(() => {
    handleSearch();
  }, [preSavedVars]);

  const handleSearch = (val: string = varKeyword) => {
    setVarKeyword(val);
    setFinalVariableData(preSavedVars.filter((item: any) => item.name?.includes(val)));
  };

  const handleDebug = () => {
    try {
      if (props.mode == 'ADD') {
        setYmlData({ ...YAML.parse(editorValue), apiId: props.current?.bizId! });
      } else {
        setYmlData({ ...YAML.parse(editorValue), apiId: props.initData?.apiId });
      }
    } catch (e) {
      message.error('格式不正确');
      setEditStatus('error');
      return;
    }

    setDebugModalVisible(true);
  };

  const handleFormDataSubmit = async (values: any) => {
    if (typeof props.hookBeforeSave === 'function') {
      const flag = await props.hookBeforeSave(props.mode, values);
      if (!flag) return false;
    }

    if (props.mode == 'ADD') {
      await postRequest(APIS.saveCaseInfo, {
        data: {
          ...values,
          apiId: props.current?.bizId!,
          createUser: userInfo.userName,
          modifyUser: userInfo.userName,
        },
      });
    } else {
      await postRequest(APIS.updateCaseInfo, {
        data: {
          ...values,
          id: props.initData?.id,
          apiId: props.initData?.apiId,
          createUser: props.initData?.createUser,
          modifyUser: userInfo.userName,
        },
      });
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!editorValue) return;
    setSubmitLoading(true);
    let finalCaseJSON;
    try {
      finalCaseJSON = YAML.parse(editorValue);
    } catch (e) {
      message.error('格式不正确');
      setEditStatus('error');
      setSubmitLoading(false);
      return;
    }

    const loadEnd = message.loading('正在保存');

    const { data: formData } = await postRequest(APIS.ymlToCase, {
      data: {
        ...finalCaseJSON,
        apiId: props.initData?.apiId,
        validates: finalCaseJSON.validate,
        validate: undefined,
        modifyUser: userInfo.userName,
      },
    });

    const flag = await handleFormDataSubmit(formData);

    loadEnd();
    if (flag) {
      props.onSave?.();
      message.success('保存成功');
    } else message.warning('保存失败');

    setSubmitLoading(false);
  };

  const beforeCaseLoadOptions = async (keyword: string) => {
    if (!keyword) return [];

    const result = await getRequest(APIS.getPreCaseList, {
      data: {
        projectId,
        keyword: keyword?.trim() || '',
      },
    });

    return (result.data || []).map((n: any) => ({
      value: n.caseId,
      label: `${n.projectName}/${n.moduleName}/${n.apiName}/${n.caseName}`,
      data: n,
    }));
  };

  const jobLoadOptions = async (keyword: string) => {
    const result = await getRequest(APIS.getFuncSqlList, {
      data: {
        keyword: keyword?.trim() || '',
        pageIndex: 1,
        pageSize: 50,
      },
    });

    return (result.data || []).map((n: any) => ({
      value: n.id,
      label: `${n.name}-${n.desc}`,
      data: n,
    }));
  };

  const beforeCaseHandleSelect = async (_: any, item: any) => {
    let caseInfo: any;
    try {
      caseInfo = YAML.parse(editorValue);
    } catch (e) {
      message.warning('源码格式不正确！');
      return;
    }

    caseInfo.pre_cases = caseInfo.pre_cases || [];

    let newPreCaseIds = (item.data.preCases.length && item.data.preCases?.split(',').map((id: string) => +id)) || [];
    newPreCaseIds = newPreCaseIds.filter((id: number) => !caseInfo.pre_cases.includes(id));
    caseInfo.pre_cases.push(...[...newPreCaseIds, item.data.caseId]);

    setEditorValue(YAML.stringify(caseInfo));
    setPreCases(caseInfo.pre_cases);
  };

  const beforeJobHandleSelect = async (_: any, item: any) => {
    let caseInfo;
    try {
      caseInfo = YAML.parse(editorValue);
    } catch (e) {
      message.warning('源码格式不正确！');
      return;
    }
    const newJob = { id: item.data.id, type: item.data.type, argument: '' };
    if (caseInfo.setup_hooks) {
      if (caseInfo.setup_hooks.findIndex((item: any) => item.id === newJob.id) !== -1) return;
      caseInfo.setup_hooks.push(newJob);
    } else {
      caseInfo.setup_hooks = [newJob];
    }
    setEditorValue(YAML.stringify(caseInfo));
  };

  const afterJobHandleSelect = async (_: any, item: any) => {
    let caseInfo;
    try {
      caseInfo = YAML.parse(editorValue);
    } catch (e) {
      message.warning('源码格式不正确！');
      return;
    }
    const newJob = { id: item.data.id, type: item.data.type, argument: '' };
    if (caseInfo.teardown_hooks) {
      if (caseInfo.teardown_hooks.findIndex((item: any) => item.id === newJob.id) !== -1) return;
      caseInfo.teardown_hooks.push(newJob);
    } else {
      caseInfo.teardown_hooks = [newJob];
    }
    setEditorValue(YAML.stringify(caseInfo));
  };

  return (
    <>
      <div className="drawer-body-inner source-code-edit-container">
        <div className="source-code-edit-container">
          <div className={`edit-container ${hideRight ? 'edit-container-expand' : ''}`}>
            <Space className="select-container">
              <label className="select-item-container">
                前置脚本:{' '}
                <DebounceSelect
                  className="select-item"
                  fetchOnMount
                  fetchOptions={jobLoadOptions}
                  onSelect={beforeJobHandleSelect}
                  autoFocus
                  suffixIcon={null}
                  placeholder="输入关键字搜索"
                />
              </label>
              <span
                className="select-item-container"
                style={{ width: '300px', display: hideRight ? 'flex' : undefined }}
              >
                <span style={{ width: '70px', textAlign: 'center', paddingTop: '2px' }}>前置用例: </span>
                <div style={{ display: 'flex', flex: '1' }}>
                  <Select
                    style={{ width: '60px' }}
                    options={projectOptions}
                    onSelect={setProjectId}
                    value={projectId}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: '200px' }}
                  />
                  <DebounceSelect
                    style={{ flex: '1', minWidth: '134px', maxWidth: '170px' }}
                    fetchOnMount
                    fetchOptions={beforeCaseLoadOptions}
                    onSelect={beforeCaseHandleSelect}
                    autoFocus
                    suffixIcon={null}
                    placeholder="输入关键字搜索"
                  />
                </div>
              </span>
              <label className="select-item-container">
                后置脚本:{' '}
                <DebounceSelect
                  className="select-item"
                  fetchOnMount
                  fetchOptions={jobLoadOptions}
                  onSelect={afterJobHandleSelect}
                  autoFocus
                  suffixIcon={null}
                  placeholder="输入关键字搜索"
                />
              </label>
            </Space>
            <AceEditor
              status={editStatus}
              mode="yaml"
              height={`calc(100vh - ${hideRight ? 205 : 227}px)`}
              value={editorValue}
              onChange={(val) => {
                setEditorValue(val);
                setEditStatus('default');
              }}
            />
          </div>
          <div className={`variable-pool ${hideRight ? 'variable-pool-hide' : ''}`}>
            <div
              className={`hide-icon hide-icon-${hideRight ? 'true' : 'false'}`}
              onClick={() => setHideRight(!hideRight)}
            >
              {hideRight ? <LeftOutlined /> : <RightOutlined />}
            </div>
            {hideRight ? null : (
              <>
                <Input.Search className="search-header" onSearch={handleSearch} />
                <ConfigProvider
                  renderEmpty={() => (
                    <Empty description="请先定义变量或选择前置用例" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                >
                  <Table
                    bordered
                    className="variable-pool-table"
                    dataSource={finalVariableData}
                    pagination={false}
                    scroll={{ y: 'calc(100vh - 252px)' }}
                  >
                    <Table.Column title="变量名" dataIndex="name" />
                    <Table.Column title="变量值" dataIndex="value" />
                    <Table.Column title="描述" dataIndex="desc" />
                  </Table>
                </ConfigProvider>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="drawer-custom-footer">
        <Button onClick={handleDebug}>调试</Button>
        <Button loading={submitLoading} type="primary" onClick={handleSubmit}>
          提交
        </Button>
      </div>
      <YmlDebug visible={debugModalVisible} ymlData={ymlData} onClose={() => setDebugModalVisible(false)} />
    </>
  );
}

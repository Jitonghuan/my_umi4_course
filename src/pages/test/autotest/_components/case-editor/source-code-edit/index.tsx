import React, { useState, useEffect, useContext } from 'react';
import AceEditor from '@/components/ace-editor';
import FELayout from '@cffe/vc-layout';
import YAML from 'yaml';
import * as APIS from '../../../service';
import DebounceSelect from '@/components/debounce-select';
import YmlDebug from '../../yml-debug';
import { Button, Input, Table, ConfigProvider, Space, Empty, message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import './index.less';

export default function SourceCodeEdit(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { data, variableData, editorValue, setEditorValue } = props;

  // const [editorValue, setEditorValue] = useState<any>();
  const [finalVariableData, setFinalVariableData] = useState<any[]>(variableData);
  const [editStatus, setEditStatus] = useState<'success' | 'error' | 'warning' | 'default'>();

  const [debugModalVisible, setDebugModalVisible] = useState<boolean>(false);
  const [ymlData, setYmlData] = useState<any>();

  useEffect(() => {
    setFinalVariableData(variableData);
  }, [variableData]);

  const handleSearch = (val: string) => {
    setFinalVariableData(variableData.filter((item: any) => item?.a?.includes(val)));
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
    let finalCaseJSON;
    try {
      finalCaseJSON = YAML.parse(editorValue);
    } catch (e) {
      message.error('格式不正确');
      setEditStatus('error');
      return;
    }

    const loadEnd = message.loading('正在保存');

    console.log('finalCaseJSON :>> ', finalCaseJSON);
    const { data: formData } = await postRequest(APIS.ymlToCase, {
      data: { ...finalCaseJSON, apiId: props.initData?.apiId, validates: finalCaseJSON.validate, validate: undefined },
    });

    const flag = await handleFormDataSubmit(formData);

    loadEnd();
    if (flag) {
      props.onSave?.();
      message.success('保存成功');
    } else message.warning('保存失败');
  };

  const beforeCaseLoadOptions = async (keyword: string) => {
    if (!keyword) return [];

    const result = await getRequest(APIS.getPreCaseList, {
      data: {
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
    let caseInfo;
    try {
      caseInfo = YAML.parse(editorValue);
    } catch (e) {
      message.warning('源码格式不正确！');
      return;
    }
    const newCase = item.value;
    if (caseInfo.pre_cases) {
      if (caseInfo.pre_cases.includes(newCase)) return;
      caseInfo.pre_cases.push(newCase);
    } else {
      caseInfo.pre_cases = [newCase];
    }
    setEditorValue(YAML.stringify(caseInfo));
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
          <div className="edit-container">
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
              <label className="select-item-container">
                前置用例:{' '}
                <DebounceSelect
                  className="select-item"
                  fetchOnMount
                  fetchOptions={beforeCaseLoadOptions}
                  onSelect={beforeCaseHandleSelect}
                  autoFocus
                  suffixIcon={null}
                  placeholder="输入关键字搜索"
                />
              </label>
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
              height="calc(100vh - 263px)"
              value={editorValue}
              onChange={(val) => {
                setEditorValue(val);
                setEditStatus('default');
              }}
            />
          </div>
          <div className="variable-pool">
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
                <Table.Column title="变量名" dataIndex="a" />
                <Table.Column title="变量值" />
                <Table.Column title="描述" />
              </Table>
            </ConfigProvider>
          </div>
        </div>
      </div>
      <div className="drawer-custom-footer">
        <Button onClick={handleDebug}>调试</Button>
        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
      </div>
      <YmlDebug visible={debugModalVisible} ymlData={ymlData} onClose={() => setDebugModalVisible(false)} />
    </>
  );
}

import React, { useState, useEffect } from 'react';
import AceEditor from '@/components/ace-editor';
import YAML from 'yaml';
import * as APIS from '../../../service';
import DebounceSelect from '@/components/debounce-select';
import { Button, Input, Table, Select, Space, message } from 'antd';
import { getRequest } from '@/utils/request';
import { CaseItemVO } from '../../../interfaces';
import './index.less';

export default function SourceCodeEdit(props: any) {
  const { data, variableData } = props;

  const [editorValue, setEditorValue] = useState<any>();
  const [finalVariableData, setFinalVariableData] = useState<any[]>(variableData);

  useEffect(() => {
    setFinalVariableData(variableData);

    const tmpData = { ...data };
    try {
      tmpData.parameters = JSON.parse(tmpData.parameters);
    } catch (e) {
      tmpData.parameters = {};
    }
    setEditorValue(YAML.stringify(tmpData));
  }, [variableData, data]);

  const handleSearch = (val: string) => {
    setFinalVariableData(variableData.filter((item: any) => item?.a?.includes(val)));
  };

  const handleSave = () => {
    if (!editorValue) return;
    let finalCaseInfo;
    try {
      finalCaseInfo = YAML.parse(editorValue);
    } catch (e) {
      message.error('格式不正确');
      return;
    }

    console.log('finalCaseInfo :>> ', finalCaseInfo);
    //TODO: 保存
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
    console.log('beforeCaseHandleSelect :>> ', item);
  };

  const beforeJobHandleSelect = async (_: any, item: any) => {
    console.log('beforeJobHandleSelect :>> ', item);
  };

  const afterJobHandleSelect = async (_: any, item: any) => {
    console.log('afterJobHandleSelect :>> ', item);
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
            <AceEditor mode="yaml" height="calc(100vh - 263px)" value={editorValue} onChange={setEditorValue} />
          </div>
          <div className="variable-pool">
            <Input.Search className="search-header" onSearch={handleSearch} />
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
          </div>
        </div>
      </div>
      <div className="drawer-custom-footer">
        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
      </div>
    </>
  );
}

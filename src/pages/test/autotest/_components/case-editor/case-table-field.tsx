// 用例选择器
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 15:09

import React, { useState, useEffect } from 'react';
import { Button, Popover, Collapse, Empty, message, Select, Table } from 'antd';
import { getRequest } from '@/utils/request';
import VCCustomIcon from '@cffe/vc-custom-icon';
import DebounceSelect from '@/components/debounce-select';
import * as APIS from '../../service';
import { CaseItemVO, PreCaseItemProps, TreeNode } from '../../interfaces';
import { getCaseListByIds } from './common';
import { useProjectOptions } from '../../hooks';
import './index.less';

export type CaseTableValueProps = CaseItemVO & PreCaseItemProps;

export interface CaseTableFieldProps {
  title?: React.ReactNode;
  value?: CaseTableValueProps[];
  onChange?: (next: CaseTableValueProps[]) => any;
  defaultProjectId: React.Key;
}

export default function CaseTable(props: CaseTableFieldProps) {
  const [popVisible, setPopVisible] = useState(false);
  const [projectOptions] = useProjectOptions();
  const [projectId, setProjectId] = useState<any>();

  useEffect(() => {
    setProjectId(props.defaultProjectId);
  }, [popVisible]);

  const loadOptions = async (keyword: string) => {
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

  const handleSelect = async (_: any, item: any) => {
    // 选中后再调详情接口获取接口详情信息，并 push 到列表中
    const nextValue = props.value?.slice(0) || [];

    let newPreCaseIds = (item.data.preCases.length && item.data.preCases?.split(',').map((id: string) => +id)) || [];
    const alreadyHas = nextValue.map((item) => item.id);
    newPreCaseIds = newPreCaseIds.filter((id: number) => !alreadyHas.includes(id));
    const newCases = await getCaseListByIds([...newPreCaseIds, item.data.caseId]);
    nextValue.push(...newCases.map((item) => ({ ...item, ...item.data })));

    props.onChange?.(nextValue);
    setPopVisible(false);
  };

  const handleDelRecord = (index: number) => {
    const nextValue = props.value?.slice(0) || [];
    nextValue.splice(index, 1);
    props.onChange?.(nextValue);
  };

  return (
    <div className="case-table-field">
      <div className="field-caption">
        <h3>{props.title || '前置用例'}</h3>
        <s className="flex-air"></s>
        <Popover
          visible={popVisible}
          onVisibleChange={(n) => setPopVisible(n)}
          trigger={['click']}
          content={
            <div style={{ display: 'flex' }}>
              <Select style={{ width: '20%' }} options={projectOptions} onSelect={setProjectId} value={projectId} />
              <DebounceSelect
                fetchOnMount
                fetchOptions={loadOptions}
                onSelect={handleSelect}
                style={{ width: '80%' }}
                autoFocus
                suffixIcon={null}
                placeholder="输入关键字搜索"
              />
            </div>
          }
          placement="left"
          overlayInnerStyle={{ width: 620 }}
          overlayStyle={{ width: 620 }}
        >
          <Button>新增</Button>
        </Popover>
      </div>
      {!props.value?.length ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null}
      <Collapse>
        {props.value?.map((n, i) => (
          <Collapse.Panel
            key={i}
            header={n?.name ? `#${n.id} - ${n.name}` : '用例'}
            extra={<VCCustomIcon type="icondelete" onClick={() => handleDelRecord(i)} />}
          >
            <ul className="case-info-list">
              <li>所属项目: {n.projectName || '--'}</li>
              <li>所属模块: {n.moduleName || '--'}</li>
              <li>接口地址: {n.apiPath || '--'}</li>
            </ul>
            <h4>定义变量</h4>
            <Table dataSource={n.customVars || []} pagination={false} bordered>
              <Table.Column title="变量名" dataIndex="key" />
              <Table.Column title="类型" dataIndex="type" />
              <Table.Column title="值" dataIndex="value" />
              <Table.Column title="描述" dataIndex="desc" />
            </Table>
            <h4> 保存返回值</h4>
            <Table rowKey="name" dataSource={n.savedVars || []} pagination={false} bordered>
              <Table.Column title="变量名" dataIndex="name" />
              <Table.Column title="表达式" dataIndex="jsonpath" />
              <Table.Column title="描述" dataIndex="desc" />
            </Table>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
}

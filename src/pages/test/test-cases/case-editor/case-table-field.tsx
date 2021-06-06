// 用例选择器
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 15:09

import React, { useState } from 'react';
import { Button, Popover, Collapse, Empty, message } from 'antd';
import { getRequest } from '@/utils/request';
import VCCustomIcon from '@cffe/vc-custom-icon';
import * as APIS from '../service';
import DebounceSelect from '@/components/debounce-select';
import './index.less';

export interface CaseTableFieldProps {
  title?: React.ReactNode;
  value?: Record<string, any>[];
  onChange?: (next: Record<string, any>[]) => any;
}

export default function CaseTable(props: CaseTableFieldProps) {
  const [popVisible, setPopVisible] = useState(false);

  const loadOptions = async (keyword: string) => {
    if (!keyword) return [];

    const result = await getRequest(APIS.getPreCaseList, {
      data: {
        keyword: keyword?.trim() || '',
      },
    });

    return (result.data || []).map((n: any) => ({
      value: n.apiId,
      label: `${n.projectName}/${n.moduleName}/${n.apiName}/${n.caseName}`,
      data: n,
    }));
  };

  const handleSelect = async (_: any, item: any) => {
    // 选中后再调详情接口获取接口详情信息，并 push 到列表中
    console.log('>>> handleSelect', item.data);

    const nextValue = props.value?.slice(0) || [];
    if (nextValue.find((n) => n.apiId === item.data?.apiId)) {
      return message.warn('此用例已选择!');
    }

    nextValue.push(item.data);
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
        <Popover
          visible={popVisible}
          onVisibleChange={(n) => setPopVisible(n)}
          trigger={['click']}
          content={
            <DebounceSelect
              fetchOnMount
              fetchOptions={loadOptions}
              onSelect={handleSelect}
              style={{ width: '100%' }}
              autoFocus
              suffixIcon={null}
              placeholder="输入关键字搜索"
            />
          }
          placement="bottomLeft"
          overlayInnerStyle={{ width: 400 }}
          overlayStyle={{ width: 400 }}
        >
          <Button>新增</Button>
        </Popover>
      </div>
      {!props.value?.length ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : null}
      <Collapse>
        {props.value?.map((n, i) => (
          <Collapse.Panel
            key={i}
            header={n?.name || '用例'}
            extra={
              <VCCustomIcon
                type="icondelete"
                onClick={() => handleDelRecord(i)}
              />
            }
          >
            我是用例详情~~~
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
}

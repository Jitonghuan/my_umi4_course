// 前/后置函数编辑器
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 11:35

import React, { useState } from 'react';
import { Table, Button, Popover, message } from 'antd';
import { getRequest } from '@/utils/request';
import * as APIS from '../service';
import DebounceSelect from '@/components/debounce-select';
import './index.less';

export interface FuncTableFieldProps {
  title: React.ReactNode;
  value?: Record<string, any>[];
  onChange?: (next: Record<string, any>[]) => any;
}

export default function FuncTableField(props: FuncTableFieldProps) {
  const [popVisible, setPopVisible] = useState(false);
  // const [searchKey, setSearchKey] = useState<string>();

  // 加载数据
  const loadOptions = async (keyword: string) => {
    const result = await getRequest(APIS.funcList, {
      data: {
        keyword: keyword?.trim() || '',
        pageIndex: 1,
        pageSize: 50,
      },
    });

    return (result.data?.dataSource || []).map((n: any) => ({
      value: n.id,
      label: `${n.name}-${n.desc}`,
      data: n,
    }));
  };

  const handleSelect = (_: any, item: any) => {
    const nextValue = props.value?.slice(0) || [];

    //  去重校验
    if (nextValue.find((n) => n.id === item.data?.id)) {
      return message.warn('此函数已选择!');
    }

    nextValue.push(item.data);
    props.onChange?.(nextValue);
    setPopVisible(false);
    // setSearchKey(undefined);
  };

  const handleDelRecord = (index: number) => {
    const nextValue = props.value?.slice(0) || [];
    nextValue.splice(index, 1);
    props.onChange?.(nextValue);
  };

  return (
    <div className="func-table-field">
      <div className="field-caption">
        <h3>{props.title}</h3>
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
              placeholder="输入函数名搜索"
            />
          }
          placement="bottomLeft"
          overlayInnerStyle={{ width: 300 }}
          overlayStyle={{ width: 300 }}
        >
          <Button>新增</Button>
        </Popover>
      </div>
      <Table dataSource={props.value || []} bordered pagination={false}>
        <Table.Column dataIndex="name" title="函数" />
        <Table.Column dataIndex="desc" title="描述" />
        <Table.Column
          title="操作"
          render={(_, __, index) => (
            <a onClick={() => handleDelRecord(index)}>删除</a>
          )}
          width={80}
        />
      </Table>
    </div>
  );
}

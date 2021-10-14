// 前/后置函数编辑器
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 11:35

import React, { useState } from 'react';
import { Table, Button, Popover, message, Input, Tooltip, Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getRequest } from '@/utils/request';
import * as APIS from '../../service';
import DebounceSelect from '@/components/debounce-select';
import './index.less';

export interface FuncTableFieldProps {
  title: React.ReactNode;
  value?: Record<string, any>[];
  onChange?: (next: Record<string, any>[]) => any;
}

export default function FuncTableField(props: FuncTableFieldProps) {
  const [popVisible, setPopVisible] = useState(false);
  const [sqlPopVisible, setSqlPopVisible] = useState(false);
  // const [searchKey, setSearchKey] = useState<string>();

  // ---- func
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

    nextValue.push({ type: 0, ...item.data });
    props.onChange?.(nextValue);
    setPopVisible(false);
    // setSearchKey(undefined);
  };

  // ---- sql
  // 加载数据
  const loadSqlOptions = async (keyword: string) => {
    const result = await getRequest(APIS.getSqlList, {
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

  const handleSqlSelect = (_: any, item: any) => {
    const nextValue = props.value?.slice(0) || [];

    //  去重校验
    if (nextValue.find((n) => n.id === item.data?.id)) {
      return message.warn('此SQL已选择!');
    }

    nextValue.push({ type: 1, ...item.data });
    props.onChange?.(nextValue);
    setSqlPopVisible(false);
    // setSearchKey(undefined);
  };

  const handleDelRecord = (index: number) => {
    const nextValue = props.value?.slice(0) || [];
    nextValue.splice(index, 1);
    props.onChange?.(nextValue);
  };

  const handleArgsChange = (value: string, index: number) => {
    const nextValue = props.value?.slice(0) || [];
    nextValue[index] = {
      ...nextValue[index],
      argument: value,
    };
    props.onChange?.(nextValue);
  };

  const handleMoveUp = (index: number) => {
    const nextValue = props.value?.slice(0) || [];
    if (index > 0) {
      let m = nextValue[index];
      nextValue[index] = nextValue[index - 1];
      nextValue[index - 1] = m;
    }
    props.onChange?.(nextValue);
  };

  const handleMoveDown = (index: number) => {
    const nextValue = props.value?.slice(0) || [];
    if (index < nextValue.length - 1) {
      let m = nextValue[index];
      nextValue[index] = nextValue[index + 1];
      nextValue[index + 1] = m;
    }
    props.onChange?.(nextValue);
  };

  return (
    <div className="func-table-field">
      <div className="field-caption">
        <h3>
          {props.title}&nbsp;
          <Tooltip title="请在 测试管理-脚本管理 中添加 函数 或 SQL">
            <QuestionCircleOutlined style={{ color: '#1973CC' }} />
          </Tooltip>
        </h3>
        <s className="flex-air"></s>
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
          placement="left"
          overlayInnerStyle={{ width: 400 }}
          overlayStyle={{ width: 400 }}
        >
          <Button>新增函数</Button>
        </Popover>
        <Popover
          visible={sqlPopVisible}
          onVisibleChange={(n) => setSqlPopVisible(n)}
          trigger={['click']}
          content={
            <DebounceSelect
              fetchOnMount
              fetchOptions={loadSqlOptions}
              onSelect={handleSqlSelect}
              style={{ width: '100%' }}
              autoFocus
              suffixIcon={null}
              placeholder="输入SQL名搜索"
            />
          }
          placement="left"
          overlayInnerStyle={{ width: 400 }}
          overlayStyle={{ width: 400 }}
        >
          <Button>新增SQL</Button>
        </Popover>
      </div>
      <Table rowKey={(n) => `${n.type}-${n.name}`} dataSource={props.value || []} bordered pagination={false}>
        <Table.Column dataIndex="type" title="类型" render={(value) => (value === 1 ? 'SQL' : '函数')} width={60} />
        <Table.Column dataIndex="name" title="函数" />
        <Table.Column
          dataIndex="argument"
          title="入参"
          onCell={() => ({ className: 'input-wrapper-cell' })}
          width={262}
          render={(value, record, index) => (
            <Input
              className="cell-inner-input"
              placeholder="请输入参数"
              value={value}
              onChange={(e) => handleArgsChange(e.target.value, index)}
              style={{ width: 260 }}
            />
          )}
        />
        <Table.Column dataIndex="desc" title="描述" />
        <Table.Column
          title="操作"
          render={(_, __, index) => (
            <Space>
              <a onClick={() => handleDelRecord(index)}>删除</a>
              <a onClick={() => handleMoveUp(index)}>上移</a>
              <a onClick={() => handleMoveDown(index)}>下移</a>
            </Space>
          )}
          width={120}
        />
      </Table>
    </div>
  );
}

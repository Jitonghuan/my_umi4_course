// 全局变量
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/29 21:01

import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { Button, Collapse, Popconfirm, Empty, Popover, Form, Input, message } from 'antd';
import VCCustomIcon from '@cffe/vc-custom-icon';
import TableForm from '@/components/simple-table-form';
import { EnvVarConfItemVO, EnvVarEditProps } from '../interfaces';

interface GlobalVarEditTableProps {
  value: EnvVarEditProps[];
  onChange: (next: EnvVarEditProps[]) => any;
}

// 单个的可编辑表格
function GlobalVarEditTable(props: GlobalVarEditTableProps) {
  return (
    <TableForm
      value={props.value}
      onChange={props.onChange}
      columns={[
        { title: '变量名', dataIndex: 'key', required: true },
        { title: '变量值', dataIndex: 'value', required: true },
      ]}
    />
  );
}

// ---------------------------------------------------------------------

export interface GlobalVarProps {
  initData: EnvVarConfItemVO[];
  queryRef: React.MutableRefObject<() => EnvVarConfItemVO[]>;
}

export default function GlobalVar(props: GlobalVarProps) {
  const [groupList, setGroupList] = useState<EnvVarConfItemVO[]>([]);
  const [addGroupField] = Form.useForm<{ groupName: string }>();
  const [addPopVisible, setAddPopVisible] = useState(false);

  useEffect(() => {
    if (!props.initData?.length) {
      return setGroupList([]);
    }

    // 初始化数据
    const nextGroupList = (props.initData || []).slice(0);
    setGroupList(nextGroupList);
  }, [props.initData]);

  useLayoutEffect(() => {
    // 给外层一个方法，用于计算并获取全量的值
    props.queryRef.current = () => groupList;
  }, [groupList]);

  const handleAddGroupOk = useCallback(async () => {
    const { groupName } = await addGroupField.validateFields();
    const nextGroupList = groupList.slice(0);

    const sameOne = nextGroupList.find((n) => n.groupName === groupName);
    if (sameOne) {
      return message.warn('已有同名分组!');
    }

    nextGroupList.push({ groupName, variables: [] });
    setGroupList(nextGroupList);

    setAddPopVisible(false);
    addGroupField.resetFields();
  }, [groupList]);

  const confirmDelGroup = useCallback(
    (group: EnvVarConfItemVO, index: number, e?: React.MouseEvent) => {
      e && e.stopPropagation();

      const nextGroupList = groupList.slice(0);
      nextGroupList.splice(index, 1);
      setGroupList(nextGroupList);
    },
    [groupList],
  );

  const handleGroupChange = useCallback(
    (group: EnvVarConfItemVO, index: number, next: EnvVarEditProps[]) => {
      const nextGroupList = groupList.slice(0);
      nextGroupList[index].variables = next;
      setGroupList(nextGroupList);
    },
    [groupList],
  );

  return (
    <div className="global-var-wrapper">
      <div className="wrapper-header">
        <span />
        <Popover
          visible={addPopVisible}
          overlayStyle={{ width: 400 }}
          overlayInnerStyle={{ width: 400 }}
          onVisibleChange={(next) => setAddPopVisible(next)}
          placement="bottomLeft"
          autoAdjustOverflow
          content={
            <Form form={addGroupField} labelCol={{ flex: '100px' }}>
              <Form.Item label="分组名称" name="groupName" rules={[{ required: true, message: '请输入分组名称' }]}>
                <Input placeholder="请输入分组名称" autoFocus />
              </Form.Item>
              <Form.Item label=" " colon={false} wrapperCol={{ offset: 9 }}>
                <Button type="primary" onClick={handleAddGroupOk} style={{ marginRight: 12 }}>
                  确定
                </Button>
                <Button type="default" onClick={() => setAddPopVisible(false)}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          }
          trigger="click"
        >
          <Button type="default">新增分组</Button>
        </Popover>
      </div>
      {!groupList.length ? (
        <Empty description="请新增分组" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: '60px 0' }} />
      ) : null}
      <Collapse defaultActiveKey={[0]}>
        {groupList.map((group, index) => (
          <Collapse.Panel
            header={group.groupName}
            key={index}
            extra={
              <Popconfirm title="确定删除此分组吗？" onConfirm={(e) => confirmDelGroup(group, index, e)}>
                <VCCustomIcon type="icondelete" fontSize="16px" onClick={(e) => e.stopPropagation()} />
              </Popconfirm>
            }
          >
            <GlobalVarEditTable value={group.variables} onChange={(next) => handleGroupChange(group, index, next)} />
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
}

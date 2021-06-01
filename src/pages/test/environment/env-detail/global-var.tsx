// 全局变量
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/29 21:01

import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Collapse,
  Popconfirm,
  Empty,
  Popover,
  Form,
  Input,
  message,
} from 'antd';
import VCCustomIcon from '@cffe/vc-custom-icon';
import { EnvVarConfItemVO, EnvVarEditProps } from '../interfaces';

// 单个的可编辑表格
function GlobalVarEditTable(props: {
  value: EnvVarEditProps[];
  onChange: (next: EnvVarEditProps[]) => any;
}) {
  const { value, onChange } = props;

  const columns: ProColumns<EnvVarEditProps>[] = [
    {
      title: '变量名',
      dataIndex: 'name',
      formItemProps: { rules: [{ required: true, message: '请输入变量名' }] },
    },
    {
      title: '变量值',
      dataIndex: 'value',
      formItemProps: { rules: [{ required: true, message: '请输入变量值' }] },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 160,
      render: (text, record, index, action) => [
        <a key="editable" onClick={() => action?.startEditable(index)}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => onChange(value.filter((_, i) => i !== index))}
        >
          移除
        </a>,
      ],
    },
  ];

  return (
    <EditableProTable
      columns={columns}
      value={value}
      onChange={onChange}
      bordered
      recordCreatorProps={{
        creatorButtonText: '新增',
        record: { name: '', value: '' },
      }}
    />
  );
}

// ---------------------------------------------------------------------

export interface GlobalVarProps {
  initData: EnvVarConfItemVO[];
  queryRef: React.MutableRefObject<() => EnvVarConfItemVO[]>;
}

interface GroupItemProps {
  groupName: string;
  dataSource: EnvVarEditProps[];
}

export default function GlobalVar(props: GlobalVarProps) {
  const [groupList, setGroupList] = useState<GroupItemProps[]>([]);
  const [addGroupField] = Form.useForm<{ groupName: string }>();
  const [addPopVisible, setAddPopVisible] = useState(false);

  useEffect(() => {
    if (!props.initData?.length) {
      return setGroupList([]);
    }

    // 初始化数据
    const nextGroupList: GroupItemProps[] = [];
    props.initData.forEach((group) => {
      const keys = Reflect.ownKeys(group);
      if (!keys.length) return;

      const groupName = keys[0] as string;
      const dataSource: EnvVarEditProps[] = [];
      // 这个数据格式很有问题，每个 Record 里面只有一组键值对
      // NOTE 如果后面数据格式优化了，这里的逻辑要改
      group[groupName].forEach((n) => {
        const nameList = Object.keys(n);
        if (!nameList.length) return;

        dataSource.push({
          name: nameList[0],
          value: n[nameList[0]],
        });
      });

      nextGroupList.push({
        groupName,
        dataSource,
      });
    });
    setGroupList(nextGroupList);
  }, [props.initData]);

  useLayoutEffect(() => {
    // 给外层一个方法，用于计算并获取全量的值
    props.queryRef.current = () => {
      return groupList.reduce((prev, curr) => {
        // 这个数据格式很有问题，每个 Record 里面只有一组键值对
        return [
          ...prev,
          {
            [curr.groupName]: curr.dataSource.map((item) => ({
              [item.name]: item.value,
            })),
          },
        ];
      }, [] as EnvVarConfItemVO[]);
    };
  }, [groupList]);

  const handleAddGroupOk = useCallback(async () => {
    const { groupName } = await addGroupField.validateFields();
    const nextGroupList = groupList.slice(0);

    const sameOne = nextGroupList.find((n) => n.groupName === groupName);
    if (sameOne) {
      return message.warn('已有同名分组!');
    }

    nextGroupList.push({ groupName, dataSource: [] });
    setGroupList(nextGroupList);

    setAddPopVisible(false);
    addGroupField.resetFields();
  }, [groupList]);

  const confirmDelGroup = useCallback(
    (group: GroupItemProps, index: number, e?: React.MouseEvent) => {
      e && e.stopPropagation();

      const nextGroupList = groupList.slice(0);
      nextGroupList.splice(index, 1);
      setGroupList(nextGroupList);
    },
    [groupList],
  );

  const handleGroupChange = useCallback(
    (group: GroupItemProps, index: number, next: EnvVarEditProps[]) => {
      const nextGroupList = groupList.slice(0);
      nextGroupList[index].dataSource = next;
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
              <Form.Item
                label="分组名称"
                name="groupName"
                rules={[{ required: true, message: '请输入分组名称' }]}
              >
                <Input placeholder="请输入分组名称" autoFocus />
              </Form.Item>
              <Form.Item label=" " colon={false} wrapperCol={{ offset: 9 }}>
                <Button
                  type="primary"
                  onClick={handleAddGroupOk}
                  style={{ marginRight: 12 }}
                >
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
        <Empty
          description="请新增分组"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '60px 0' }}
        />
      ) : null}
      <Collapse defaultActiveKey={[0]}>
        {groupList.map((group, index) => (
          <Collapse.Panel
            header={group.groupName}
            key={index}
            extra={
              <Popconfirm
                title="确定删除此分组吗？"
                onConfirm={(e) => confirmDelGroup(group, index, e)}
              >
                <VCCustomIcon
                  type="icondelete"
                  fontSize="16px"
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            }
          >
            <GlobalVarEditTable
              value={group.dataSource}
              onChange={(next) => handleGroupChange(group, index, next)}
            />
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
}

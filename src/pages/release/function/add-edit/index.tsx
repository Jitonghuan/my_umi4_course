import React, { useState, useEffect, useMemo } from 'react';
import {
  Space,
  Form,
  Input,
  Popconfirm,
  Typography,
  Button,
  Table,
  Card,
  Select,
  DatePicker,
  Modal,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Moment } from 'moment';
import { history } from 'umi';
import MatrixPageContent from '@/components/matrix-page-content';
import { FormProps } from '@/components/table-search/typing';
import { renderForm } from '@/components/table-search/form';
import { JiraColumns } from '../constant';
import EditableCell from './editTableCell';
import { Item } from '../../typing';
import useTableAction from './useTableAction';
import '../index.less';

interface OptionProps {
  value: string;
  key: string;
}

interface JiraItem {
  key: React.Key;
  id?: string;
  function?: string;
  planTime?: Moment;
  status?: string;
  creator?: string;
  accepter?: string;
}

interface EditTableProps {
  initData: Item[];
  type: 'add' | 'edit';
  title: string;
  ownOption: OptionProps[];
  lineOption: OptionProps[];
  modelOption: OptionProps[];
}

const EditTable: React.FC<EditTableProps> = ({
  initData,
  type,
  ownOption,
  lineOption,
  modelOption,
  title,
}) => {
  const [JiraData, setJiraData] = useState<JiraItem[]>([]);
  const [orgOption, setOrgOption] = useState<OptionProps[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const {
    form,
    data,
    editingKey,
    selectedRowKeys,
    edit,
    isEditing,
    addTableRow,
    cancel,
    save,
    onDelete,
    onSelectChange,
  } = useTableAction({
    initData,
  });

  const columns = [
    {
      title: '发布功能',
      dataIndex: 'function',
      key: 'function',
      editable: true,
      required: true,
      item: <Input placeholder="必选" />,
    },
    {
      title: '发布机构',
      dataIndex: 'org',
      key: 'org',
      editable: true,
      required: true,
      item: (
        <Select
          placeholder="必选，可多选"
          allowClear
          mode="multiple"
          style={{ width: 120 }}
        >
          {orgOption?.map((item) => (
            <Select.Option key={item.key} value={item.key}>
              {item.value}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: '涉及业务范围',
      dataIndex: 'range',
      key: 'range',
      editable: true,
      required: false,
      item: <Input placeholder="涉及业务范围" />,
    },
    {
      title: '解决的实际需求',
      dataIndex: 'needs',
      key: 'needs',
      editable: true,
      required: false,
      item: <Input placeholder="解决的实际需求" />,
    },
    {
      title: '预计发布时间',
      dataIndex: 'planTime',
      key: 'planTime',
      editable: true,
      required: false,
      item: <DatePicker placeholder="请选择日期" showTime />,
    },
    {
      title: '需求ID',
      dataIndex: 'needsID',
      key: 'needsID',
      editable: true,
      required: false,
      item: <Input placeholder="解决的实际需求" />,
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              保存
            </a>
            <Popconfirm title="确认取消?" onConfirm={() => cancel(record.key)}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              编辑
            </Typography.Link>
            {type === 'add' && (
              <Popconfirm
                title="确认删除?"
                onConfirm={() => onDelete(record.key)}
              >
                <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        required: col.required,
        item: col.item,
      }),
    };
  });

  const onSubmit = () => {
    console.log(data, 'hhh');
  };

  useEffect(() => {
    setOrgOption([
      {
        key: '1',
        value: '1',
      },
      {
        key: '2',
        value: '2',
      },
    ]);
    setJiraData([
      {
        key: '0',
        id: '1',
      },
      {
        key: '1',
        id: '2',
      },
    ]);
  }, []);

  const formLists: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '所属',
      dataIndex: 'own',
      width: '144px',
      placeholder: '请选择',
      required: true,
      option: ownOption,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '1',
      type: 'select',
      label: '业务线',
      dataIndex: 'line',
      width: '144px',
      placeholder: '请选择',
      required: true,
      option: lineOption,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '1',
      type: 'select',
      label: '业务模块',
      dataIndex: 'model',
      width: '144px',
      placeholder: '请选择',
      required: true,
      option: modelOption,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
  ];

  const formOptions: FormProps[] = useMemo(() => {
    return formLists;
  }, [ownOption, lineOption, modelOption]);

  return (
    <MatrixPageContent className="page-content">
      <div className="page-top">
        <Card bordered={false} title={title}>
          <Form form={form} component={false}>
            <div className="page-top-form">
              <Space size={16}>{renderForm(formOptions)}</Space>
              <Button type="primary" onClick={() => setModalVisible(true)}>
                关联Jira需求单
              </Button>
            </div>
            <Table
              columns={mergedColumns}
              dataSource={data}
              pagination={false}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              scroll={{ y: 400 }}
            />
            {type === 'add' && (
              <Button
                block
                icon={<PlusOutlined />}
                style={{ marginTop: 16, border: '1px dashed #cacfdb' }}
                onClick={addTableRow}
              >
                新增发布功能
              </Button>
            )}
          </Form>
        </Card>
      </div>
      <div className="page-bottom">
        <Space>
          <Button type="primary" onClick={onSubmit}>
            提交
          </Button>
          <Button onClick={() => history.goBack()}>取消</Button>
        </Space>
      </div>
      <Modal
        title="关联Jira需求单"
        visible={modalVisible}
        width="100%"
        onCancel={() => setModalVisible(false)}
      >
        <Table
          columns={JiraColumns}
          dataSource={JiraData}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
        />
      </Modal>
    </MatrixPageContent>
  );
};

export default EditTable;

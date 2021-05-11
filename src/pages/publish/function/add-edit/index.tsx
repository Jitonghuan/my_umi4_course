import React, { useState, useEffect, useRef } from 'react';
import {
  Space,
  Form,
  Input,
  Popconfirm,
  Typography,
  Button,
  Table,
  Select,
  DatePicker,
  Modal,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { history } from 'umi';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
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

export interface DefaultValueObjProps {
  own: string;
  line: string;
  model: string;
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
  type: 'add' | 'edit' | 'check';
  title: string;
  ownOption: OptionProps[];
  lineOption: OptionProps[];
  modelOption: OptionProps[];
  formSelectChange: (
    e: React.FormEvent<HTMLInputElement>,
    type: string,
  ) => void;
  defaultValueObj?: DefaultValueObjProps;
}

const EditTable: React.FC<EditTableProps> = ({
  initData,
  type,
  ownOption,
  lineOption,
  modelOption,
  title,
  formSelectChange,
  defaultValueObj = {},
}) => {
  const [JiraData, setJiraData] = useState<JiraItem[]>([]);
  const [orgOption, setOrgOption] = useState<OptionProps[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  let num = useRef(0);

  const isCheck = type === 'check';

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
      render: (text: string[]) => (
        <>{Array.isArray(text) ? text.join(',') : ''}</>
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
      render: (text: Moment) => (
        <>{text ? moment(text).format('YYYY-MM-DD HH-mm-ss') : ''}</>
      ),
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
      render: (_: string, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key as string)}
              style={{ marginRight: 8 }}
            >
              保存
            </a>
            <Popconfirm
              title="确认取消?"
              onConfirm={() => cancel(record.key as string)}
            >
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record as Partial<Item> & { key: React.Key })}
            >
              编辑
            </Typography.Link>
            {type === 'add' && (
              <Popconfirm
                title="确认删除?"
                onConfirm={() => onDelete(record.key as string)}
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

  if (isCheck) {
    mergedColumns.splice(columns.length - 1, 1);
  }

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

  useEffect(() => {
    if (!Object.keys(defaultValueObj).length || num.current !== 0) return;

    form.setFieldsValue({
      own: defaultValueObj?.own,
      line: defaultValueObj?.line,
      model: defaultValueObj?.model,
    });
    num.current = num.current + 1;
  }, [defaultValueObj]);

  // useEffect(()=>{
  //   return () => {
  //     num.current = 0
  //   };
  // })

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
      disable: isCheck,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
        formSelectChange(e, 'own');
      },
    },
    {
      key: '2',
      type: 'select',
      label: '业务线',
      dataIndex: 'line',
      width: '144px',
      placeholder: '请选择',
      required: true,
      option: lineOption,
      disable: isCheck,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
        formSelectChange(e, 'line');
      },
    },
    {
      key: '3',
      type: 'select',
      label: '业务模块',
      dataIndex: 'model',
      width: '144px',
      placeholder: '请选择',
      required: true,
      option: modelOption,
      disable: isCheck,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
        formSelectChange(e, 'model');
      },
    },
  ];

  return (
    <MatrixPageContent className="page-content">
      <div className="page-top">
        <ContentCard title={title}>
          <Form form={form} component={false} initialValues={defaultValueObj}>
            <div className="page-top-form">
              <Space size={16}>{renderForm(formLists)}</Space>
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
              scroll={{ y: 200 }}
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
          {!isCheck && (
            <div className="page-bottom">
              <Space>
                <Button type="primary" onClick={onSubmit}>
                  提交
                </Button>
                <Button onClick={() => history.goBack()}>取消</Button>
              </Space>
            </div>
          )}
        </ContentCard>
      </div>

      <Modal
        title="关联Jira需求单"
        visible={modalVisible}
        width="100%"
        onCancel={() => setModalVisible(false)}
        footer={!isCheck}
      >
        <Table
          columns={JiraColumns}
          dataSource={JiraData}
          rowSelection={
            !isCheck
              ? {
                  selectedRowKeys,
                  onChange: onSelectChange,
                }
              : undefined
          }
        />
      </Modal>
    </MatrixPageContent>
  );
};

export default EditTable;

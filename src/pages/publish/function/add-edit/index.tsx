import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
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
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { history } from 'umi';

import FEContext from '@/layouts/basic-layout/FeContext';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import { FormProps } from '@/components/table-search/typing';
import { renderForm } from '@/components/table-search/form';
import { JiraColumns } from '../constant';
import EditableCell from './editTableCell';
import { IFuncItem } from '../../typing';
import useTableAction from './useTableAction';
import { usePaginated } from '@cffe/vc-hulk-table';
import '../index.less';

import { OptionProps } from '@/components/table-search/typing';
import {
  queryEnvsReq,
  addFuncMultiReq,
  updateFuncReq,
  queryAppGroupReq,
  queryJiraUrl,
} from '../../service';

export interface DefaultValueObjProps {
  appCategoryCode: string;
  appGroupCode: string;
  id: string;
}

interface JiraItem {
  key: React.Key;
  id?: string;
  funcName?: string;
  planTime?: Moment;
  status?: string;
  creator?: string;
  accepter?: string;
  issueId?: string;
  summary?: string;
  preDeployTime?: string;
}

interface EditTableProps {
  initData: IFuncItem[];
  type: 'add' | 'edit' | 'check';
  title: string;
  formSelectChange?: (value: any, type: string) => void;
  defaultValueObj?: DefaultValueObjProps;
}

const EditTable: React.FC<EditTableProps> = ({
  initData,
  type,
  title,
  defaultValueObj = {},
}) => {
  // 应用分类列表
  const { categoryData } = useContext(FEContext);
  const categorys = useMemo(() => {
    return (
      categoryData?.map((el) => {
        return {
          ...el,
          key: el.value,
          value: el.label,
        };
      }) || []
    );
  }, [categoryData]);
  const [groupData, setGroupData] = useState<OptionProps[]>([]);

  const [jiraData, setJiraData] = useState<JiraItem[]>([]);
  const [envsOptions, setEnvsOptions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  let num = useRef(0);

  const isCheck = type === 'check';
  const isNotAdd = type !== 'add';

  // 获取环境列表
  const queryEnvs = (categoryCode: string) => {
    setEnvsOptions([]);
    queryEnvsReq({
      categoryCode,
    }).then((resp) => {
      setEnvsOptions(resp.list);
    });
  };

  // 获取应用组列表
  const queryGroups = (code: string) => {
    setGroupData([]);
    queryAppGroupReq({
      categoryCode: code,
    }).then((resp) => {
      setGroupData(
        resp.list?.map((el: any) => {
          return {
            ...el,
            key: el.value,
            value: el.label,
          };
        }),
      );
    });
  };

  const { run: queryNodeList, reset, tableProps } = usePaginated({
    requestUrl: queryJiraUrl,
    requestMethod: 'GET',
    showRequestError: true,
    didMounted: false,
    pagination: false,
    formatResult: (resp) => {
      setJiraData(resp.data || []);
      return {
        dataSource: resp.data || [],
        pageInfo: {
          pageIndex: 1,
          pageSize: 1000,
        },
      };
    },
  });
  // const queryJiraData = (groupCode: string) => {};

  const {
    form,
    data,
    setData,
    editingKey,
    setEditingKey,
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
      dataIndex: 'funcName',
      key: 'funcName',
      editable: true,
      required: true,
      item: <Input placeholder="必填" />,
    },
    {
      title: '发布环境',
      dataIndex: 'envs',
      key: 'envs',
      editable: true,
      required: true,
      item: (
        <Select
          placeholder="必选，可多选"
          allowClear
          mode="multiple"
          style={{ width: 120 }}
        >
          {envsOptions?.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      ),
      render: (text: string[]) => {
        if (!text) return '';
        const labelList = text.map(
          (item) => envsOptions.find((v) => v.value === item)?.label,
        );
        return <>{Array.isArray(labelList) ? labelList.join(',') : ''}</>;
      },
    },
    {
      title: '涉及业务范围',
      dataIndex: 'coverageRange',
      key: 'coverageRange',
      editable: true,
      required: false,
      item: <Input placeholder="涉及业务范围" />,
    },
    {
      title: '解决的实际需求',
      dataIndex: 'resolveNeeds',
      key: 'resolveNeeds',
      editable: true,
      required: false,
      item: <Input placeholder="解决的实际需求" />,
    },
    {
      title: '预计发布时间',
      dataIndex: 'preDeployTime',
      key: 'preDeployTime',
      editable: true,
      required: false,
      item: <DatePicker placeholder="请选择日期" showTime />,
      render: (text: Moment) => (
        <>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</>
      ),
    },
    {
      title: '需求ID',
      dataIndex: 'demandId',
      key: 'demandId',
      editable: true,
      required: false,
      item: <Input placeholder="解决的实际需求" />,
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (_: string, record: IFuncItem) => {
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
              disabled={!!editingKey.length}
              onClick={() =>
                edit(record as Partial<IFuncItem> & { key: React.Key })
              }
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
      onCell: (record: IFuncItem) => ({
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
    if (editingKey.length) {
      message.warning('先保存，再提交');
      return;
    }
    const params: IFuncItem[] = data.map((el) => {
      const { envs = [], preDeployTime, key, ...rest } = el;
      const deployTime = preDeployTime as Moment;
      const _envs = envs as string[];
      return {
        ...rest,
        preDeployTime: deployTime
          ? deployTime?.format('YYYY-MM-DD HH:mm:ss')
          : '',
        envs: _envs.join(','),
      };
    });
    if (type === 'add') {
      addFuncMultiReq(params).then((resp) => {
        if (resp.success) {
          history.goBack();
        }
      });
    } else if (type === 'edit') {
      updateFuncReq({
        ...params[0],
        id: defaultValueObj.id,
      }).then((resp) => {
        if (resp.success) {
          history.goBack();
        }
      });
    }
  };

  useEffect(() => {
    if (!Object.keys(defaultValueObj).length || num.current !== 0) return;

    form.setFieldsValue({
      appCategoryCode: defaultValueObj?.appCategoryCode,
      appGroupCode: defaultValueObj?.appGroupCode,
    });
    num.current = num.current + 1;
  }, [defaultValueObj]);

  //编辑
  useEffect(() => {
    if (type === 'edit' || type === 'check') {
      queryEnvs(form.getFieldValue('appCategoryCode'));
      queryGroups(form.getFieldValue('appCategoryCode'));
    }
  }, [type, form.getFieldValue('appCategoryCode')]);

  // useEffect(()=>{
  //   return () => {
  //     num.current = 0
  //   };
  // })

  const formLists: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '应用分类',
      dataIndex: 'appCategoryCode',
      width: '144px',
      placeholder: '请选择',
      required: true,
      option: categorys,
      disable: isNotAdd,
      onChange: (value: string) => {
        form.setFieldsValue({
          appGroupCode: undefined,
        });
        queryGroups(value);
        queryEnvs(value);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '应用组',
      dataIndex: 'appGroupCode',
      width: '144px',
      placeholder: '请选择',
      required: true,
      option: groupData,
      disable: isNotAdd,
      onChange: (value: string) => {
        queryNodeList({
          appCategoryCode: form.getFieldValue('appCategoryCode'),
          appGroupCode: value,
        });
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
              {type === 'add' && (
                <Button type="primary" onClick={() => setModalVisible(true)}>
                  关联Jira需求单
                </Button>
              )}
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
        footer={
          <Space>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                if (!selectedRowKeys.length) {
                  message.warn('请至少选择一条需求单');
                  return;
                }
                const newData = [...data];
                const newEditingKey = [...editingKey];
                const selectRows = jiraData.filter((jira) =>
                  selectedRowKeys.includes(jira?.key!),
                );
                const start = newData.length
                  ? Number(newData[newData.length - 1].key) + 1
                  : 1;
                selectRows.map((jira, index) => {
                  let obj = {
                    key: `${start + index}`,
                    [`funcName-${start + index}`]: jira.summary,
                    [`preDeployTime-${start + index}`]: jira.preDeployTime
                      ? moment(jira.preDeployTime)
                      : '',
                    [`demandId-${start + index}`]: jira.key,
                    [`envs-${start + index}`]: [],
                  };
                  // [`coverageRange-${index + 1}`]: data.coverageRange,
                  // [`resolveNeeds-${index + 1}`]: data.resolveNeeds,
                  newData.push(obj);
                  newEditingKey.push(`${start + index}`);
                });
                setEditingKey(newEditingKey);
                setData(newData);
                console.log(data, 'data');
                setTimeout(() => {
                  for (
                    let i = start - 1;
                    i < start - 1 + selectRows.length;
                    i++
                  ) {
                    // edit(newData[i] as Partial<IFuncItem> & { key: React.Key; })
                    form.setFieldsValue({ ...newData[i] });
                  }
                }, 100);
                setModalVisible(false);
              }}
            >
              确认
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="key"
          columns={JiraColumns}
          // dataSource={jiraData}
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
          }}
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

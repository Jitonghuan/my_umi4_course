import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { Space, Form, Input, Popconfirm, Typography, Button, Table, Select, DatePicker, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { datetimeCellRender } from '@/utils';
import { getRequest } from '@/utils/request';
import { history } from 'umi';
import { FeContext } from '@/common/hooks';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { FormProps } from '@/components/table-search/typing';
import { renderForm } from '@/components/table-search/form';
import { JiraColumns } from '../constant';
import EditableCell from './editTableCell';
import { IFuncItem } from '../../typing';
import useTableAction from './useTableAction';

import '../index.less';

import { OptionProps } from '@/components/table-search/typing';
import {
  queryEnvsReq,
  addFuncMultiReq,
  updateFuncReq,
  queryAppGroupReq,
  queryJiraUrl,
  eipDemandUrl,
  regulusUrl,
  getRegulusProjects,
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

const EditTable: React.FC<EditTableProps> = ({ initData, type, title, defaultValueObj = {} }) => {
  // 应用分类列表
  const { categoryData,matrixConfigData } = useContext(FeContext);
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
  const [projectForm] = Form.useForm();
  const [groupData, setGroupData] = useState<OptionProps[]>([]);
  const [envsOptions, setEnvsOptions] = useState<any[]>([]);
  const [tableDataSource, setTableDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [queryPortalOptions, setQueryPortalOptions] = useState<any>([]);
  const [currentAppCategoryCode, setCurrentAppCategoryCode] = useState<string>('');
  const [currentAppGroupCode, setCurrentAppGroupCode] = useState<string>('');
  const [optType, setOptType] = useState<string>('');

  let num = useRef(0);

  const isCheck = type === 'check';
  const isNotAdd = type !== 'add';

  // 获取环境列表
  const queryEnvs = (categoryCode: string) => {
    setEnvsOptions([]);
    queryEnvsReq({
      // categoryCode,
      envTypeCode: 'prod',
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

  const queryDemandList = (paramObj: { appCategoryCode: string; appGroupCode: string; title?: string }) => {
    setLoading(true);
    getRequest(eipDemandUrl, { data: { ...paramObj, pageSize: -1 } })
      .then((res) => {
        if (res.success) {
          setTableDataSource(res.data || []);
        } else {
          setTableDataSource([]);
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const queryNodeList = (paramObj: { appCategoryCode: string; appGroupCode: string }) => {
    setLoading(true);
    getRequest(queryJiraUrl, { data: { ...paramObj, pageSize: -1 } })
      .then((res) => {
        if (res.success) {
          setTableDataSource(res.data || []);
        } else {
          setTableDataSource([]);
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const {
    form,
    data,
    setData,
    editingKey,
    setEditingKey,
    selectedRowKeys,
    setSelectedRowKeys,
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
      width: 220,
      item: (
        <Select placeholder="必选，可多选" allowClear mode="multiple" style={{ width: 200 }}>
          {envsOptions?.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      ),
      render: (text: string[]) => {
        if (!text) return '';
        const labelList = text.map((item) => envsOptions.find((v) => v.value === item)?.label);
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
      width: 220,
      item: <DatePicker placeholder="请选择日期" showTime />,
      render: datetimeCellRender,
    },
    {
      title: '需求ID',
      dataIndex: 'demandId',
      key: 'demandId',
      editable: true,
      required: false,
      width: 180,
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
            <a onClick={() => save(record.key as string)} style={{ marginRight: 8 }}>
              保存
            </a>
            <a onClick={() => cancel(record.key as string)}>取消</a>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={!!editingKey.length}
              onClick={() => edit(record as Partial<IFuncItem> & { key: React.Key })}
            >
              编辑
            </Typography.Link>
            {type === 'add' && (
              <Popconfirm title="确认删除?" onConfirm={() => onDelete(record.key as string)}>
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
        preDeployTime: deployTime ? deployTime?.format('YYYY-MM-DD HH:mm:ss') : '',
        envs: _envs.join(','),
      };
    });
    if (type === 'add') {
      addFuncMultiReq(params).then((resp) => {
        if (resp?.success) {
          history.back();
        }
      });
    } else if (type === 'edit') {
      updateFuncReq({
        ...params[0],
        id: defaultValueObj.id,
      }).then((resp) => {
        if (resp.success) {
          history.back();
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
  const onChangeProtal = (value: any) => {
    queryRegulusOnlineBugs(value);
  };
  const queryRegulusOnlineBugs = async (param: any, searchTextParams?: string) => {
    setLoading(true);
    try {
      await getRequest(regulusUrl, {
        data: { projectId: param, keyword: searchTextParams, pageSize: -1 },
      })
        .then((result) => {
          if (result.success) {
            let dataSource = result.data.dataSource;

            setTableDataSource(dataSource);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  const queryRegulus = () => {
    setProjectLoading(true);
    try {
      getRequest(getRegulusProjects)
        .then((result) => {
          if (result.success) {
            let dataSource = result.data.projects;
            let dataArry: any = [];
            dataSource?.map((item: any) => {
              dataArry.push({ label: item?.name, value: item?.id });
            });
            setQueryPortalOptions(dataArry);
          }
        })
        .finally(() => {
          setProjectLoading(false);
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  //编辑
  useEffect(() => {
    if (type === 'edit' || type === 'check') {
      queryEnvs(form.getFieldValue('appCategoryCode'));
      queryGroups(form.getFieldValue('appCategoryCode'));
    }
  }, [type, form.getFieldValue('appCategoryCode')]);

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
        setCurrentAppCategoryCode(value);
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
        setCurrentAppGroupCode(value);
      },
    },
  ];
  const onSearch = (value: string) => {
    const params = projectForm.getFieldsValue();
    if (optType === 'reglus') {
      queryRegulusOnlineBugs(params.projectSelect, value);
    } else {
      queryDemandList({
        appCategoryCode: form.getFieldValue('appCategoryCode'),
        appGroupCode: currentAppGroupCode,
        title: value,
      });
    }
  };

  return (
    <PageContainer className="page-content">
      <div className="page-top">
        <ContentCard title={title}>
          <Form form={form} component={false} initialValues={defaultValueObj}>
            <div className="page-top-form">
              <Space size={16}>{renderForm(formLists)}</Space>
              <div>
                {type === 'add'&& matrixConfigData?.curEnvType!=="jyglj" && (
                  <Button
                    type="primary"
                    onClick={() => {
                      // reset();
                      setTableDataSource([]);
                      setModalVisible(true);
                      setOptType('jira');
                      setSelectedRowKeys([]);
                      if (currentAppCategoryCode && currentAppGroupCode) {
                        queryNodeList({
                          appCategoryCode: form.getFieldValue('appCategoryCode'),
                          appGroupCode: currentAppGroupCode,
                        });
                      } else {
                        message.info('请先选择应用分类和应用组！');
                      }
                    }}
                  >
                    关联Jira需求单
                  </Button>
                )}
                {type === 'add'&& matrixConfigData?.curEnvType!=="jyglj" && (
                  <Button
                    type="primary"
                    style={{ marginLeft: 6 }}
                    onClick={() => {
                      setTableDataSource([]);
                      setModalVisible(true);
                      setOptType('demand');
                      setSelectedRowKeys([]);
                      projectForm.resetFields();
                      if (currentAppCategoryCode && currentAppGroupCode) {
                        queryDemandList({
                          appCategoryCode: form.getFieldValue('appCategoryCode'),
                          appGroupCode: currentAppGroupCode,
                        });
                      } else {
                        message.info('请先选择应用分类和应用组！');
                      }
                    }}
                  >
                    关联需求管理平台
                  </Button>
                )}
                {type === 'add'&& matrixConfigData?.curEnvType!=="jyglj" && (
                  <Button
                    type="primary"
                    style={{ marginLeft: 6 }}
                    onClick={() => {
                      setTableDataSource([]);
                      setModalVisible(true);
                      setOptType('reglus');
                      projectForm.resetFields();
                      queryRegulus();
                    }}
                  >
                    关联Regulus
                  </Button>
                )}
              </div>
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
              scroll={{ y: window.innerHeight - 360 }}
            />
            {type === 'add' && (
              <Button
                block
                icon={<PlusOutlined />}
                style={{ marginTop: 16, border: '1px dashed #cacfdb' }}
                onClick={addTableRow}
              >
                + 新增发布功能
              </Button>
            )}
          </Form>

          {!isCheck && (
            <div className="page-bottom">
              <Space>
                <Button type="primary" onClick={onSubmit}>
                  提交
                </Button>
                <Button onClick={() => history.back()}>取消</Button>
              </Space>
            </div>
          )}
        </ContentCard>
      </div>

      <Modal
        title={optType === 'jira' ? '关联Jira需求单' : optType === 'demand' ? '关联需求管理平台' : '关联Regulus'}
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
                const selectRows = tableDataSource.filter((jira) => selectedRowKeys.includes(jira?.key!));
                const start = newData.length ? Number(newData[newData.length - 1].key) + 1 : 1;
                selectRows.map((jira, index) => {
                  let obj = {
                    key: `${start + index}`,
                    [`funcName-${start + index}`]: jira.summary,
                    [`preDeployTime-${start + index}`]: jira.preDeployTime ? moment(jira.preDeployTime) : '',
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
                setTimeout(() => {
                  for (let i = start - 1; i < start - 1 + selectRows.length; i++) {
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
        {optType !== 'jira' && (
          <div style={{ marginBottom: 10 }}>
            <Form form={projectForm} layout="inline">
              {optType === 'reglus' && (
                <Form.Item name="projectSelect" label="项目列表">
                  <Select
                    options={queryPortalOptions}
                    onChange={onChangeProtal}
                    showSearch
                    allowClear
                    loading={projectLoading}
                    style={{ width: 220 }}
                  ></Select>
                </Form.Item>
              )}
              <Form.Item name="projectSearch">
                <Input.Search
                  placeholder="输入发布功能进行搜索"
                  style={{ width: 400 }}
                  onSearch={onSearch}
                ></Input.Search>
              </Form.Item>
            </Form>
          </div>
        )}

        <Table
          rowKey="key"
          columns={JiraColumns}
          dataSource={tableDataSource}
          loading={loading}
          // {...tableProps}

          // pagination={{
          //   ...tableProps.pagination,
          // }}
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
    </PageContainer>
  );
};

export default EditTable;

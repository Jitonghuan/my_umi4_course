import React, { useRef, useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Form, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  useQueryDeliveryParamList,
  useSaveParam,
  useQueryDeliveryGloableParamList,
  useDeleteDeliveryParam,
  useEditVersionParam,
} from '../hooks';

type DataSourceType = {
  id: any;
  title?: string;
  labels?: {
    key: string;
    label: string;
  }[];
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};

export interface VersionDetailProps {
  currentTab: string;
  versionId: any;
  isEditable: boolean;
  initDataSource?: any;
}

export default (props: VersionDetailProps) => {
  const { currentTab, versionId, isEditable, initDataSource } = props;
  const [saveLoading, saveParam] = useSaveParam();
  const [editLoading, editVersionParam] = useEditVersionParam();
  const actionRef = useRef<ActionType>();
  const [gloableTableLoading, gloableTableDataSource, setGloableDataSource, queryDeliveryGloableParamList] =
    useQueryDeliveryGloableParamList();
  const [tableLoading, tableDataSource, setDataSource, queryDeliveryParamList] = useQueryDeliveryParamList();
  const [delLoading, deleteDeliveryParam] = useDeleteDeliveryParam();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [type, setType] = useState<string>('');
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  useEffect(() => {
    //查询建站配置参数
    queryDeliveryGloableParamList(versionId, 'global');
    queryDeliveryParamList(versionId);
  }, [currentTab, versionId]);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '参数名称',
      key: 'paramName',
      dataIndex: 'paramName',
      editable: (text, record, index) => {
        if (type === 'edit' && text) {
          return false;
        } else if (type === 'add' && !text) {
          return true;
        } else if (type === 'add' && text) {
          return false;
        } else {
          return true;
        }
      },

      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
    },
    {
      title: '参数值',
      key: 'paramValue',
      dataIndex: 'paramValue',
      // valueType: 'select',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
    },
    {
      title: '参数说明',
      dataIndex: 'paramDescription',
    },

    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: (text, record: any, _, action) => [
        <a
          key="editable"
          onClick={() => {
            // if (isEditable) {
            //   message.info('已发布不可以编辑!');
            // } else {
            action?.startEditable?.(record.id);
            setType('edit');
            // }
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={() => {
            deleteDeliveryParam(record.id).then(() => {
              setGloableDataSource(gloableTableDataSource.filter((item: any) => item.id !== record.id));
            });
          }}
        >
          <a key="delete" style={{ color: 'rgb(255, 48, 3)' }}>
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];
  const handleSearch = () => {
    const param = searchForm.getFieldsValue();
    queryDeliveryGloableParamList(versionId, 'global', param.paramName);
  };
  return (
    <>
      <div className="table-caption-application">
        <div className="caption-left">
          <Form layout="inline" form={searchForm}>
            <Form.Item name="paramName">
              <Input style={{ width: 220 }} placeholder="请输入参数名称"></Input>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleSearch} type="primary">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="caption-right">
          {/* <Button
            type="primary"
            // disabled={isEditable}
            onClick={() => {
              setType('add');
              actionRef.current?.addEditRecord?.({
                id: (Math.random() * 1000000).toFixed(0),
              });
            }}
            icon={<PlusOutlined />}
          >
            添加全局参数
          </Button> */}
        </div>
      </div>

      <EditableProTable<DataSourceType>
        rowKey="id"
        actionRef={actionRef}
        headerTitle="可编辑表格"
        // maxLength={5}
        // 关闭默认的新建按钮
        // recordCreatorProps={false}
        columns={columns}
        recordCreatorProps={{
          position: 'top',
          // newRecordType: 'dataSource',
          creatorButtonText: '新增参数',
          record: { id: (Math.random() * 1000000).toFixed(0) },
        }}
        // request={async () => ({
        //   data: defaultData,
        //   total: 3,
        //   success: true,
        // })}
        scroll={{ y: window.innerHeight - 340 }}
        pagination={false}
        value={gloableTableDataSource}
        onChange={setGloableDataSource}
        editable={{
          form,
          editableKeys,
          onSave: async () => {
            let value = form.getFieldsValue();
            let objKey = Object.keys(value);
            let params = value[objKey[0]];
            if (type !== 'edit') {
              await saveParam({ ...params, versionId: versionId, paramComponent: 'global' }).then(() => {
                queryDeliveryGloableParamList(versionId, 'global');
              });
            } else if (type === 'edit') {
              editVersionParam({ ...params, id: parseInt(objKey[0]) }).then(() => {
                queryDeliveryGloableParamList(versionId, 'global');
              });
            }
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>
  );
};

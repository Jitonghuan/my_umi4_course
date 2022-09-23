// create user
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/30 10:50

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Drawer, message, Form, Button, Table, Input, Card, Select, Space } from 'antd';
import PageContainer from '@/components/page-container';
import { history, useLocation} from 'umi';
import { parse } from 'query-string';
import { ContentCard } from '@/components/vc-page-content';
import { roleTableColumns } from '../schema';
import {
  useDeleteUserRole,
  useCreateUserRole,
  useUpdateUserRole,
  useAppGroupOptions,
  queryRoleData,
  useUpdateUser,
} from '../hook';
import { useCategoryData } from '@/common/hooks';
import './index.less';

export default function CreateUser() {
  const [delLoading, deleteUserRole] = useDeleteUserRole();
  let location = useLocation();
  const curRecord: any = location.state || {};
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [saveDisabled, setSaveDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [roleTableSource, setRoleTableSource] = useState<any>([]);
  const [addUserLoading, updateUser] = useUpdateUser();
  const [editForm] = Form.useForm();
  const [editRoleForm] = Form.useForm();
  const [createLoading, createUserRole] = useCreateUserRole();
  const [updateLoading, updateUserRole] = useUpdateUserRole();
  const [curRoleId, setRoleId] = useState<number>();
  // 所属数据
  const [categoryData] = useCategoryData();
  const [categoryCode, setCategoryCode] = useState<string>();
  const [appGroupOptions, appGroupLoading] = useAppGroupOptions(categoryCode);
  const [viewDisabled, setViewDisabled] = useState<boolean>(false);

  // 应用分类 - 应用组 联动
  const handleCategoryCodeChange = useCallback((next: string) => {
    setCategoryCode(next);
    editRoleForm.resetFields(['groupCode']);
  }, []);
  useEffect(() => {
    if (curRecord) {
      getRoleData();
      editForm.setFieldsValue({
        ...curRecord,
      });
    }
    if (curRecord?.optType && curRecord?.optType === 'VIEW') {
      setViewDisabled(true);
    }
    return () => {
      setSaveDisabled(false);
    };
  }, [curRecord]);
  const getRoleData = () => {
    setLoading(true);
    queryRoleData(curRecord?.name)
      .then((res) => {
        setRoleTableSource(res[0].roles || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = useMemo(() => {
    return roleTableColumns({
      viewDisabled: curRecord?.optType === 'VIEW' ? viewDisabled : false,
      onView: (record, index) => {
        setMode('VIEW');
        editRoleForm.setFieldsValue({ ...record });
      },
      onEdit: (record, index) => {
        setMode('EDIT');

        editRoleForm.setFieldsValue({ ...record });
        setRoleId(record.id);
      },
      onDelete: (record) => {
        if (roleTableSource.length < 2) {
          message.info('该用户只有一个角色的时候不能删除！');
        } else {
          deleteUserRole({ id: record?.id }).then(() => {
            getRoleData();
          });
        }
      },
    }) as any;
  }, [roleTableSource]);
  const handleSubmit = async () => {
    const params = await editRoleForm.validateFields();
    if (mode === 'ADD') {
      createUserRole({ ...params, id: curRecord?.id })
        .then(() => {
          setMode('HIDE');
        })
        .then(() => {
          getRoleData();
        });
    }
    if (mode === 'EDIT') {
      updateUserRole({ ...params, id: curRoleId })
        .then(() => {
          setMode('HIDE');
        })
        .then(() => {
          getRoleData();
        });
    }
  };
  const saveUserInfo = async () => {
    setSaveDisabled(true);
    const userParams = await editForm.validateFields();
    updateUser({ ...userParams, id: curRecord?.id });
  };

  return (
    <PageContainer className="create-user">
      <ContentCard>
        <Card style={{ width: '100%' }}>
          <div>
            <Button
              size="small"
              onClick={() => {
                history.push('/matrix/admin/user');
              }}
            >
              返回
            </Button>
          </div>
          <Form labelCol={{ flex: '150px' }} form={editForm}>
            <Form.Item label="姓名" name="name" rules={[{ required: true, message: '这是必填项' }]}>
              <Input style={{ width: 420 }} disabled />
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              <Input style={{ width: 420 }} disabled={curRecord?.optType === 'VIEW' ? viewDisabled : saveDisabled} />
            </Form.Item>
            <Form.Item label="手机号" name="mobile">
              <Input style={{ width: 420 }} disabled={curRecord?.optType === 'VIEW' ? viewDisabled : saveDisabled} />
            </Form.Item>
            <Form.Item label="Sso用户名" name="ssoUsername" rules={[{ required: true, message: '这是必填项' }]}>
              <Input style={{ width: 420 }} disabled={curRecord?.optType === 'VIEW' ? viewDisabled : saveDisabled} />
            </Form.Item>
            <Form.Item label="LeaderDingUid" name="leaderDingUid">
              <Input style={{ width: 420 }} disabled={curRecord?.optType === 'VIEW' ? viewDisabled : saveDisabled} />
            </Form.Item>
            <Form.Item label="DingUid" name="dingUid">
              <Input style={{ width: 420 }} disabled={curRecord?.optType === 'VIEW' ? viewDisabled : saveDisabled} />
            </Form.Item>
            {!viewDisabled && (
              <Form.Item style={{ marginLeft: 420 }}>
                <Space>
                  <Button
                    onClick={() => {
                      setSaveDisabled(false);
                    }}
                  >
                    重新编辑
                  </Button>

                  <Button type="primary" loading={addUserLoading} onClick={saveUserInfo}>
                    保存
                  </Button>
                </Space>
              </Form.Item>
            )}
          </Form>
        </Card>
        <div></div>
        {/* <Card style={{ width: '100%',marginTop:30 }}> */}
        <div style={{ width: '100%', marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="user-role-list-title">角色信息</h3>
            {!viewDisabled && (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  setMode('ADD');
                }}
              >
                + 新增角色信息
              </Button>
            )}
          </div>

          <Table columns={columns} bordered dataSource={roleTableSource} loading={loading} />
        </div>

        {/* </Card> */}
      </ContentCard>
      <Drawer
        width={700}
        title={mode === 'ADD' ? '新增角色信息' : mode === 'VIEW' ? '编辑角色信息' : '查看角色信息'}
        placement="right"
        visible={mode !== 'HIDE'}
        onClose={() => {
          setMode('HIDE');
        }}
        maskClosable={false}
        footer={
          <div className="drawer-footer">
            <Button
              type="primary"
              loading={mode === 'ADD' ? createLoading : updateLoading}
              onClick={handleSubmit}
              disabled={mode === 'VIEW'}
            >
              保存
            </Button>
            <Button
              type="default"
              onClick={() => {
                setMode('HIDE');
              }}
            >
              取消
            </Button>
          </div>
        }
      >
        <Form labelCol={{ flex: '120px' }} form={editRoleForm}>
          <Form.Item label="角色" name="role" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 420 }} disabled={mode === 'VIEW'} />
          </Form.Item>
          <Form.Item label="应用分类" name="categoryCode">
            <Select
              style={{ width: 420 }}
              options={categoryData}
              onChange={handleCategoryCodeChange}
              showSearch
              allowClear
              disabled={mode === 'VIEW'}
            />
          </Form.Item>
          <Form.Item label="应用组" name="groupCode">
            <Select
              disabled={mode === 'VIEW'}
              style={{ width: 420 }}
              options={appGroupOptions}
              loading={appGroupLoading}
              allowClear
              showSearch
            />
          </Form.Item>
        </Form>
      </Drawer>
    </PageContainer>
  );
}

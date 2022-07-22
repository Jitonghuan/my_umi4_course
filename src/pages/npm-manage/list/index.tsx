import React, { useState, useEffect } from 'react';
import {Button, Form, Input, message, Table, Drawer, Tooltip, Radio, Popconfirm} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import UserSelector, { stringToList } from "@/components/user-selector";
import DebounceSelect from "@/components/debounce-select";
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import {delRequest, getRequest, postRequest, putRequest} from "@/utils/request";
import {npmCreate, searchGitAddress, npmUpdate, npmList, npmDelete} from './server';
import { history } from 'umi';
import './index.less';

const { Item: FormItem } = Form;

export default function NpmList() {
  const [searchField] = Form.useForm();
  const [dataList, setDataList] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [activeTab, setActiveTab] = useState<any>('mine');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('add');
  const [form] = Form.useForm();

  async function handleSearch(pagination?: any ) {
    const param = await searchField.getFieldsValue() || {};
    let userInfo: any = localStorage.getItem('USER_INFO');
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
    }
    const res = await getRequest(npmList, {
      data: {
        ...param,
        npmOwner: activeTab === 'mine' && userInfo ? userInfo.name : '',
        pageIndex: page,
        pageSize,
        ...pagination || {}
      }
    })
    const { dataSource, pageInfo } = res?.data || {};
    setDataList(dataSource || []);
    setTotal(pageInfo?.total || 0);
  }

  async function onDel(id: number | string) {
    const res = await delRequest(`${npmDelete}/${id}`);
    if (res?.success) {
      message.success('删除成功');
      resetPage(1);
    }
  }

  function resetPage (page: number) {
    setPage(page);
    void handleSearch({
      pageIndex: page
    });
  }

  async function handleSubmit() {
    const params = await form.validateFields();
    const { ownerList, ...others } = params;

    const submitData: any = {
      ...others,
      npmOwner: ownerList?.join(',') || '',
    };

    setLoading(true);
    let res = null;
    if (type === 'add') {
      res = await postRequest(npmCreate, {
        data: submitData
      });
    } else {
      res = await putRequest(npmUpdate, {
        data: submitData
      });
    }
    setLoading(false);
    if (res?.success) {
      message.success(type === 'add' ? '新增成功!' : '修改成功');
      void handleClose();
      resetPage(1);
    }
  }

  function handleClose() {
    setVisible(false);
    form.resetFields();
  }

  useEffect(() => {
    resetPage(1);
  }, [activeTab])

  useEffect(() => {
    void handleSearch();
  }, [])

  return (
    <PageContainer className="npm-list-page">
      <FilterCard>
        <Form
          form={searchField}
          layout="inline"
          onFinish={() => resetPage(1)}
          onReset={() => {
            searchField.resetFields();
          }}
        >
          <FormItem label="包名" name="npmName">
            <Input
              placeholder="请输入"
              style={{width: '300px'}}
              onChange={() => resetPage(1)}
              onPressEnter={() => resetPage(1)}
            />
          </FormItem>
          <FormItem label="描述" name="desc">
            <Input.Search
              placeholder="请输入"
              style={{width: '300px'}}
              onChange={() => resetPage(1)}
              onPressEnter={() => resetPage(1)}
              onSearch={() => resetPage(1)}
              enterButton
            />
          </FormItem>
        </Form>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <Radio.Group value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
            <Radio.Button value="mine">我的</Radio.Button>
            <Radio.Button value="all">全部</Radio.Button>
          </Radio.Group>
          <Button
            type="primary"
            onClick={() => {
              setType('add');
              setVisible(true);
            }}
          >
            <PlusOutlined />
            新增
          </Button>
        </div>
        <Table
          bordered
          dataSource={dataList}
          rowKey='name'
          scroll={{ x: '100%' }}
          pagination={{
            total,
            pageSize,
            current: page,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
              void handleSearch({
                pageIndex: page,
                pageSize
              })
            }
          }}
          columns={[
            {
              title: '包名',
              dataIndex: 'npmName',
              width: 320,
              render: (text, record) => (
                <a
                  onClick={() => {
                    history.push({
                      pathname: 'npm-detail',
                      query: {
                        id: record.id,
                        npmName: record.npmName,
                      },
                    });
                  }}
                >
                  {text}
                </a>
              ),
            },
            {
              title: 'git地址',
              width: 320,
              ellipsis: true,
              dataIndex: 'gitAddress',
              render: (value: string) =>
                value && (
                  <a href={value} target="_blank">
                    {value}
                  </a>
                ),
            },
            {
              title: '描述',
              dataIndex: 'desc',
              width: 200,
              ellipsis: true,
              render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
              title: '负责人',
              dataIndex: 'npmOwner',
              width: 420,
            },
            {
              width: 140,
              title: '操作',
              fixed: 'right',
              dataIndex: 'operate',
              align: 'center',
              render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                  <a
                    onClick={() => {
                      setType('edit');
                      setVisible(true);
                      form.setFieldsValue({
                        ...record,
                        ownerList: stringToList(record?.npmOwner)
                      });
                    }}
                  >
                    编辑
                  </a>
                  <a
                    onClick={() => {
                      history.push({
                        pathname: 'npm-detail',
                        query: {
                          id: record.id,
                          npmName: record.npmName,
                        },
                      });
                    }}
                  >
                    详情
                  </a>
                  <Popconfirm title="确定要删除吗？" onConfirm={() => onDel(record.id)}>
                    <Button type="link" danger size="small">
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              ),
            }
          ]}
          />
      </ContentCard>
      <Drawer
        width={660}
        title={type === 'add' ? '新增' : '编辑'}
        visible={visible}
        onClose={handleClose}
        maskClosable={false}
        footer={
          <div className="drawer-footer">
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              保存
            </Button>
            <Button type="default" onClick={handleClose}>
              取消
            </Button>
          </div>
        }
      >
        <Form form={form} labelCol={{ flex: '100px' }}>
          <Form.Item label="包名" name="npmName" rules={[{ required: true, message: '请输入包名' }]}>
            <Input disabled={type !== 'add'} />
          </Form.Item>
          <FormItem label="Git 地址" name="gitAddress" rules={[{ required: true, message: '请输入 gitlab 地址' }]}>
            <DebounceSelect
              fetchOptions={searchGitAddress}
              disabled={type !== 'add'}
              labelInValue={false}
              placeholder="输入仓库名搜索"
            />
          </FormItem>
          <FormItem label="负责人" name="ownerList" rules={[{ required: true, message: '请输入负责人' }]}>
            <UserSelector />
          </FormItem>
          <Form.Item label="描述" name="desc">
            <Input.TextArea placeholder="请输入描述" rows={3} />
          </Form.Item>
        </Form>
      </Drawer>
    </PageContainer>
  );
}

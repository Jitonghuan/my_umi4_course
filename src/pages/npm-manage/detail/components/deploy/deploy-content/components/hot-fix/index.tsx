import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import DebounceSelect from '@/components/debounce-select';
import SelectVersion from './select-version';
import DetailContext from "@/pages/npm-manage/detail/context";
import { getRequest, postRequest } from '@/utils/request';
import { datetimeCellRender } from "@/utils";
import {
  searchHotFixVersion,
  hotFixList,
  createHotfixBranch,
  createHotfixDeploy
} from "@/pages/npm-manage/detail/server";
import './index.less';
import { useMasterBranchList } from "@/pages/npm-manage/detail/hooks";
import { PlusOutlined } from "@ant-design/icons";
import { FilterCard } from "@/components/vc-page-content";
import { queryActiveDeployInfo } from "@/pages/application/service";
import useInterval from "../../useInterval";
import PublishRecord from "../publish-record";

const { Item: FormItem } = Form;

interface IProps {
  isActive: boolean,
  pipelineCode: string,
  envTypeCode: string,
}

const recordDisplayMap: any = {
  wait: { text: '发布开始', color: 'blue' },
  process: { text: '正在发布', color: 'geekblue' },
  error: { text: '发布失败', color: 'red' },
  finish: { text: '发布完成', color: 'green' },
};

export default function HotFix(props: IProps) {
  const { isActive, pipelineCode, envTypeCode } = props
  const { npmData } = useContext(DetailContext);
  const { npmName } = npmData || {};
  const [dataList, setDataList] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [versionVisible, setVersionVisible] = useState(false);
  const [deployLoading, setDeployLoading] = useState(false);
  const [curRecord, setCurRecord] = useState<any>({});
  const [deployInfo, setDeployInfo] = useState<any>({});
  const [searchField] = Form.useForm();

  const [masterBranchOptions, setMasterBranchOptions] = useState<any>([]);
  const [masterListData] = useMasterBranchList({ branchType: 'master', appCode: npmData?.npmName, isNpm: true });
  const [form] = Form.useForm();

  useEffect(() => {
    if (masterListData.length !== 0) {
      const option = masterListData.map((item: any) => ({ value: item.branchName, label: item.branchName }));
      setMasterBranchOptions(option);
    }
  }, [masterListData]);
  const searchVersion = async (keyword: string) => {
    if (!keyword) return [];

    const result = await getRequest(searchHotFixVersion, {
      data: {
        npmName: npmData?.npmName,
        versionPrefix: keyword,
        pageIndex: 1,
        pageSize: 20,
      },
    });
    const { dataSource } = result?.data || {};
    return (dataSource || []).map((item: any) => ({ label: item.npmVersion, value: item.npmVersion })) as IOption[];
  };

  // 查询
  async function handleSearch(param?: any ) {
    const res = await getRequest(hotFixList, {
      data: {
        appCode: npmData?.npmName,
        branchType: 'hotfix',
        pageIndex: page,
        pageSize,
        ...param || {}
      }
    })
    const { dataSource, pageInfo } = res?.data || {};
    setDataList(dataSource || []);
    setTotal(pageInfo?.total || 0);
  }

  useEffect(() => {
    if (isActive) {
      void handleSearch({
        masterBranch: 'master',
      });
    }
  }, [isActive])


  // 新增HotFix
  async function onOk() {
    const values = await form.validateFields();
    setLoading(true);
    const res = await postRequest(createHotfixBranch, {
      data: {
        npmName: npmData?.npmName,
        newBranch: `hotFix_${values.gitTag}`,
        pipelineCode,
        ...values
      }
    })
    setLoading(false);
    if (res?.success) {
      message.success('新增成功!');
      setVisible(false);
      const param = await searchField.getFieldsValue();
      handleSearch(param);
    }
  }

  // 发布
  async function onDeploy(params: any) {
    setDeployLoading(true);
    const res = await postRequest(createHotfixDeploy, {
      data: {
        npmName: npmData?.npmName,
        pipelineCode,
        envTypeCode,
        masterBranch: curRecord?.masterBranch,
        features: [curRecord?.branchName],
        needHotfixVersion: curRecord?.branchName.split('hotFix_')[1],
        ...params
      }
    })
    setDeployLoading(false);
    if (res?.success) {
      setVersionVisible(false);
    }
  }

  const requestData = async () => {
    if (!npmName || !isActive || !pipelineCode) return;

    const resp = await queryActiveDeployInfo({ pipelineCode });

    if (resp && resp.success) {
      if (resp?.data) {
        setDeployInfo(resp.data);
      }
      if (!resp.data) {
        setDeployInfo({});
      }
    } else {
      setDeployInfo({});
    }
  };

  // 定时请求发布内容
  const { handle: timerHandle } = useInterval(requestData, 8000, { immediate: true });

  // appCode变化时
  useEffect(() => {
    if (!npmName || !isActive || !pipelineCode) {
      timerHandle('stop');
    } else {
      timerHandle('stop');
      timerHandle('do', true);
    }
  }, [npmName, isActive, pipelineCode]);

  function judgeActiveDeploy(record: any) {
    if (record.branchName === deployInfo?.branchInfo?.features[0]) {
      let errorInfo: string[] = [];
      if (deployInfo?.status?.deployErrInfo) {
        Object.keys(deployInfo?.status?.deployErrInfo).forEach((item) => {
          if (deployInfo?.status?.deployErrInfo[item]) {
            errorInfo.push(deployInfo?.status?.deployErrInfo[item]);
          }
        });
      }
      return {
        deployStatus: deployInfo?.status?.deployStatus,
        errorMessage: errorInfo.join(';'),
        jenkinsUrl: deployInfo?.buildInfo?.buildUrl?.singleBuild
      }
    }
    return {}
  }

  return (
    <div className='publish-content-compo hot-fix-wrapper'>
      <div className="hotfix-content-body">
        <FilterCard>
          <Form
            layout="inline"
            form={searchField}
            onFinish={(params) => handleSearch(params)}
          >
            <FormItem label="主干分支" name="masterBranch" initialValue="master">
              <Select
                options={masterBranchOptions}
                style={{ width: '200px', marginRight: '20px' }}
                showSearch
                optionFilterProp="label"
                onChange={async () => {
                  const param = await searchField.getFieldsValue();
                  handleSearch(param);
                }}
                filterOption={(input, option) => {
                  // @ts-ignore
                  return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              />
            </FormItem>
            <FormItem label="HotFix分支" name="branchName">
              <Input />
            </FormItem>
            <FormItem>
              <Button type="primary" ghost htmlType="submit" style={{ marginRight: 16 }}>
                查询
              </Button>
            </FormItem>
            <FormItem noStyle>
              <div className="list-btn-wrapper">
                <Button
                  type="primary"
                  onClick={() => setVisible(true)}
                  icon={<PlusOutlined />}
                >新增HotFix</Button>
              </div>
            </FormItem>
          </Form>
        </FilterCard>
        <Table
          rowKey="id"
          dataSource={dataList}
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
          bordered
          scroll={{ x: '100%' }}
          columns={[
            {
              dataIndex: 'branchName',
              title: '分支名',
              fixed: 'left',
              width: 220
            },
            {
              dataIndex: 'desc',
              title: '分支描述',
              width: 120
            },
            {
              title: '发布状态',
              width: 120,
              render: (value, record) => (
                <div style={{ color:  recordDisplayMap[judgeActiveDeploy(record)?.deployStatus]?.color || '#000'}}>
                  <div>{recordDisplayMap[judgeActiveDeploy(record)?.deployStatus]?.text || '---'}</div>
                  <div>{judgeActiveDeploy(record)?.errorMessage}</div>
                </div>
              )
            },
            {
              dataIndex: 'gmtCreate',
              title: '创建时间',
              width: 180,
              render: datetimeCellRender
            },
            {
              dataIndex: 'createUser',
              title: '创建人',
              width: 100
            },
            {
              dataIndex: 'gmtModify',
              title: '更新时间',
              width: 180,
              render: datetimeCellRender
            },
            {
              dataIndex: 'modifyUser',
              title: '更新人',
              width: 100
            },
            {
              width: 160,
              title: '操作',
              fixed: 'right',
              dataIndex: 'operate',
              align: 'left',
              render: (_: any, record: any) => (
                <div className="action-cell">
                  <a
                    onClick={() => {
                      setVersionVisible(true);
                      setCurRecord(record);
                    }}
                  >
                    发布
                  </a>
                  {
                    judgeActiveDeploy(record)?.jenkinsUrl && (
                      <a
                        target="_blank"
                        href={judgeActiveDeploy(record)?.jenkinsUrl}
                      >
                        构建详情
                      </a>
                    )
                  }
                </div>
              ),
            }
          ]}
        />
      </div>

      <div className="hotfix-content-sider">
        <PublishRecord env='hotfix' npmName={npmName} />
      </div>

      <Modal
        title="新增hotFix"
        visible={visible}
        confirmLoading={loading}
        onOk={onOk}
        onCancel={() => { setVisible(false) }}
        maskClosable={false}
      >
        <Form form={form}>
          <Form.Item label="版本号(输入x.y)" name="gitTag" rules={[{ required: true, message: '请选择版本' }]}>
            <DebounceSelect
              fetchOptions={searchVersion}
              labelInValue={false}
              placeholder="输入x.y搜索"
            />
          </Form.Item>
        </Form>
      </Modal>

      <SelectVersion
        visible={versionVisible}
        loading={deployLoading}
        onClose={() => setVersionVisible(false)}
        onConfirm={onDeploy}
      />
    </div>
  )
}

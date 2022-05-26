/**
 * PublishBranch
 * @description 待发布分支
 * @author moting.nq
 * @create 2021-04-15 10:22
 * @modified 2021/08/30 moyan
 */

import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Table, Input, Button, Modal, Checkbox, Tag, Tooltip, Select, message } from '@cffe/h2o-design';
import { ExclamationCircleOutlined, CopyOutlined } from '@ant-design/icons';
import DetailContext from '@/pages/application/application-detail/context';
import { createDeploy, updateFeatures, queryEnvsReq } from '@/pages/application/service';
import { DeployInfoVO } from '@/pages/application/application-detail/types';
import { datetimeCellRender } from '@/utils';
import { listAppEnv } from '@/pages/application/service';
import { getRequest, postRequest } from '@/utils/request';
import { getMasterBranch } from '@/pages/application/service';
import { useMasterBranchList } from '@/pages/application/application-detail/components/branch-manage/hook';
import './index.less';

const rootCls = 'publish-branch-compo';
const { confirm } = Modal;

export interface PublishBranchProps {
  /** 是否有发布内容 */
  hasPublishContent: boolean;
  deployInfo: DeployInfoVO;
  env: string;
  onSearch: (name?: string) => any;
  masterBranchChange: any;
  dataSource: {
    id: string | number;
    branchName: string;
    desc: string;
    createUser: string;
    gmtCreate: string;
    status: string | number;
  }[];
  pipelineCode: string;
  /** 提交分支事件 */
  onSubmitBranch: (status: 'start' | 'end') => void;
  changeBranchName: any;
}

export default function PublishBranch(publishBranchProps: PublishBranchProps, props: any) {
  const {
    hasPublishContent,
    deployInfo,
    dataSource,
    onSubmitBranch,
    env,
    onSearch,
    masterBranchChange,
    pipelineCode,
    changeBranchName,
  } = publishBranchProps;
  const { appData } = useContext(DetailContext);
  const { metadata, branchInfo } = deployInfo || {};
  const { appCategoryCode, appCode, id } = appData || {};
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [envDataList, setEnvDataList] = useState<any>([]);
  const [deployEnv, setDeployEnv] = useState<any[]>();
  const [masterBranchOptions, setMasterBranchOptions] = useState<any>([]);
  const [selectMaster, setSelectMaster] = useState<any>('master');
  const [masterListData] = useMasterBranchList({ branchType: 'master', appCode });
  const [loading, setLoading] = useState<boolean>(false);
  const selectRef = useRef(null) as any;

  const getBuildType = () => {
    let { appType, isClient } = appData || {};
    if (appType === 'frontend') {
      return 'feMultiBuild';
    } else {
      return isClient ? 'beClientBuild' : 'beServerBuild';
    }
  };

  type reviewStatusTypeItem = {
    color: string;
    text: string;
  };

  const STATUS_TYPE: Record<number, reviewStatusTypeItem> = {
    1: { text: '未创建', color: 'default' },
    2: { text: '审核中', color: 'blue' },
    3: { text: '已关闭', color: 'orange' },
    4: { text: '未通过', color: 'red' },
    5: { text: '已删除', color: 'gray' },
    6: { text: '已通过', color: 'green' },
  };

  const submit = async () => {
    const filter = dataSource.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);
    // 如果有发布内容，接口调用为 更新接口，否则为 创建接口
    if (hasPublishContent) {
      return await updateFeatures({
        id: metadata?.id,
        features: filter,
      });
    }

    return await createDeploy({
      appCode: appCode!,
      envTypeCode: env,
      features: filter,
      pipelineCode,
      envCodes: deployEnv,
      masterBranch: selectMaster, //主干分支
      buildType: getBuildType(),
    });
  };

  // 如果已有发布内容，则二次确认后直接添加进去，否则需要用户选择发布环境
  const submitClick = () => {
    // 二方包 或 有已发布
    // if (String(appData?.isClient) === '1' || hasPublishContent) {
    if (hasPublishContent) {
      return confirm({
        title: '确定要提交发布吗?',
        icon: <ExclamationCircleOutlined />,
        onOk: async () => {
          await submit();
          onSubmitBranch?.('end');
        },
      });
    }

    setDeployVisible(true);
  };

  useEffect(() => {
    if (masterListData.length !== 0) {
      const option = masterListData.map((item: any) => ({ value: item.branchName, label: item.branchName }));
      setMasterBranchOptions(option);
      if (branchInfo?.masterBranch) {
        const initValue = option.find((item: any) => item.label === branchInfo?.masterBranch);
        setSelectMaster(initValue?.value);
        masterBranchChange(initValue?.value);
      }
    }
  }, [masterListData, branchInfo?.masterBranch]);

  useEffect(() => {
    if (!appCategoryCode) return;
    getRequest(listAppEnv, {
      data: {
        envTypeCode: env,
        appCode: appData?.appCode,
        proEnvType: 'benchmark',
      },
    }).then((result) => {
      let envSelect: any = [];
      if (result?.success) {
        result?.data?.map((item: any) => {
          envSelect.push({ label: item.envName, value: item.envCode });
        });
        setEnvDataList(envSelect);
      }
      // setEnvDataList(data.list);
    });
  }, [appCategoryCode, env]);

  const handleChange = (v: any) => {
    selectRef?.current?.blur();
    setSelectMaster(v);
    masterBranchChange(v);
  };

  const branchNameRender = (branchName: string, record: any) => {
    return (
      <div>
        <Link to={'/matrix/application/detail/branch?' + 'appCode=' + appCode + '&' + 'id=' + id}>{branchName}</Link>
        <span style={{ marginLeft: 8, color: 'royalblue' }}>
          <CopyToClipboard text={branchName} onCopy={() => message.success('复制成功！')}>
            <CopyOutlined />
          </CopyToClipboard>
        </span>
      </div>
    );
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>待发布的分支</div>

      <div className="table-caption">
        <div className="caption-left">
          <h4>主干分支：</h4>
          <Select
            ref={selectRef}
            options={masterBranchOptions}
            value={selectMaster}
            style={{ width: '300px', marginRight: '20px' }}
            onChange={handleChange}
            showSearch
            optionFilterProp="label"
            // labelInValue
            filterOption={(input, option) => {
              return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          ></Select>
          <h4>开发分支名称：</h4>
          <Input.Search
            placeholder="搜索分支"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value), changeBranchName(e.target.value), console.log(e.target.value, 888);
            }}
            onPressEnter={() => onSearch?.(searchText)}
            onSearch={() => onSearch?.(searchText)}
          />
        </div>
        <div className="caption-right">
          <Button type="primary" disabled={!selectedRowKeys?.length} onClick={submitClick}>
            提交分支
          </Button>
        </div>
      </div>
      <Table
        rowKey="id"
        bordered
        dataSource={dataSource}
        loading={loading}
        pagination={false}
        scroll={{ x: '100%' }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedRowKeys as any);
          },
        }}
      >
        <Table.Column dataIndex="branchName" title="分支名" fixed="left" render={branchNameRender} width={320} />
        <Table.Column
          dataIndex="desc"
          title="变更原因"
          width={200}
          ellipsis={{
            showTitle: false,
          }}
          render={(value) => (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          )}
        />
        <Table.Column dataIndex="id" title="ID" width={80} />
        <Table.Column
          dataIndex="status"
          width={120}
          align="center"
          title="分支review状态"
          render={(text: number) => (
            <Tag color={STATUS_TYPE[text]?.color || 'red'}>{STATUS_TYPE[text]?.text || '---'}</Tag>
          )}
        />
        <Table.Column dataIndex="gmtCreate" title="创建时间" width={160} render={datetimeCellRender} />
        <Table.Column dataIndex="createUser" title="创建人" width={80} />
        {appData?.appType === 'frontend' ? (
          <Table.Column
            fixed="right"
            title="和master对比"
            align="center"
            width={110}
            render={(item) => (
              <a
                target="_blank"
                href={`${appData?.gitAddress.replace('.git', '')}/-/compare/master...${item.branchName}?view=parallel`}
              >
                查看
              </a>
            )}
          />
        ) : null}
      </Table>

      <Modal
        title="选择发布环境"
        visible={deployVisible}
        confirmLoading={confirmLoading}
        onOk={() => {
          setConfirmLoading(true);
          return submit()
            .then(() => {
              setDeployVisible(false);
              onSubmitBranch?.('end');
            })
            .finally(() => setConfirmLoading(false));
        }}
        onCancel={() => {
          setDeployVisible(false);
          setConfirmLoading(false);
          onSubmitBranch?.('end');
        }}
        maskClosable={false}
      >
        <div>
          <span>发布环境：</span>
          <Checkbox.Group value={deployEnv} onChange={(v) => setDeployEnv(v)} options={envDataList || []} />
        </div>
      </Modal>
    </div>
  );
}

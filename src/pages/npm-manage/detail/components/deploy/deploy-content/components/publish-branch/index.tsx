import React, { useState, useRef, useContext, useEffect } from 'react';
import { Table, Input, Button, Tooltip, Select } from 'antd';

import DetailContext from '@/pages/npm-manage/detail/context';
import { createDeploy, updateFeatures } from '@/pages/npm-manage/detail/server';
import { DeployInfoVO } from '../../../types';
import { datetimeCellRender } from '@/utils';
import { postRequest} from '@/utils/request';
import { useMasterBranchList } from '@/pages/npm-manage/detail/hooks';
import SelectVersion from '../select-version';
import './index.less';

const rootCls = 'publish-branch-compo';

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
  /** 提交分支事件 */
  onSubmitBranch: (status: 'start' | 'end') => void;
  changeBranchName: any;
  pipelineCode?: string;
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
    changeBranchName,
    pipelineCode,
  } = publishBranchProps;
  const { npmData } = useContext(DetailContext);
  const { metadata, branchInfo } = deployInfo || {};
  const { npmName, gitAddress } = npmData || {};
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [masterBranchOptions, setMasterBranchOptions] = useState<any>([]);
  const [selectMaster, setSelectMaster] = useState<any>('master');
  const [masterListData] = useMasterBranchList({ branchType: 'master', appCode: npmName, isNpm: true });
  const [loading, setLoading] = useState<boolean>(false);
  const selectRef = useRef(null) as any;

  const submit = async (params: any) => {
    const filter = dataSource.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);
    setLoading(true);
    // 如果有发布内容，接口调用为 更新接口，否则为 创建接口
    if (hasPublishContent) {
      await postRequest(updateFeatures, {
       data: {
         id: metadata?.id,
         features: filter,
         ...params || {}
       }
      });
    } else {
      await postRequest(createDeploy, {
        data: {
          npmName: npmName!,
          pipelineCode,
          envTypeCode: env,
          features: filter,
          masterBranch: selectMaster, //主干分支
          ...params || {}
        }
      });
    }
    setDeployVisible(false);
    onSubmitBranch?.('end');
    setLoading(false);
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

  const handleChange = (v: any) => {
    selectRef?.current?.blur();
    setSelectMaster(v);
    masterBranchChange(v);
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
              // @ts-ignore
              return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          />
          <h4>开发分支名称：</h4>
          <Input.Search
            placeholder="搜索分支"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value), changeBranchName(e.target.value);
            }}
            onPressEnter={() => onSearch?.(searchText)}
            onSearch={() => onSearch?.(searchText)}
          />
        </div>
        <div className="caption-right">
          <Button type="primary" disabled={!selectedRowKeys?.length} onClick={() => setDeployVisible(true)}>
            {hasPublishContent ? '追加分支' : '提交分支'}
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
        <Table.Column dataIndex="branchName" title="分支名" fixed="left" width={320} />
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
        <Table.Column dataIndex="gmtCreate" title="创建时间" width={160} render={datetimeCellRender} />
        <Table.Column dataIndex="createUser" title="创建人" width={80} />
        <Table.Column
          fixed="right"
          title="和master对比"
          align="center"
          width={110}
          render={(item) => (
            <a
              target="_blank"
              href={`${gitAddress?.replace('.git', '')}/-/compare/master...${item.branchName}?view=parallel`}
            >
              查看
            </a>
          )}
        />
      </Table>

      <SelectVersion
        loading={loading}
        onConfirm={(params) => {
          void submit(params);
        }}
        visible={deployVisible}
        onClose={() => setDeployVisible(false)}
        />
    </div>
  );
}

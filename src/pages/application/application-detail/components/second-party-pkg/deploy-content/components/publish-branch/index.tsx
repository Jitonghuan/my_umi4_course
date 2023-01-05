/**
 * PublishBranch
 * @description 待发布分支
 * @author moting.nq
 * @create 2021-04-15 10:22
 */

import React, { useState, useContext, useEffect, useRef } from 'react';
import { Steps, Button, message, Modal, Checkbox, Input, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import HulkTable from '@cffe/vc-hulk-table';
import { createTableSchema } from './schema';
import DetailContext from '@/pages/application/application-detail/context';
import { createDeploy, updateFeatures, queryEnvsReq } from '@/pages/application/service';
import { IProps } from './types';
import { useMasterBranchList } from '@/pages/application/application-detail/components/branch-manage/hook';
import './index.less';

const rootCls = 'publish-branch-compo';
const { confirm } = Modal;

export default function PublishBranch(props: IProps) {
  const { hasPublishContent, deployInfo, dataSource, onSubmitBranch, env, pipelineCode, onSearch, masterBranchChange } =
    props;
  const { metadata, branchInfo } = deployInfo || {};
  const { appData } = useContext(DetailContext);
  const { appCategoryCode, appCode } = appData || {};

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [envDataList, setEnvDataList] = useState<any>([]);
  const [deployEnv, setDeployEnv] = useState<any[]>();
  const [masterBranchOptions, setMasterBranchOptions] = useState<any>([]);
  const [selectMaster, setSelectMaster] = useState<any>('master');
  const [searchText, setSearchText] = useState<string>('');
  const [masterListData] = useMasterBranchList({ branchType: 'master', appCode });
  const selectRef = useRef(null) as any;

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

  const submit = () => {
    const filter = dataSource.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);
    // 如果有发布内容，接口调用为 更新接口，否则为 创建接口
    if (hasPublishContent) {
      return updateFeatures({
        id: metadata.id,
        features: filter,
      }).then((res: any) => {
        if (!res.success) {
          message.error(res.errorMsg);
          throw Error;
        }
      });
    }

    return createDeploy({
      appCode: appCode!,
      envTypeCode: env,
      features: filter,
      envCodes: deployEnv,
      // isClient: true,
      pipelineCode,
      buildType: appData?.appType==="backend"?'beClientBuild':"feClientBuild",
      masterBranch: selectMaster, //主干分支
      deployModel: appData?.deployModel,
    }).then((res: any) => {
      if (!res.success) {
        message.error(res.errorMsg);
        throw Error;
      }
    });
  };

  const submitClick = () => {
    confirm({
      title: '确定要提交发布吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        return submit().then(() => {
          onSubmitBranch?.('end');
        });
      },
      onCancel() {
        onSubmitBranch?.('end');
      },
    });
  };

  useEffect(() => {
    if (!appCategoryCode) return;
    queryEnvsReq({
      categoryCode: appCategoryCode as string,
      envTypeCode: env,
      appCode,
    }).then((data) => {
      let envSelect: any = [];
      data?.list?.map((item: any) => {
        envSelect.push({ label: item.envName, value: item.envCode });
      });
      setEnvDataList(envSelect);
    });
  }, [appCategoryCode, env]);

  const handleChange = (v: any) => {
    selectRef?.current?.blur();
    setSelectMaster(v?.value);
    masterBranchChange(v?.value);
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>待发布的分支</div>
      <div className="table-caption">
        <div className="caption-left">
          {/* <span className={`${rootCls}__list-header-text`}>分支列表</span> */}
          <span>主干分支：</span>
          <Select
            ref={selectRef}
            options={masterBranchOptions}
            value={selectMaster}
            style={{ width: '300px', marginRight: '20px' }}
            onChange={handleChange}
            showSearch
            optionFilterProp="label"
            labelInValue
            filterOption={(input, option) => {
              return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          ></Select>
          <span>开发分支名称：</span>
          <Input.Search
            placeholder="搜索分支"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => onSearch?.(searchText)}
            onSearch={() => onSearch?.(searchText)}
          />

          <div className="caption-right">
            {appData?.deployModel === 'online' && (
              <Button
                type="primary"
                disabled={!selectedRowKeys?.length}
                onClick={submitClick}
                style={{ marginLeft: '20px' }}
              >
                {hasPublishContent ? '追加分支' : '提交分支'}
              </Button>
            )}
          </div>
        </div>

        <HulkTable
          rowKey="id"
          className={`${rootCls}__list-table`}
          dataSource={dataSource}
          bordered
          scroll={{ x: '100%' }}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
              setSelectedRowKeys(selectedRowKeys as any);
            },
          }}
          columns={createTableSchema() as any}
        />
      </div>

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
      >
        <div>
          <span>发布环境：</span>
          <Checkbox.Group value={deployEnv} onChange={(v) => setDeployEnv(v)} options={envDataList || []} />
        </div>
      </Modal>
    </div>
  );
}

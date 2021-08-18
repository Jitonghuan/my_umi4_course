/**
 * PublishBranch
 * @description 待发布分支
 * @author moting.nq
 * @create 2021-04-15 10:22
 */

import React, { useState, useContext, useEffect } from 'react';
import { Input, Button, message, Modal, Checkbox, Form, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import HulkTable from '@cffe/vc-hulk-table';
import { history } from 'umi';
import { createTableSchema } from './schema';
import DetailContext from '../../../../../context';
import { createDeploy, updateFeatures, queryEnvsReq } from '../../../../../../service';
import { DeployInfoVO } from '@/pages/application/application-detail/types';
import './index.less';

const rootCls = 'publish-branch-compo';
const { confirm } = Modal;

export interface PublishBranchProps {
  /** 是否有发布内容 */
  hasPublishContent: boolean;
  deployInfo: DeployInfoVO;
  env: string;
  onSearch: (name?: string) => any;
  dataSource: Array<{
    id: string | number;
    branchName: string;
    desc: string;
    createUser: string;
    gmtCreate: string;
  }>;
  /** 提交分支事件 */
  onSubmitBranch: (status: 'start' | 'end') => void;
}

export default function PublishBranch(props: PublishBranchProps) {
  const { hasPublishContent, deployInfo, dataSource, onSubmitBranch, env, onSearch } = props;
  const { appData } = useContext(DetailContext);
  const { appCategoryCode, appCode } = appData || {};
  const [searchText, setSearchText] = useState<string>('');

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [envDataList, setEnvDataList] = useState([]);
  const [deployEnv, setDeployEnv] = useState<any[]>();

  const {
    location: { query },
  } = history;

  const submit = () => {
    const filter = dataSource.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);
    // 如果有发布内容，接口调用为 更新接口，否则为 创建接口
    if (hasPublishContent) {
      return updateFeatures({
        id: deployInfo.id,
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
      isClient: String(query?.isClient) === '1',
    }).then((res: any) => {
      if (!res.success) {
        message.error(res.errorMsg);
        throw Error;
      }
    });
  };

  const submitClick = () => {
    // 二方包
    if (String(query?.isClient) === '1' || hasPublishContent) {
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
      return;
    }

    // 非二方包
    setDeployVisible(true);
  };

  useEffect(() => {
    if (!appCategoryCode) return;
    queryEnvsReq({
      categoryCode: appCategoryCode as string,
      envTypeCode: env,
    }).then((data) => {
      setEnvDataList(data.list);
    });
  }, [appCategoryCode, env]);

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>待发布的分支</div>

      <div className={`${rootCls}__list-wrap`}>
        <div className={`${rootCls}__list-header`}>
          <span className={`${rootCls}__list-header-text`}>分支列表</span>
          <div className={`${rootCls}__list-header-search`}>
            <Input.Search
              placeholder="搜索分支"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => onSearch?.(searchText)}
              onSearch={() => onSearch?.(searchText)}
            />
          </div>
          <span style={{ flex: '1 1 0' }}></span>
          <div className={`${rootCls}__list-header-btns`}>
            <Button type="primary" disabled={!selectedRowKeys?.length} onClick={submitClick}>
              提交分支
            </Button>
          </div>
        </div>
        <HulkTable
          rowKey="id"
          className={`${rootCls}__list-table`}
          dataSource={dataSource}
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

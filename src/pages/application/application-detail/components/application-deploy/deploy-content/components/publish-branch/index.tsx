/**
 * PublishBranch
 * @description 待发布分支
 * @author moting.nq
 * @create 2021-04-15 10:22
 * @modified 2021/08/30 moyan
 */

import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Table, Input, Button, Modal, Checkbox, Tag, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DetailContext from '@/pages/application/application-detail/context';
import { createDeploy, updateFeatures, queryEnvsReq } from '@/pages/application/service';
import { DeployInfoVO } from '@/pages/application/application-detail/types';
import { datetimeCellRender } from '@/utils';
import { listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';
import './index.less';

const rootCls = 'publish-branch-compo';
const { confirm } = Modal;

export interface PublishBranchProps {
  /** 是否有发布内容 */
  hasPublishContent: boolean;
  deployInfo: DeployInfoVO;
  env: string;
  onSearch: (name?: string) => any;
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
}

export default function PublishBranch(publishBranchProps: PublishBranchProps, props: any) {
  const { hasPublishContent, deployInfo, dataSource, onSubmitBranch, env, onSearch } = publishBranchProps;
  const { appData } = useContext(DetailContext);
  const { appCategoryCode, appCode, id } = appData || {};
  const [searchText, setSearchText] = useState<string>('');

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [envDataList, setEnvDataList] = useState<any>([]);
  const [deployEnv, setDeployEnv] = useState<any[]>();

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
        id: deployInfo.id,
        features: filter,
      });
    }

    return await createDeploy({
      appCode: appCode!,
      envTypeCode: env,
      features: filter,
      envCodes: deployEnv,
      isClient: +appData?.isClient! === 1,
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

  const branchNameRender = (branchName: string, record: any) => {
    return (
      <div>
        <Link to={'/matrix/application/detail/branch?' + 'appCode=' + appCode + '&' + 'id=' + id}>{branchName}</Link>
      </div>
    );
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>待发布的分支</div>

      <div className="table-caption">
        <div className="caption-left">
          <h4>分支列表&nbsp;&nbsp;</h4>
          <Input.Search
            placeholder="搜索分支"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
          render={(text: number) => <Tag color={STATUS_TYPE[text]?.color}>{STATUS_TYPE[text]?.text}</Tag>}
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

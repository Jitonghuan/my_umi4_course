// 左侧定位到场景时右侧显示场景详情（用例列表）
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 20:48

import React, { useState, useContext } from 'react';
import { Button, Table, Popover, Popconfirm, Tooltip, Modal } from 'antd';
import FELayout from '@cffe/vc-layout';
import DebounceSelect from '@/components/debounce-select';
import type Emitter from 'events';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from '../../service';
import { postRequest, getRequest } from '@/utils/request';
import { useCaseListByScene } from '../../hooks';
import CaseEditor from '../../_components/case-editor';
import { TreeNode, CaseItemVO, EditorMode } from '../../interfaces';
import SceneExec from '../../_components/scene-exec';

export interface SceneDetailProps extends Record<string, any> {
  emitter: Emitter;
  /** 当前选中的节点 */
  current?: TreeNode;
}

export default function SceneDetail(props: SceneDetailProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [popVisible, setPopVisible] = useState(false);
  const [caseList, loading, setCaseList, reloadCaseList] = useCaseListByScene(props.current?.bizId!);
  const [detailData, setDetailData] = useState<CaseItemVO>();
  const [targetExecNode, setTargetExecNode] = useState<TreeNode>();

  // 加载数据
  const loadOptions = async (keyword: string) => {
    if (!keyword) return [];

    const result = await getRequest(APIS.getPreCaseList, {
      data: {
        keyword: keyword?.trim() || '',
      },
    });

    return (result.data || []).map((n: any) => ({
      value: n.caseId,
      label: `${n.projectName}/${n.moduleName}/${n.apiName}/${n.caseName}`,
      data: n,
    }));
  };

  const updateSceneCase = async (cases: number[]) => {
    await postRequest(APIS.updateSceneCases, {
      data: {
        id: props.current?.bizId,
        cases,
        modifyUser: userInfo.userName,
      },
    });

    // message.success('操作成功！');
    reloadCaseList();
  };

  const handleSelect = async (_: any, item: any) => {
    const idList = caseList.map((n) => n.id);
    updateSceneCase([...idList, item.value]);
  };

  const handleSortItem = (record: any, index: number, dir: -1 | 1) => {
    const idList = caseList.map((n) => n.id);
    const targetIndex = index + dir;

    if (targetIndex < 0 || targetIndex >= idList.length) {
      return false;
    }

    const currId = idList[index];
    const targetId = idList[targetIndex];
    idList[index] = targetId;
    idList[targetIndex] = currId;

    updateSceneCase(idList);
  };

  const handleDelItem = (record: any, index: number) => {
    const idList = caseList.map((n) => n.id);
    idList.splice(index, 1);
    updateSceneCase(idList);
  };

  // 用例编辑前的二次确认
  const confirmBeforeSaveCase = async (mode: EditorMode, payload: any) => {
    const result = await postRequest(APIS.caseHasUsedByScene, {
      data: {
        caseId: detailData?.id,
        sceneId: props.current?.bizId,
      },
    });

    if (!result.data.hasUsed) {
      return true;
    }

    return await new Promise<boolean>((resolve) => {
      Modal.confirm({
        title: '操作确认',
        content: '该用例已经在其它场景中使用到，是否继续保存？',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  return (
    <ContentCard>
      <div className="page-scene-header">
        <h3>{props.current?.title} - 用例列表</h3>
        <s className="flex-air" />
        <Button type="primary" ghost style={{ marginRight: 12 }} onClick={() => setTargetExecNode(props.current)}>
          执行当前场景
        </Button>
        <Popover
          visible={popVisible}
          onVisibleChange={(n) => setPopVisible(n)}
          trigger={['click']}
          content={
            <DebounceSelect
              fetchOnMount
              fetchOptions={loadOptions}
              onSelect={handleSelect}
              style={{ width: '100%' }}
              autoFocus
              suffixIcon={null}
              placeholder="输入用例名搜索"
            />
          }
          placement="bottomLeft"
          overlayInnerStyle={{ width: 300 }}
          overlayStyle={{ width: 300 }}
        >
          <Button type="primary">新增用例</Button>
        </Popover>
      </div>
      <Table dataSource={caseList} pagination={false} loading={loading}>
        <Table.Column title="ID" dataIndex="id" />
        <Table.Column title="项目" dataIndex="projectName" />
        <Table.Column title="模块" dataIndex="moduleName" />
        <Table.Column
          title="接口"
          dataIndex="apiName"
          render={(value: string, record: CaseItemVO) => <Tooltip title={record.apiPath}>{value}</Tooltip>}
        />
        <Table.Column
          title="用例"
          dataIndex="name"
          render={(value: string, record: CaseItemVO) => (
            <Tooltip title={record.desc}>
              <a onClick={() => setDetailData(record)}>{value}</a>
            </Tooltip>
          )}
        />
        <Table.Column
          title="操作"
          render={(_, record: CaseItemVO, index: number) => {
            return (
              <div className="action-cell">
                <a onClick={() => handleSortItem(record, index, -1)} data-disabled={index <= 0}>
                  上移
                </a>
                <a onClick={() => handleSortItem(record, index, +1)} data-disabled={index >= caseList.length - 1}>
                  下移
                </a>
                <Popconfirm title="确定要删除此用例吗？" onConfirm={() => handleDelItem(record, index)}>
                  <a style={{ color: 'red' }}>删除</a>
                </Popconfirm>
              </div>
            );
          }}
          width={160}
        />
      </Table>

      <CaseEditor
        mode={detailData ? 'EDIT' : 'HIDE'}
        initData={detailData}
        onCancel={() => setDetailData(undefined)}
        onSave={() => {
          setDetailData(undefined);
          reloadCaseList();
        }}
        hookBeforeSave={confirmBeforeSaveCase}
      />

      <SceneExec target={targetExecNode} onClose={() => setTargetExecNode(undefined)} />
    </ContentCard>
  );
}

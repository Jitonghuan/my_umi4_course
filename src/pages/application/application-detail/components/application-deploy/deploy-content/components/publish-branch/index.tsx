/**
 * PublishBranch
 * @description 待发布分支
 * @author moting.nq
 * @create 2021-04-15 10:22
 * @modified 2021/08/30 moyan
 */

import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Table, Input, Button, Modal, Checkbox,  Select, Radio, Tabs } from 'antd';
import { ExclamationCircleOutlined, CopyOutlined } from '@ant-design/icons';
import DetailContext from '@/pages/application/application-detail/context';
import { createDeploy, updateFeatures,updateReleaseDeploy } from '@/pages/application/service';
import { listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';
import { useMasterBranchList } from '@/pages/application/application-detail/components/branch-manage/hook';
import './index.less';
import { versionList } from '../../../version-publish/schema';
import { STATUS_TYPE, branchTableSchema, PublishBranchProps } from './schema';
import {  releaseDeploy } from '../../../service';
const rootCls = 'publish-branch-compo';
const { confirm } = Modal;
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
    loading,
    versionData
  } = publishBranchProps;
  const { appData } = useContext(DetailContext);
  const { metadata, branchInfo } = deployInfo || {};
  const { appCategoryCode, appCode, id, feType } = appData || {};
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [envDataList, setEnvDataList] = useState<any>([]);
  const [deployEnv, setDeployEnv] = useState<any[]>();
  const [masterBranchOptions, setMasterBranchOptions] = useState<any>([]);
  const [selectMaster, setSelectMaster] = useState<any>('master');
  const [masterListData] = useMasterBranchList({ branchType: 'master', appCode });
  const [pdaDeployType, setPdaDeployType] = useState('bundles');
  const selectRef = useRef(null) as any;
  const [publishType, setPublishType] = useState<string>('branch');
  const [releaseRowKeys, setReleaseRowKeys] = useState<number>();
 
  const getBuildType = () => {
    let { appType, isClient } = appData || {};
    if (appType === 'frontend') {
      return 'feMultiBuild';
    } else {
      return isClient ? 'beClientBuild' : 'beServerBuild';
    }
  };

  

  const branchColumns: any = useMemo(() => {
    return branchTableSchema({ appData, id, appCode, env }).filter((item) => item.title)
  }, [dataSource])

  const submit = async () => {
    const filter = dataSource.filter((el) => selectedRowKeys.includes(el.id)).map((el) => el.branchName);
    // 如果有发布内容，接口调用为 更新接口，否则为 创建接口
    if (hasPublishContent) {
      if(publishType==="version"){
        return await updateReleaseDeploy({
          deployId: metadata?.id,
          releaseId: releaseRowKeys,
        });

      }
      return await updateFeatures({
        id: metadata?.id,
        features: filter,
      });

    }

    if(publishType==="version"){
      return await   releaseDeploy({
        releaseId: releaseRowKeys,
        pipelineCode,
        envCodes: deployEnv,
        buildType: getBuildType(),
        appCode: appCode!,
        envTypeCode: env,
        deployModel: appData?.deployModel,
      })
    }

    return await createDeploy({
      appCode: appCode!,
      envTypeCode: env,
      features: filter,
      pipelineCode,
      pdaDeployType: feType === 'pda' ? pdaDeployType : '',
      envCodes: deployEnv,
      masterBranch: selectMaster, //主干分支
      buildType: getBuildType(),
      //@ts-ignore
      deployModel: appData?.deployModel,
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
      }else{
        setEnvDataList([]);
      }
    });
  }, [appCategoryCode, env]);
  
  const verisionColumns = useMemo(() => {
    return versionList({
      demandDetail: (value: string, record: any) => {
      }
    })
  }, [])

  const handleChange = (v: any) => {
    selectRef?.current?.blur();
    setSelectMaster(v);
    masterBranchChange(v);
  };

const [defaultKey,setDefaultKey]=useState<number[]>([])
  useEffect(()=>{
    if(versionData?.length>0&&publishType==="version"){
      let key=versionData?.filter((item:any) => item.canPublish===true)
      console.log("key",key)
      if(key?.length>0){
        setReleaseRowKeys(key[0]?.id);
        setDefaultKey([key[0]?.id])
        console.log("[key[0]?.id]",[key[0]?.id])

      }



    }

  },[versionData,publishType])



  const rowSelection = {
    onChange: (selectedRowKeys:any[], selectedRows: any[]) => {
      console.log("selectedRowKeys",selectedRowKeys)
        setReleaseRowKeys(selectedRowKeys[0] as number);
    },
    getCheckboxProps: (record: any) => ({
      disabled: !record?.canPublish, 
      //name: record.name,
    }),
  };


  return (
    <div className={rootCls}>
      <div className={`${rootCls}__title`}>{`待发布内容`}</div>
      <Tabs activeKey={publishType} onChange={(key) => {
         setPublishType(key) 
         }}>
        {/* 发布分支 */}
        <Tabs.TabPane tab='待发布分支' key='branch' >
          <>
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
                    //@ts-ignore
                    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                />
                <h4>开发分支名称：</h4>
                <Input.Search
                  placeholder="搜索分支"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value), changeBranchName(e.target.value)
                  }}
                  onPressEnter={() => onSearch?.(searchText)}
                  onSearch={() => onSearch?.(searchText)}
                />
              </div>
              <div className="caption-right">
                {appData?.deployModel === 'online' && (
                  <Button type="primary" disabled={!selectedRowKeys?.length} onClick={submitClick}>
                    {hasPublishContent ? '追加分支' : '提交分支'}
                  </Button>
                )}
              </div>
            </div>
            <Table
              rowKey="id"
              bordered
              dataSource={dataSource}
              loading={loading}
              pagination={false}
              columns={branchColumns}
              scroll={{ x: '100%' }}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys,
                onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                  setSelectedRowKeys(selectedRowKeys as any);
                },
              }}
            />
          </>
        </Tabs.TabPane>
          {/* 发布版本 */}
        {versionData?.length>0&&env!=="prod"&&(

        <Tabs.TabPane tab='待发布版本' key='version'>
        <>
        <div className="table-caption">
              <div className="caption-left">
                <h3>待发布版本列表</h3>
              </div>
              <div>
              <Button type='primary' disabled={!releaseRowKeys} onClick={()=>{
                  submitClick()
              }}>
                   {hasPublishContent ? '更新发布' : '提交发布'}
                
                </Button>
              </div>
          </div>
      
          <Table
            dataSource={versionData}
            bordered
            rowKey="id"
            defaultSelectedRowKeys={defaultKey}
            pagination={false}
            columns={verisionColumns}
            //@ts-ignore
            rowSelection={{
              type:"radio" ,
              ...rowSelection,
            }}
          />
        </>
      </Tabs.TabPane>

        )}

      
      </Tabs>


      <Modal
        title="选择发布环境"
        visible={deployVisible}
        confirmLoading={confirmLoading}
        onOk={() => {
          setConfirmLoading(true);
          return submit().then(() => {
              setDeployVisible(false);
              onSubmitBranch?.('end');
            }).finally(() => {setConfirmLoading(false)
            
            });
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
          {feType === 'pda' && (
            <div style={{ marginTop: '10px' }}>
              <span>打包类型：</span>
              <Radio.Group onChange={(e) => setPdaDeployType(e.target.value)} value={pdaDeployType}>
                <Radio value="bundles">bundles</Radio>
                <Radio value="apk">apk</Radio>
              </Radio.Group>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

// 项目环境管理新增编辑页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/14 10:30

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { getRequest } from '@/utils/request';
import { useCreateProjectEnv, useUpdateProjectEnv, useEnvList } from '../hook';
import { Drawer, Input, Button, Form, Transfer, Select, Space, Badge } from 'antd';
import { queryAppsList } from '../service';
import './index.less';

export interface EnvironmentListProps {
  mode?: EditorMode;
  initData?: any;
  onClose: () => any;
  onSave: () => any;
}
const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

export default function EnvironmentEditor(props: EnvironmentListProps) {
  const [addEnvironmentForm] = Form.useForm();
  const { mode, initData, onClose, onSave } = props;
  const [ensureLoading, createProjectEnv] = useCreateProjectEnv();
  const [updateProjectEnv] = useUpdateProjectEnv();
  const [loading, envDataSource] = useEnvList();
  const [editDisabled, setEditDisabled] = useState<boolean>(false);
  const [ensureDisabled, setEnsureDisabled] = useState<boolean>(false);
  const [appsListData, setAppsListData] = useState<any>([]);
  const [targetKeys, setTargetKeys] = useState([]); //目标选择的key值
  const [selectedKeys, setSelectedKeys] = useState<any>([]); //已经选择的key值
  const [alreadyAddApps, setAlreadyAddApps] = useState<any>([]); //已选择数据
  let categoryCurrent: any = [];
  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction: any, e: any) => {};
  let getfilterOption = (inputValue: string, option: any) => option?.title?.indexOf(inputValue) > -1;

  const handleOk = () => {
    let selectedAppCode: any = [];

    addEnvironmentForm.validateFields().then((params) => {
      console.log('params', params);
      if (params.categoryCode) {
        appsListData.filter((item: any, index: number) => {
          if (params.categoryCode?.includes(item.key)) {
            selectedAppCode.push(item.title);
          }
        });
        if (categoryCurrent) {
          selectedAppCode.concat(categoryCurrent);
        }
      } else {
        console.log('alreadyAddApps', alreadyAddApps);
        alreadyAddApps?.map((item: any) => {
          selectedAppCode.push(item.title);
        });
      }
      if (mode === 'ADD') {
        let addParamsObj = {
          benchmarkEnvCode: params.benchmarkEnvCode || '',
          projectEnvCode: params.envCode || '',
          projectEnvName: params.envName || '',
          mark: params.mark || '',
          relationApps: selectedAppCode || [],
        };
        createProjectEnv(addParamsObj).then(() => {
          onSave();
        });
      }
      if (mode === 'EDIT') {
        let editParamsObj = {
          projectEnvCode: params.envCode || '',
          mark: params.mark || '',
          relationApps: selectedAppCode || [],
          projectEnvName: params.envName || '',
        };
        updateProjectEnv(editParamsObj).then(() => {
          onSave();
        });
      }
    });
  };

  const queryAppsListData = async (benchmarkEnvCode: string, projectEnvCode?: string) => {
    let canAddAppsData: any = []; //可选数据数组
    let alreadyAddAppsData: any = []; //一进入页面已选数据
    await getRequest(queryAppsList, { data: { benchmarkEnvCode, projectEnvCode } }).then((res) => {
      if (res?.success) {
        let data = res?.data;
        //如果只存在可选数据，不存在目标数据
        if (data.canAddApps && !data.alreadyAddApps) {
          data.canAddApps?.map((item: any, index: number) => {
            canAddAppsData.push({
              key: index.toString(),
              title: item.appCode,
              appType: item.appType,
            });
          });
          setAppsListData(canAddAppsData); //如果只存在可选数据，则可选数据为整体的总数据源
        }
        //如果已选目标数据存在
        if (data.alreadyAddApps) {
          let arry: any = []; //存放整体的数组
          let selectedAppCode: any = []; //已选目标数据数组
          data.canAddApps?.map((item: any, index: number) => {
            canAddAppsData.push({
              key: index.toString(),
              title: item.appCode,
              appType: item.appType,
            }); //如果已选目标数据存在，仍旧先取出可选数据
            arry.push({
              key: index.toString(),
              title: item.appCode,
              appType: item.appType,
            });
          }); //存放整体的数组arry中放入目标数据
          data.alreadyAddApps?.map((item: any, index: number) => {
            arry.push({
              key: arry.length.toString(),
              title: item.appCode,
              appType: item.appType,
            });

            alreadyAddAppsData.push({
              key: index.toString(),
              title: item.appCode,
              appType: item.appType,
            });
          }); //存放整体的数组arry中继续放入已选数据，此时已选数据的key必须唯一且延续上面的可选数据的key值往下
          let arryData = arry;
          setAppsListData(arryData); //将拿到的整体全部数据放入穿梭框的dataSource源
          setAlreadyAddApps(alreadyAddAppsData);
          let keyArry: any = [];
          canAddAppsData.map((item: any) => {
            keyArry.push(item.key);
          }); //取出可选数据中所有的key值
          arryData?.filter((item: any) => {
            if (keyArry.includes(item.key) === false) {
              // selectedAppCode.push({key:item.key,title:item.title})
              categoryCurrent.push(item.title);
              selectedAppCode.push(item.key);
            }
          }); //从整体数据源中筛选，其中不包含可选数据中所有的key值，即为已选数据，则setState目标数据key数组中,视图渲染
          setTargetKeys(selectedAppCode);
        }
      }
    });
  };

  useEffect(() => {
    if (mode === 'ADD') {
      addEnvironmentForm.resetFields();
      setAppsListData([]);
    }
    if (mode === 'VIEW') {
      setEnsureDisabled(true);
      setEditDisabled(true);
    }
    if (mode === 'EDIT') {
      setEditDisabled(true);
    }
    if (mode !== 'HIDE' && mode !== 'ADD') {
      addEnvironmentForm.resetFields();
      if (initData) {
        addEnvironmentForm.setFieldsValue({
          envName: initData?.envName,
          envCode: initData?.envCode,
          benchmarkEnvCode: initData?.relEnvs,
          mark: initData?.mark,
        });
        queryAppsListData(initData?.relEnvs, initData?.envCode);
      }
    }
    return () => {
      setEnsureDisabled(false);
      setEditDisabled(false);
      setTargetKeys([]);
      setSelectedKeys(undefined);
      addEnvironmentForm.setFieldsValue({
        envName: '',
        envCode: '',
        benchmarkEnvCode: '',
        mark: '',
      });
    };
  }, [mode]);

  const selectEnvCode = (value: any) => {
    if (mode === 'ADD') {
      queryAppsListData(value);
    }
    if (mode === 'EDIT') {
      let params = addEnvironmentForm.getFieldsValue();
      queryAppsListData(value, params.envCode);
    }
  };
  const handleClose = () => {
    onClose();
  };
  const handleSearch = (dir: any, value: any) => {
    console.log('search:', dir, value);
  };
  // const getAppType=(appType:string)=>{
  //     let params = addEnvironmentForm.getFieldsValue();
  //     queryAppsListData(params.benchmarkEnvCode, params.envCode,appType);
  // }
  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑项目环境' : mode === 'ADD' ? '新增项目环境' : '查看环境'}
      maskClosable={false}
      onClose={() => onClose()}
      width={'50%'}
      footer={
        <div className="drawer-environ-footer">
          <Space>
            <Button type="primary" onClick={handleOk} disabled={ensureDisabled} loading={ensureLoading}>
              确认
            </Button>
            <Button type="default" onClick={handleClose}>
              取消
            </Button>
          </Space>
        </div>
      }
    >
      <ContentCard className="tmpl-edits">
        <Form labelCol={{ flex: '120px' }} form={addEnvironmentForm}>
          <Form.Item
            label="项目环境名"
            name="envName"
            rules={[{ required: true, message: '环境名必填且不能包含下划线!', pattern: /^((?!\_).)+$/ }]}
          >
            <Input style={{ width: 300 }} placeholder="单行输入"></Input>
          </Form.Item>
          <Form.Item
            label="项目环境CODE"
            name="envCode"
            //  rules={[{ required: true, message: '请输入项目环境CODE!' }]}
            rules={[
              {
                required: true,
                message: '输入的项目环境CODE里请不要包含“dev,test,pre,prod”字符',
                pattern: /^(?!.*dev|.*test|.*prod|.*pre)/,
              },
            ]}
          >
            <Input style={{ width: 300 }} placeholder="单行输入" disabled={editDisabled}></Input>
          </Form.Item>
          <Form.Item
            label="选择基准环境"
            name="benchmarkEnvCode"
            rules={[{ required: true, message: '请输入基准环境!' }]}
          >
            <Select
              style={{ width: 300 }}
              options={envDataSource}
              onChange={selectEnvCode}
              loading={loading}
              placeholder="请通过Code搜索"
              showSearch
              allowClear
              disabled={editDisabled}
            ></Select>
          </Form.Item>
          <Form.Item label="备注：" name="mark">
            <Input.TextArea
              style={{ width: '300px' }}
              placeholder="多行输入"
              disabled={ensureDisabled}
            ></Input.TextArea>
          </Form.Item>
          <p>
            选择应用:
            {/* <span style={{paddingLeft:10}}>
               <Select options={appTypeOptions} placeholder='筛选前端/后端应用' style={{width:256}} onChange={getAppType} allowClear></Select>
             </span> */}
          </p>
          <Form.Item label="选择应用" name="categoryCode" noStyle>
            <Transfer
              dataSource={appsListData}
              titles={['可添加应用', '已添加应用']}
              targetKeys={targetKeys}
              showSearch
              filterOption={getfilterOption}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              onScroll={onScroll}
              disabled={ensureDisabled}
              onSearch={handleSearch}
              render={(item) => (
                <div className="transfer-text">
                  {item.appType === 'backend' ? (
                    <Badge.Ribbon placement="end" text="后端">
                      <span className="transfer-text-backend" title={item.title}>
                        {item.title || ''}
                      </span>
                    </Badge.Ribbon>
                  ) : (
                    <Badge.Ribbon text="前端" color="cyan">
                      <span className="transfer-text-fronted" title={item.title}>
                        {item.title || ''}
                      </span>
                    </Badge.Ribbon>
                  )}
                </div>
              )}
            />
          </Form.Item>
        </Form>
      </ContentCard>
    </Drawer>
  );
}

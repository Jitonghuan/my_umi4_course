import React, { useState, useEffect } from 'react';
import { Spin, Form, Modal, Transfer, Badge, message } from 'antd';
import { getDependencyManageAppListApi, updateAppRuleApi } from '../../service';
import { getRequest, postRequest } from '@/utils/request';
import './index.less';

export interface IProps {
  mode?: EditorMode;
  onClose?: () => any;
  onSave?: () => any;
}

export default function WhiteListModal(props: any) {
  const { mode, onClose, onSave, initData, visible } = props;
  const [createRulesForm] = Form.useForm();
  let categoryCurrent: any = [];
  const [loading, setLoading] = useState<boolean>(false);
  const [ensureLoading, setEnsureLoading] = useState<boolean>(false);
  const [appsListData, setAppsListData] = useState<any>([]);
  const [targetKeys, setTargetKeys] = useState([]); //目标选择的key值
  const [selectedKeys, setSelectedKeys] = useState<any>([]); //已经选择的key值
  const [alreadyAddApps, setAlreadyAddApps] = useState<any>([]); //已选择数据
  const [disabled, setDisabled] = useState<boolean>(false);
  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction: any, e: any) => {};
  let getfilterOption = (inputValue: string, option: any) => option?.title?.indexOf(inputValue) > -1;

  const handleSearch = (dir: any, value: any) => {
    console.log('search:', dir, value);
  };

  useEffect(() => {
    if (mode !== 'HIDE') {
      queryAppsListData();
    }
    return () => {
      setTargetKeys([]);
      setSelectedKeys(undefined);
      setDisabled(false);
      createRulesForm.resetFields();
    };
  }, [mode]);

  const queryAppsListData = async () => {
    let canAddAppsData: any = []; //可选数据数组
    let alreadyAddAppsData: any = []; //一进入页面已选数据
    await getRequest(getDependencyManageAppListApi, { data: { appType: 'backend' } }).then((res) => {
      if (res?.success) {
        let data = res?.data;
        //如果只存在可选数据，不存在目标数据
        if (data.canAddRuleApps && !data.alreadyAddRuleApps) {
          data.canAddRuleApps?.map((item: any, index: number) => {
            canAddAppsData.push({
              key: index.toString(),
              title: item.appCode,
              appType: item.appType,
            });
          });
          setAppsListData(canAddAppsData); //如果只存在可选数据，则可选数据为整体的总数据源
        }
        //如果已选目标数据存在
        if (data.alreadyAddRuleApps) {
          let arry: any = []; //存放整体的数组
          let selectedAppCode: any = []; //已选目标数据数组
          data.canAddRuleApps?.map((item: any, index: number) => {
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
          data.alreadyAddRuleApps?.map((item: any, index: number) => {
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

  const handleOk = () => {
    let selectedAppCode: any = [];

    createRulesForm.validateFields().then((params) => {
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
        alreadyAddApps?.map((item: any) => {
          selectedAppCode.push(item.title);
        });
      }

      let addParamsObj = {
        dependencyRuleApps: selectedAppCode || [],
      };

      addRulesAppsEnv(addParamsObj).then(() => {
        onSave();
      });
    });
  };

  const addRulesAppsEnv = async (addParamsObj: any) => {
    setEnsureLoading(true);
    await postRequest(updateAppRuleApi, { data: addParamsObj })
      .then((res) => {
        if (res?.success) {
          message.success('执行成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setEnsureLoading(false);
      });
  };

  return (
    <Modal
      title="全局白名单"
      visible={mode !== 'HIDE'}
      maskClosable={false}
      width={960}
      onCancel={() => onClose()}
      onOk={() => handleOk()}
    >
      <Spin spinning={loading}>
        <Form form={createRulesForm}>
          <Form.Item label="选择应用" name="categoryCode" noStyle>
            <Transfer
              dataSource={appsListData}
              titles={['未开启白名单应用', '已开启白名单应用']}
              targetKeys={targetKeys}
              showSearch
              filterOption={getfilterOption}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              onScroll={onScroll}
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
      </Spin>
    </Modal>
  );
}

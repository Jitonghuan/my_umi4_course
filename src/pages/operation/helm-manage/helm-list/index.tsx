// helm管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/06/25 14:15

import { useState, useEffect, useMemo } from 'react';
import { history } from 'umi';
import { Input, Table, Form, Button, Space, Select } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { releaseTableSchema } from './schema';
import { queryReleaseList, useDeleteRelease, getClusterList, queryPodNamespaceData } from './hook';
import UpdateDeploy from './update-deploy';

export default function HelmList() {
  const [releaseForm] = Form.useForm();
  const [curRecord, setCurRecord] = useState<any>();
  const [tableLoading, setTableLoading] = useState<any>(false);
  const [tabledataSource, setDataSource] = useState<any>([]);
  const [curClusterName, setCurClusterName] = useState<any>('');
  const [clusterInfo, setClusterInfo] = useState<any>();
  const [mode, setMode] = useState<boolean>(false);
  const [delLoading, deleteRelease] = useDeleteRelease();
  const [clusterOptions, setClusterOptions] = useState<any>([]);
  const [nameSpaceOption, setNameSpaceOption] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentCluster, setCurrentCluster] = useState<any>('');

  useEffect(() => {
   
    initSource()
  }, []);
  const initSource=()=>{
    const localstorageClusterInfo = JSON.parse(localStorage.getItem('__helm_list_cluster') || '{}');
    const localstorageNamespace = JSON.parse(localStorage.getItem('__helm_list_namespace') || '{}');
    if((localstorageClusterInfo?.cluster&&localstorageClusterInfo?.clusterId)){
      getClusterSource({
        clusterName:localstorageClusterInfo?.cluster,
        namespace:localstorageNamespace[0]?localstorageNamespace:"default",
        clusterId:localstorageClusterInfo?.clusterId,
      })
    }else{
      getClusterSource({
        namespace:localstorageNamespace[0]?localstorageNamespace:"default",
      })


    }

  }
  const getClusterSource=(params:{clusterName?:string,namespace?:string,clusterId?:any})=>{
    releaseForm.setFieldValue("namespace",params?.namespace);
    getClusterList().then((res) => {
      setClusterOptions(res);
      let initClusterName=params?.clusterName?params?.clusterName:res[0]?.value;
      let initClusterId=params?.clusterId?params?.clusterId:res[0]?.clusterId
      setCurClusterName(initClusterName);
      queryNameSpace(initClusterId);
      setCurrentCluster(initClusterName);
      setClusterInfo({
        curClusterId: initClusterId,
        curClusterName: initClusterName,
      });
      getReleaseList({ clusterName: initClusterName,namespace:params?.namespace }); });

  }

  const getReleaseList = (paramsObj?: { releaseName?: string; namespace?: string; clusterName?: string }) => {
    setTableLoading(true);
    queryReleaseList(paramsObj)
      .then((res) => {
        setDataSource(res[0]);
        setTotal(res[1]);
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  // 表格列配置
  const tableColumns = useMemo(() => {
    return releaseTableSchema({
      onUpdateClick: (record, index) => {
        setCurRecord(record);
        setMode(true);
      },
      onDetailClick: (record, index) => {
        history.push({
          pathname: 'helm-detail',
          state: {
            record: record,
            curClusterName: curClusterName,
          },
        });
      },
      onDelClick: async (record, index) => {
        await deleteRelease({
          releaseName: record?.releaseName,
          namespace: record?.namespace,
          clusterName: curClusterName,
        }).then(() => {
          getReleaseList({
            clusterName: curClusterName,
          });
        });
      },
    }) as any;
  }, [curClusterName]);
  //查询nameSpace
  const queryNameSpace = (value: any) => {
    queryPodNamespaceData({ clusterId: value }).then((res) => {
      setNameSpaceOption(res);
    });
  };

  const changeClusterName = (cluster: any) => {
    const params = releaseForm.getFieldsValue();
    setCurrentCluster(cluster);
    setCurClusterName(cluster);
    const curClusterOption = clusterOptions?.filter((item: any) => {
      if (item.value === cluster) return item?.clusterId;
    });
    queryNameSpace(curClusterOption[0].clusterId);
    setClusterInfo({
      curClusterId: curClusterOption[0].clusterId,
      curClusterName: cluster,
    });
    const localStorageObj={
      cluster,
      clusterId:curClusterOption[0].clusterId
    }
    localStorage.setItem('__helm_list_cluster', JSON.stringify(localStorageObj) );
    getReleaseList({ releaseName: params.releaseName, namespace: params.namespace, clusterName: cluster });
  };
  const changeNamespace=(namespace:string)=>{
    localStorage.setItem('__helm_list_namespace', JSON.stringify(namespace) );
  }

  //触发分页
  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    setPageSize(pagination.pageSize);

    loadListData(obj);
  };

  const loadListData = (params: any) => {
    let value = releaseForm.getFieldsValue();
    getReleaseList({ ...params, ...value, clusterName: curClusterName });
  };

  return (
    <PageContainer>
      <UpdateDeploy
        mode={mode}
        curRecord={curRecord}
        curClusterName={curClusterName}
        onCancle={() => {
          setMode(false);
        }}
        onSave={() => {
          setMode(false);
          initSource()
        }}
      />

      <FilterCard>
        <Form
          layout="inline"
          form={releaseForm}
          onFinish={(values: any) => {
            getReleaseList({
              ...values,
              clusterName: curClusterName,
            });
          }}
          onReset={() => {
            releaseForm.resetFields();
            getReleaseList({ clusterName: curClusterName });
          }}
        >
          <div style={{ marginRight: 10 }}>
            <span>
              <b>选择集群：</b>
            </span>
            <Select
              options={clusterOptions}
              style={{ width: 190 }}
              allowClear
              showSearch
              value={currentCluster}
              onChange={changeClusterName}
            />
          </div>
          <Form.Item label="命名空间" name="namespace">
            <Select
              placeholder="请输入命名空间"
              showSearch
              allowClear
              style={{ width: 290 }}
              options={nameSpaceOption}
              onChange={changeNamespace}
            />
          </Form.Item>
          <Form.Item label="名称：" name="releaseName">
            <Input placeholder="请输入名称" style={{ width: 290 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset">
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>发布列表</h3>
          </div>
          <div className="caption-right">
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setCurRecord(undefined);
                  history.push({
                    pathname: 'create-chart',
                    state: clusterInfo,
                  });
                }}
              >
                + 创建
              </Button>
            </Space>
          </div>
        </div>

        <div>
          <Table
            columns={tableColumns}
            dataSource={tabledataSource}
            loading={tableLoading}
            bordered
            pagination={{
              // current: taskTablePageInfo.pageIndex,
              total: total,
              pageSize: pageSize,
              showSizeChanger: true,
              showTotal: () => `总共 ${total} 条数据`,
            }}
            onChange={pageSizeClick}
          ></Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}

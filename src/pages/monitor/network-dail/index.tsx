import React, { useMemo, useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { createTableColumns} from './schema';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { Button, Space, Form, Table, Select, Input,message } from 'antd';
import EditDail from './edit-dail';
import {history} from 'umi'
import { getNetworkProbeList, tableItems } from './edit-dail/hook'
import { useGetNetworkProbeType, useGetCluster, useDelNetworkProbe,networkProbeStatus } from './edit-dail/hook'
import './index.less'
export default function NetworkDail() {
    const [listForm] = Form.useForm();
    const [curRecord, setcurRecord] = useState<any>({});
    const [mode, setMode] = useState<EditorMode>('HIDE');
    const [dailTypesLoading, dailTypes, getNetworkProbeProbeType] = useGetNetworkProbeType()
    const [clusterLoading, clusterData, getCluster] = useGetCluster()
    const [delLoading, deleteNetworkProbe] = useDelNetworkProbe()
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [tableLoading, setTableLoading] = useState<any>(false);
    const [dataSource, setDataSource] = useState<any>([]);
    useEffect(() => {
        getNetworkProbeProbeType()
        getCluster()


    }, [])
    useEffect(()=>{
        if(clusterData?.length>0){
            listForm.setFieldsValue({
                clusterName:clusterData[0]?.value
            })
            getList({
                clusterName:clusterData[0]?.value 
            })
          

        }
    },[clusterData])
    const saveDail=(clusterName:string)=>{
        listForm.setFieldsValue({
            clusterName
        })
        let params = listForm.getFieldsValue()
       
        getList({
            ...params,
            clusterName
        })
    }
    const columns = useMemo(() => {

        return createTableColumns({
            delLoading,
            onEdit: (record, index) => {
                setcurRecord(record);
                setMode('EDIT');
            },
            // onView: (record, index) => {
            //     history.push({
            //         pathname: '/matrix/monitor/detail',
            //         search: `?url=${encodeURIComponent(record.graphUrl)}&clusterName=${record?.clusterName}&fromPage=network-dail`,
            //       });
            // },
            onDelete: async (id) => {
                deleteNetworkProbe(id).then(() => {
                    let params = listForm.getFieldsValue()
                    getList({ ...params, }); 
                   
                })

            },
            onSwitch:(record, index)=>{
                networkProbeStatus({id:record?.id,status:record?.status===0?1:0}).then((res)=>{
                    if(res?.success){
                       message.success("操作成功！") 
                       let params = listForm.getFieldsValue()
                    getList({ ...params, }); 
                   

                    }
                })
            }

        }) as any;
    }, []);

    //触发分页
    const pageSizeClick = (pagination: any) => {
        setPageIndex(pagination.current);
        let obj = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
        };
        setPageSize(pagination.pageSize);
        let params = listForm.getFieldsValue()
        loadListData({...obj,...params});
    };

    const loadListData = (params: any) => {
        let value = listForm.getFieldsValue();
        getList({ ...params, ...value, });
    };

    const getList = (paramsObj?: tableItems) => {
        setTableLoading(true);
        getNetworkProbeList(paramsObj)
            .then((result) => {
                setDataSource(result?.dataSource);
                setTotal(result?.pageInfo?.total);
                setPageIndex(result?.pageInfo?.pageIndex);
                setPageSize(result?.pageInfo?.pageSize)
          
            })
            .finally(() => {
                setTableLoading(false);
            });
    };
    return (<PageContainer className="network-dail">
         <EditDail mode={mode} curRecord={curRecord} onSave={(clusterName:string)=>{setMode("HIDE");
        //    let value = listForm.getFieldsValue();
        //    getList({ ...value, }); 
        saveDail(clusterName)
        }} onClose={()=>{setMode("HIDE")}}/>
        <FilterCard>
            <Form
                layout="inline"
                form={listForm}
                onFinish={(values: any) => {
                    setPageIndex(pageIndex);

                    getList({
                        ...values,

                    });
                }}
             
            >
                <Form.Item label="选择集群" name="clusterName">

                    <Select
                        options={clusterData}
                        style={{ width: 190 }}
                        loading={clusterLoading}
                        showSearch
                        onChange={(clusterName)=>{
                            let value = listForm.getFieldsValue();
                            getList({clusterName, ...value, }); 

                        }}
                    />
                </Form.Item>
                <Form.Item label="拨测名称" name="probeName">
                    <Input placeholder="请输入名称" style={{ width: 220 }} />
                </Form.Item>
                <Form.Item label="拨测地址" name="probeUrl">
                    <Input placeholder="请输入地址" style={{ width: 220 }} />
                </Form.Item>
                <Form.Item label="拨测类型" name="probeType">

                    <Select
                        options={dailTypes}
                        style={{ width: 190 }}
                        loading={dailTypesLoading}
                        showSearch
                        allowClear
                    />
                </Form.Item>
                <Form.Item label="状态" name="status">
                    <Input placeholder="请输入名称" style={{ width: 200 }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        查询
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="ghost" onClick={()=>{
                          const values = listForm.getFieldsValue() || {};
                          const valueList = Object.keys(values).map((v) => v);
                          listForm.resetFields([...valueList.filter((v) => v !== 'clusterName')]);
                          let clusterName = listForm.getFieldValue("clusterName");    
                          getList({clusterName}); 

                    }}>
                        重置
            </Button>
                </Form.Item>
            </Form>
        </FilterCard>
        <ContentCard>
            <div className="table-caption">
                <div className="caption-left">
                    <h3>网络拨测列表</h3>
                </div>
                <div className="caption-right">
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => {
                                setMode('ADD');
                            }}
                        >
                            + 新增拨测
                      </Button>
                    </Space>
                </div>
            </div>

            <div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={tableLoading||delLoading}
                    bordered
                    pagination={{
                        onShowSizeChange: (_, size) => {
                            setPageSize(size);
                            setPageIndex(1); //
                          },
                        current: pageIndex,
                        total: total,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        showTotal: () => `总共 ${total} 条数据`,
                    }}
                    onChange={pageSizeClick}
                ></Table>
            </div>
        </ContentCard>
    </PageContainer>)
}
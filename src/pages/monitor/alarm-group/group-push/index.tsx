import React, { useState, useEffect,useMemo } from 'react';
import { Button, Tooltip, Table, Tag,Form,Space,Popconfirm } from 'antd';
import TableSearch from '@/components/table-search';
import {createTableColumns} from './schema'
import PageContainer from '@/components/page-container';
import { history, useLocation} from 'umi';
import { getCluster} from '../../../monitor/current-alarm/service';
import {usePushAlertGroup} from '../hook'
import { queryGroupList, queryRulesList } from '../../basic/services';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import useTable from '@/utils/useTable';
export default function AlarmPush(){
    const [form] = Form.useForm();
    let location = useLocation();
    const curRecord: any = location.state?.record || {};
    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
    const [loading, pushAlertGroup]=usePushAlertGroup()
    const [clusterList, setClusterList] = useState<any>([]);
    const columns = useMemo(() => {
        return createTableColumns() as any;
      }, []);
      useEffect(()=>{
        getCluster().then((res)=>{
            if(res?.success){
              const data=res?.data?.map((item: any)=>{
                return {
                
                  label:item.clusterName,
                  value:item.id,
                  key:item.id,
                }
              })
            
      
              setClusterList(data);
            }
      
          })
      },[])
      // const typeOptions = [
      //   { key: 'announcement', label: '公告', value: 'announcement' },
      //   { key: 'document', label: '文件', value: 'document' },
      //   {key:"versionInfo",label:"版本信息",value:"versionInfo"},
      const typeOptions=     [
          {
              "label": "前端单应用测试环境",
              "value": "11",
              "key": "11"
          },
          {
              "label": "天台POC",
              "value": "2",
              "key": "2"
          },
          {
              "label": "天台生产-ACK",
              "value": "7",
              "key": "7"
          },
          {
              "label": "巍山生产",
              "value": "3",
              "key": "3"
          },
         
      ]
      // ];
    const {
        tableProps,
        search: { submit, reset },
      } = useTable({
        url: `${queryRulesList}`,
        method: 'GET',
        form,
        formatter: (params) => {
          return {
            ...params,
          };
        },
        formatResult: (result) => {
          return {
            total: result.data?.pageInfo?.total,
            list: result.data?.dataSource || [],
          };
        },
      });
    return(
 <PageContainer>
{console.log("clusterList",clusterList)}
      <TableSearch
        form={form}
        rowKey="id"
        bordered
        formOptions={[
          {
            key: '1',
            type: 'select',
            label: '集群选择',
            dataIndex: 'clusterId',
            width: '160px',
            placeholder: '请选择',
            showSelectSearch: true,
            option:clusterList,
            renderLabel:true,
            rules:[]
          },
          
        
          {
            key: '2',
            type: 'select',
            label: '关联应用',
            dataIndex: 'appCode',
            width: '200px',
            placeholder: '请选择',
            option: typeOptions,
            showSelectSearch: true,
            renderLabel:true,
            rules:[]
          },
          {
            key: '3',
            type: 'input',
            label: '报警名称',
            dataIndex: 'name',
            width: '200px',
          
          },
          {
            key:'4',
            type:"select",
            label:"状态",
            dataIndex:"status",
            renderLabel:true,
            rules:[],
            option:[
              { label: '已启用', value: 0,key:0},
              { label: '已关闭', value: 1,key:0 },            ]
          }
        ]}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          // size: 'small',
          defaultPageSize: 20,
        }}
        rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
              setSelectedRowKeys(selectedRowKeys as any);
            },
          }}
        extraNode={
            <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div className="caption-left">
                <h3>报警列表</h3>
                </div>
                <div className="caption-right">
                    当前报警分组：<Tag color="geekblue">{curRecord?.groupName}</Tag>
                </div>

            </Space>
         
          
           
        }
        bottomRender={
            <div style={{display:"flex",justifyContent:"flex-end"}}>
            <Space>
                <Popconfirm  title="确认推送吗?"  onConfirm={()=>{
                    pushAlertGroup({
                        alertGroupId:curRecord?.id,
                        monitorRules:selectedRowKeys
                    }).then(()=>{

                    })
                }}>
                <Button type="primary" loading={loading}>
                    推送
                </Button>

                </Popconfirm>
                
                <Button onClick={()=>{
                      setSelectedRowKeys([]);
                }}>
                   取消
                </Button>
            </Space>
  
        </div>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        // scroll={tableProps.dataSource.length > 0 ? { x: '100%' } : {}}
        searchText="查询"
      />
      
     
       
        </PageContainer>

    )
}
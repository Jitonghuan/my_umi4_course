import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Table, Tag,Form,Space,Popconfirm } from 'antd';
import TableSearch from '@/components/table-search';
import {history} from 'umi'
import {viewAlertGroup} from './service';
import {useDeleteAlertGroup} from './hook'
import useTable from '@/utils/useTable';
import GroupEditor from './group-editor'
export default function AlarmGroup(){
    const [form] = Form.useForm();
    const [delLoading, deleteAlertGroup]=useDeleteAlertGroup();
    const [mode,setMode]=useState<EditorMode>("HIDE")
    const [curRecord,setCurRecord]=useState<any>([])
    const columns=[ {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '4%',
      },
      {
        title: '分组名称',
        dataIndex: 'groupName',
        key: 'groupName',
        width: '10%',
      },
      {
        title: '分组用户',
        dataIndex: 'groupUser',
        key: 'groupUser',
        width: '26%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: 'DingToken',
        dataIndex: 'dingToken',
        key: 'dingToken',
        width: '24%',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '14%',
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        width: '12%',
        render: (_: string, record, index: number) => (
          //根据不同类型跳转
          <Space>
            <a onClick={() => {
                setMode("VIEW")
                setCurRecord(record)
            }}>详情</a>
            <a onClick={() => {  setMode("EDIT");  setCurRecord(record)}}>编辑</a>
            <a onClick={() => {
                history.push({
                    pathname:"/matrix/monitor/alarm-rules/group-push"
                },{
                    record  
                })
            }}>推送</a>
            <Popconfirm
              title="确认删除?"
              onConfirm={() => {
                deleteAlertGroup(record?.id).then(()=>{
                    submit()
                })
              }}
            >
              <a style={{color:"red"}}>删除</a>
            </Popconfirm>
          </Space>
        ),
      },
     ]
    const {
        tableProps,
        search: { submit, reset },
      } = useTable({
        url: `${viewAlertGroup}`,
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
        <>
        <GroupEditor 
        mode={mode}  
        initData={curRecord} 
        onClose={()=>{setMode("HIDE")}} 
        onSave={()=>{setMode("HIDE")
        submit()
    }}/>

      <TableSearch
        form={form}
        bordered
        formOptions={[
          {
            key: '1',
            type: 'input',
            label: '分组名称',
            dataIndex: 'groupName',
            width: '200px',
          },
          {
            key: '2',
            type: 'input',
            label: '分组用户',
            dataIndex: 'groupUser',
            width: '200px',
          },
          {
            key: '3',
            type: 'input',
            label: 'DingToken',
            dataIndex: 'dingToken',
            width: '400px',
          },
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
        extraNode={
            <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="caption-left">
              <h3>报警分组列表</h3>
              </div>
              <div className="caption-right">
                  <Button type="primary" onClick={() => {  setMode("ADD")}}>+ 新增分组</Button>

              </div>

          </Space>
           
           
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        // scroll={tableProps.dataSource.length > 0 ? { x: '100%' } : {}}
        searchText="查询"
      />
       
        </>

    )
}
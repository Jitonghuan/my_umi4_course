import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Form, Modal, Table, Space, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import MonacoSqlEditor from '@/components/monaco-sql-editor';
import AceEditor from '@/components/ace-editor';
import moment from 'moment';
import { debounce } from 'lodash';
import detailContext from '../../context';
import { releaseAppRel } from '../../../service';
import './index.less'
interface Iprops{
    activeTab:string;
    detailInfo:any
    infoLoading:boolean
  

}

export default function ModifyApp(props: Iprops) {
    const { activeTab,detailInfo,infoLoading } = props;
    const { categoryCode, releaseId } = useContext(detailContext);
    const [visible, setVisible] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('hide');
    const [curRecord, setCurRecord] = useState<any>({});
    const [dataSource,setDataSource]=useState<any>([])
    const [loading,setLoading]=useState<boolean>(false)
    const [form] = Form.useForm();
    const [originData, setOriginData] = useState<any>([]);
    const filter = debounce((value) => filterData(value), 500)

    const filterData = (value: string) => {
        if (!value) {
            setDataSource(originData);
            return;
        }
        const data = JSON.parse(JSON.stringify(dataSource));
        const afterFilter: any = [];
        data.forEach((item: any) => {
            if (item.title?.indexOf(value) !== -1) {
                afterFilter.push(item);
            }
        });

        setDataSource(afterFilter);
    }
    const getDataSource=()=>{
        setLoading(true)
        releaseAppRel({releaseId}).then((res)=>{
            if(res?.success){
                let data:any=[];
                (res?.data)?.map((ele:any)=>{
                    console.log("Object.keys(ele?.config)",ele)
                    data.push({
                        ...ele,
                        configInfo:Object.keys(ele?.config)?.length,
                        sqlInfo:Object.keys(ele?.sql)?.length,
                        resourceAddrInfo:Object.keys( ele?.resourceAddr)?.length,
        
                    })
        
                })
                setDataSource(data)
                setOriginData(data)

            }else{
                setDataSource([])
                setOriginData([])

            }

        }).finally(()=>{
            setLoading(false)

        })
    }
   
    

     const frontTotal = useMemo(() => (dataSource || []).filter((item: any) => item.appType !== 'backend').length, [JSON.stringify(dataSource)])
     const backendTotal = useMemo(() => (dataSource || []).filter((item: any) => item.appType === 'backend').length, [JSON.stringify(dataSource)])
    
    useEffect(()=>{
        getDataSource()
       

    },[releaseId,activeTab])

    const columns = [
        {
            title: '应用CODE',
            dataIndex: 'appCode',
            width: 120,
        },
        {
            title: '应用类型',
            dataIndex: 'appType',
            width: 80,
            render: (value: string) => <span>{value === 'backend' ? '后端' : '前端'}</span>
        },
        {
            title: '变更内容',
            dataIndex: 'resourceAddrInfo',
            width: 100,
            render: (value: any, record: any) => <a onClick={() => { clickRow('content', record) }}>{value}</a>
        },
        {
            title: '变更配置',
            dataIndex: 'configInfo',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { clickRow('config', record) }}>{value}</a>
        },
        {
            title: '变更SQL',
            dataIndex: 'sqlInfo',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { clickRow('sql', record) }}>{value}</a>
        },
        {
            title: '应用版本状态',
            dataIndex: 'appStatus',
            width: 120,
            render:(value: string, record: any)=><span style={{color:value==="内容开发"?"#209EA5":value==="出包完成"?"#58A55C":"gray"}}>{value}</span>
        },
        {
            title: '版本Tag',
            dataIndex: 'tag',
            width: 120,
        },
        {
            title: '出包时间',
            dataIndex: 'publishTime',
            width: 120,
            render:(value:string)=><span>{moment(value).format("YYYY-MM-DD HH:mm:ss") || '--'}</span>
        },
        {
            title: '出包人',
            dataIndex: 'publishUser',
            width: 120,
        },
    ]

    const modalColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 160,
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: 120,
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220,
        },
        {
            title: '关联分支',
            dataIndex: 'feature',
            width: 220,
        },

    ]

    const clickRow = (type: string, record: any) => {
        setCurRecord(record);
        setMode(type);
        if(type==="config"){
            form.setFieldsValue({
                config:record?.config
            })

        }
    }
    return (
        <>
            <div className='table-top'>
                <div className='flex-space-between'>
                    <Space>
                        <span>应用总数：{dataSource?.length}</span>
                        <span>前端应用：{frontTotal}</span>
                        <span>后端应用：{backendTotal}</span>
                    </Space>
                    <div>
                        <Tooltip title='请输入应用CODE进行搜索' placement="top">
                            <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                        </Tooltip>
                        查询：
                        <input
                            style={{ width: 200 }}
                            placeholder='输入内容进行查询过滤'
                            className="ant-input ant-input-sm"
                            onChange={(e) => {
                                filter(e.target.value)
                            }}
                        ></input>
                    </div>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                loading={loading}
                bordered
                rowKey="id"
                pagination={false}
                columns={columns}
            ></Table>

            <Modal
                visible={mode !== 'hide'}
                title={curRecord?.code || ''}
                onCancel={() => { setMode('hide') }}
                width={900}
                footer={null}
                destroyOnClose
            >
                <div className='modify-app-modal'>
                    {mode === 'content' &&
                        <Table
                            dataSource={[]}
                            // loading={loading || updateLoading}
                            bordered
                            rowKey="id"
                            pagination={false}
                            columns={modalColumns}
                        ></Table>}
                    {mode === 'config' &&
                        <Form form={form} preserve={false}>
                            <Form.Item name="config">
                                <AceEditor mode="yaml" height={500} />
                            </Form.Item>
                        </Form>
                    }
                    {mode === 'sql' &&
                        <div className='modal-sql-container'>
                            <MonacoSqlEditor
                                isSqlExecuteBtn={false}
                                isSqlBueatifyBtn={false}
                                isSqlExecutePlanBtn={false}
                                tableFields={{}}
                                initValue={'initData'}
                                implementDisabled={false}
                            />
                        </div>}
                </div>
            </Modal>
        </>
    )
}
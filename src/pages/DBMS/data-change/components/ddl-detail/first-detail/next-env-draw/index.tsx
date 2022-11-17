// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect, useRef,useContext } from 'react';
import { Drawer, Form, Button, Select, Radio, Space, DatePicker,message } from 'antd';
import { ScheduleOutlined, } from '@ant-design/icons';
import moment from "moment";
import AceEditor from '@/components/ace-editor';
import type { RadioChangeEvent } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { START_TIME_ENUMS, options, sqlWfTypeOptions } from "../../../change-apply/schema"
import DetailContext from '../../context';
import {createNextDDL} from '../hook'
import { useEnvList, useInstanceList, useQueryDatabasesOptions, useQueryTableFieldsOptions, useQueryTablesOptions } from '../../../../../common-hook'
import './index.less'


export interface IProps {
    mode?: EditorMode;
    initData?: any;
    onClose: () => any;
    onSave: () => any;
    label?: any
    sqlContent?: string
    nextEnvType?:string
}
const { RangePicker } = DatePicker;
export default function CreateArticle(props: IProps) {
    const { mode, initData, onClose, onSave, label, sqlContent,nextEnvType } = props;
    const [editForm] = Form.useForm();
    const [instanceLoading, instanceOptions, getInstanceList] = useInstanceList();
    const [databasesOptionsLoading, databasesOptions, queryDatabases, setSource] = useQueryDatabasesOptions()
    const { tabKey ,changeTabKey,parentWfId} = useContext(DetailContext);
    const [startTime, setStartTime] = useState<string | null>(null)
    const [endTime, setEndTime] = useState<string | null>(null)
    const [type, setType] = useState<string>("time-interval");
    const [value, setValue] = useState(false);
    const [loading,setLoading]=useState<boolean>(false)
    const [envOptionLoading, envOptions, queryEnvList] = useEnvList();
    useEffect(() => {

       
        return () => {
            setEndTime("")
            setType("time-interval")
        }

    }, [])
   
    useEffect(() => {
        if (mode === "EDIT") {

            editForm.setFieldsValue({
               
                sqlContent
            })
            queryEnvList(label.value)
        

        }

    }, [mode])


    const handleSubmit = () => {
        if(!endTime||!startTime){
            message.warning("请选择时间再提交！")
            return

        }
        setLoading(true)
        const params = editForm.getFieldsValue();
        createNextDDL({
            ...params,
            runEndTime: endTime,
            runStartTime: startTime,
            allowTiming:value,
            parentWfId:parentWfId,
            envType:label.value
        }).then((res)=>{
            if (res?.success) {
                message.success("提交成功！")
                onSave()
                changeTabKey?.(label.value)  
              } 

        }).finally(()=>{
            setLoading(false)
        })



        

    };
    const onClear = () => {
        setStartTime(null)
        setEndTime(null)
    }

    const onAllowChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue(value);
    };
    //选择时间间隔
    const selectTime = (time: any, timeString: any) => {
        let start = moment(timeString[0]).add(2, "minutes").format("YYYY-MM-DD HH:mm:ss")
        let end = moment(timeString[1]).add(2, "minutes").format("YYYY-MM-DD HH:mm:ss")
        if (start !== 'NaN' && end !== 'NaN') {
            setStartTime(start);
            setEndTime(end);
        }
    }

    const selectTimeInterval = (timeValue: number) => {
        const now = new Date().getTime();
        let end = moment(Number((now + timeValue))).format("YYYY-MM-DD HH:mm:ss");
        let start = moment(Number(now)).format("YYYY-MM-DD HH:mm:ss");
        setStartTime(start)
        setEndTime(end)
    }

    return (
        <Drawer
            width={1000}
            title={`下个环境是-${label.label}`}
            placement="right"
            visible={mode !== 'HIDE'}
            destroyOnClose
            onClose={onClose}
            maskClosable={false}
            footer={
                <div className="drawer-footer">
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        保存
                    </Button>
                    <Button type="default" onClick={onClose}>
                        取消
                    </Button>
                </div>
            }
        >
            <Form form={editForm} labelCol={{ flex: '140px' }} preserve={false}>
                <Form.Item name="envCode" label="环境：" rules={[{ required: true, message: '请填写' }]}>
                    <Select placeholder="选择环境" style={{ width: 300 }} allowClear showSearch loading={envOptionLoading} options={envOptions} onChange={(value) => {
                        getInstanceList(value)
                        editForm?.setFieldsValue({
                            instanceId: "",
                            dbCode: "",
                            tableCode: ""
                        })
                    }} />
                </Form.Item>
                <Form.Item name="instanceId" label="实例：" rules={[{ required: true, message: '请填写' }]}>
                    <Select placeholder="选择实例" style={{ width: 300 }} options={instanceOptions} allowClear showSearch loading={instanceLoading} onChange={(instanceId) => {
                        queryDatabases({ instanceId })
                        editForm?.setFieldsValue({
                            dbCode: "",
                            tableCode: ""
                        })


                    }} />
                </Form.Item>


                <Form.Item name="dbCode" label="库：" rules={[{ required: true, message: '请填写' }]}>
                    <Select placeholder="选择库" style={{ width: 300 }} options={databasesOptions} allowClear showSearch loading={databasesOptionsLoading} />
                </Form.Item>
                <Form.Item label="执行时间：" className="nesting-form-item">
                    <Space style={{ height: 20 }}>
                        {type === "time-interval" ? (<Form.Item name="versionRangeOne" rules={[{ required: true, message: '请选择' }]} >
                            <Select options={START_TIME_ENUMS} allowClear showSearch onChange={selectTimeInterval} onClear={onClear} style={{ width: 220 }} />
                        </Form.Item>) : <Form.Item name="rangeDate"  >
                            <RangePicker
                                style={{ width: 340 }}
                                onChange={(v: any, b: any) => selectTime(v, b)}
                                showNow={false}
                                format="YYYY-MM-DD HH:mm:ss" showTime />
                        </Form.Item>}

                        {type === "time-interval" ? (
                            <Form.Item>
                                <ScheduleOutlined style={{ marginLeft: '5px', fontSize: 18, }} onClick={() => {
                                    setType("time-ranger")

                                    setEndTime(null)
                                    setStartTime(null)
                                    editForm.setFieldsValue({

                                        versionRangeOne: null
                                    })


                                }} />
                            </Form.Item>

                        ) : (
                            <Form.Item>
                                <ScheduleOutlined style={{ marginLeft: '5px', fontSize: 18 }} onClick={() => {

                                    setType("time-interval")
                                    setEndTime(null)
                                    setStartTime(null)
                                    editForm.setFieldsValue({

                                        versionRangeOne: null
                                    })
                                }} />
                            </Form.Item>
                        )}


                    </Space>

                </Form.Item>

                <Form.Item name="allowTiming" label="是否允许定时执行:" rules={[{ required: true, message: '请填写' }]}>
                    <Radio.Group options={options} onChange={onAllowChange} value={value} />
                </Form.Item>
                <Form.Item name="sqlContent" label="变更sql" rules={[{ required: true, message: '这是必填项' }]}>
                    <AceEditor mode="sql" height={'500px'} readOnly={true} />
                </Form.Item>



            </Form>
        </Drawer>
    );
}

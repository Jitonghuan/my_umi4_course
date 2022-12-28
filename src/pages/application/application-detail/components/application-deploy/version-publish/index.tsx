
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Spin, Modal } from 'antd';
import DetailContext from '@/pages/application/application-detail/context';
import { getAppPublishList } from '../service';
import AceEditor from '@/components/ace-editor';
import { history } from 'umi';
import { FeContext } from '@/common/hooks';
import { optionsToLabelMap } from '@/utils/index';
import { stringify } from 'query-string';
import moment from 'moment';
import './index.less';
interface Iprops {
    pipelineCode: string;
    envTypeCode: string;
    isActive: boolean;
    visible: boolean;
}
const rootCls = 'version-deploy-page';
export default function VersionPublish(props: Iprops) {
    const { pipelineCode, envTypeCode, isActive, visible } = props;
    const { categoryData = [], businessData = [] } = useContext(FeContext);
    const categoryDataMap = useMemo(() => optionsToLabelMap(categoryData), [categoryData]);
    const { appData } = useContext(DetailContext);
    const { appCode } = appData || {};
    const [infoDetail, setInfoDetail] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [infoVisible, setInfoVisible] = useState<boolean>(false)
    const [type, setType] = useState<string>("")
    useEffect(() => {
        if (!appCode) return;
        queryDataSource(appCode)
    }, [appCode])

    const queryDataSource = (appCode: string) => {
        setLoading(true)

        getAppPublishList(appCode).then((res) => {
            if (res?.success) {
                if (res?.data?.length > 0) {
                    let length = res?.data?.length;
                    let dataSource = res?.data;
                    if (typeof (dataSource[0]) === "object" && Object.keys(dataSource[0])?.length > 0) {
                        setInfoDetail(dataSource[0])
                    } else {
                        setInfoDetail({})
                    }
                    // const i = dataSource.findIndex((item: any,index:number) => index === length-1);
                    // if(i!==-1){
                    //     setInfoDetail(dataSource[i])
                    // }else{
                    //     setInfoDetail({})
                    // }



                }

            }

        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        if (!appCode) return;
        let intervalId = setInterval(() => {
            if (appData?.appCode && envTypeCode === "version") {
                queryDataSource(appCode);
            }
        }, 8000);

        return () => {
            intervalId && clearInterval(intervalId);
        };
    }, [envTypeCode, appCode]);
    return (
        <div className='version-publish-page'>
            {/* 发布详情 */}
            {/* <Spin spinning={loading}> */}
            <Descriptions
                title="发布详情"
                labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap', width: 120 }}
                contentStyle={{ color: '#000' }}
                column={3}
                bordered
            >
                <Descriptions.Item label="版本号" contentStyle={{ whiteSpace: 'nowrap' }}>
                    <a onClick={() => {
                        // 跳转到版本详情
                        history.push({
                            pathname: '/matrix/version-manage/detail',
                            search: stringify({ key: 'list', version: infoDetail?.releaseNumber, releaseId: infoDetail?.releaseId, categoryName: categoryDataMap[appData?.appCategoryCode!] || '--', categoryCode: appData?.appCategoryCode })
                        })
                    }}> {infoDetail?.releaseNumber || '--'}</a>
                </Descriptions.Item>
                {/* <Descriptions.Item label="变更需求" > {infoDetail?.releaseNumber||'--'}</Descriptions.Item> */}
                <Descriptions.Item label="变更配置"><a onClick={() => {
                    setInfoVisible(true)
                    setType('config')
                }}>{infoDetail?.config ? "是" : "否"}</a> </Descriptions.Item>
                <Descriptions.Item label="变更SQL" > <a onClick={() => {
                    setInfoVisible(true)
                    setType('sql')
                }}>{infoDetail?.sql ? "是" : "否"}</a></Descriptions.Item>
                <Descriptions.Item label="版本TAG"> {infoDetail?.tag || '--'}</Descriptions.Item>
                <Descriptions.Item label="发布人"> {infoDetail?.createUser || '--'}</Descriptions.Item>
                <Descriptions.Item label="发布时间">
                    {infoDetail?.gmtCreate ? moment(infoDetail?.gmtCreate).format('YYYY-MM-DD HH:mm') : ''}
                </Descriptions.Item>
                {/* <Descriptions.Item label="版本说明"> {infoDetail?.releaseNumber||'--'}</Descriptions.Item> */}
            </Descriptions>



            {/* </Spin> */}

            <Modal title="变更详情" visible={infoVisible} width={700} footer={false} onCancel={() => { setInfoVisible(false) }} destroyOnClose>
                <AceEditor readOnly height={400} mode={type === "sql" ? 'sql' : "yaml"} defaultValue={
                    type === "sql" && infoDetail?.sql ? infoDetail?.sql : type === "config" && infoDetail?.config ? infoDetail?.config : ""
                } />

            </Modal>
        </div>
    )
}
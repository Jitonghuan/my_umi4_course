import { Steps, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { CloseCircleOutlined, DingdingOutlined, CheckCircleTwoTone, StarOutlined, LoadingOutlined } from '@ant-design/icons'
import { ContentCard } from '@/components/vc-page-content';
import { BorderBox6, BorderBox9, BorderBox13, Decoration6, Decoration8 } from '@jiaminghi/data-view-react'
import './index.less'
const { Step } = Steps;
const StatusMapping: Record<string, number> = {
    start: 0,
    startwaiting: 1,
    mdmwaiting: 1.5,
    mdm: 2,
    targetwaiting: 2.5,
    target: 3,
    labelwaiting: 3.5,
    label: 4,
    sucessLoading: 4.5,
    sucess: 5

};
export default function StepsDetail() {
    const [status, setStatus] = useState<string>("")
    const handleStart = () => {
        setStatus("startwaiting")
    }
    useEffect(() => {
        if (status) {
            let intervalId = setInterval(() => {
                if (status === "startwaiting") {
                    setStatus("mdmwaiting")
                }
                if (status === "mdmwaiting") {
                    setStatus("targetwaiting")
                }
                if (status === "targetwaiting") {
                    setStatus("labelwaiting")
                }
                if (status === "labelwaiting") {
                    setStatus("sucessLoading")
                }
                if (status === "sucessLoading") {
                    setStatus("sucess")
                }
            }, 1000 );
            return () => {
                intervalId && clearInterval(intervalId);
            };

        }
    }, [status])
    return (
        <PageContainer className="steps-page">
            <ContentCard>
              
                <div className="decorate-top" ><Decoration8 style={{ width: '300px', height: '30px' }} /></div>
                <div className="steps-wrapper" >
                   
                    <span className={`${StatusMapping[status] > 0 ? "start-light" : "start-gray"} start-begin`} onClick={handleStart}>
                        <span className="word-banner">

                            开始
                      </span>
                        {StatusMapping[status] > 0 && StatusMapping[status] <= 1 ? <span className="light-line right-top">
                            <div className="line-block gradient" style={{ display: "inline-block" }}></div>
                        </span> : StatusMapping[status] > 1 ? <span className="finish-line" >
                        </span> : <span className="un-begin"></span>}


                        <div style={{ display: "inline-block" }} className="triangle-right"></div>

                    </span>



                    <span className={`${StatusMapping[status] >= 1.5 ? "start-light" : "start-gray"} mdm-step`}  >
                        <span className="long-word-banner"><span>获取MDM<br />点位信息</span></span>
                        {StatusMapping[status] >= 1.5 && StatusMapping[status] <= 2 ? <span className="light-line right-top">
                            <div className="line-block gradient" style={{ display: "inline-block" }}></div>
                        </span> : StatusMapping[status] > 2 ? <span className="finish-line" >
                        </span> : <span className="un-begin"></span>}

                        <div style={{ display: "inline-block" }} className="triangle-right"></div>

                    </span>

                    <span className={`${StatusMapping[status] >= 2.5 ? "start-light" : "start-gray"} target-step`}  >
                        <span className="longger-word-banner">指标计算</span>
                        {StatusMapping[status] >= 2.5 && StatusMapping[status] <= 3 ? <span className="light-line right-top">
                            <div className="line-block gradient" style={{ display: "inline-block" }}></div>
                        </span> : StatusMapping[status] > 3 ? <span className="finish-line" >
                        </span> : <span className="un-begin"></span>}
                        <div style={{ display: "inline-block" }} className="triangle-right"></div>

                    </span>

                    <span className={`${StatusMapping[status] >= 3.5 ? "start-light" : "start-gray"} label-step`}   >
                        <span className="longger-word-banner">标签计算</span>
                        {/* {console.log("StatusMapping[status]",StatusMapping[status])} */}
                        {StatusMapping[status] >= 3.5 && StatusMapping[status] <= 4 ? <span className="light-line right-top">
                            <div className="line-block gradient" style={{ display: "inline-block" }}></div>
                        </span> : StatusMapping[status] > 4 ? <span className="finish-line" >
                        </span> : <span className="un-begin"></span>}
                        <div style={{ display: "inline-block" }} className="triangle-right"></div>

                    </span>

                    <span className={`${StatusMapping[status] >= 4.5 ? "start-light" : "start-gray"} sucess-step`}   >
                        <span className="word-banner">完成</span>
                        {StatusMapping[status] > 4.5 && <span className="open-another"><Button type="primary">跳转</Button></span>}
                    </span>
                </div>
                <div className="decorate-bottom" >
                        <Decoration8 reverse={true} style={{ width: '300px', height: '30px' }} />

                    </div>

             







            </ContentCard>
        </PageContainer>
    )
}
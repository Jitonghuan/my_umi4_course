import { Steps,Button } from 'antd';
import React,{useState,useEffect} from 'react';
import PageContainer from '@/components/page-container';
import {CloseCircleOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined,LoadingOutlined} from '@ant-design/icons'
import { ContentCard } from '@/components/vc-page-content';
const { Step } = Steps;
const StatusMapping: Record<string, number> = {
    //start:1,
    startwaiting:1,
    mdmwaiting:1.5,
    mdm:2,
    targetwaiting:2.5,
    target:3,
    labelwaiting:3.5,
    label:4,
    sucessLoading:4.5,
    sucess:5

  };
export default function StepsDetail(){
    const description = 'This is a description.';
    const [status,setStatus]=useState<string>("")
    // function rnd(max:number,min=26){//min放后面，为有初始值，包含0

    //     return Math.round(Math.random()*(max-min))+min
    //   }
    //   console.log(rnd(31));
    //(Math.random() * 1000000).toFixed(0) 
   

    const handleStart=()=>{
        setStatus("startwaiting")
        console.log("------new Date().getTime()",new Date().getTime())
    }
    useEffect(()=>{
        if(status){
            let intervalId = setInterval(() => {
                if(status==="startwaiting"){
                     setStatus("mdmwaiting")
                     console.log("------new Date().getTime()",new Date().getTime())

                }
                if(status==="mdmwaiting"){
                    setStatus("targetwaiting")
                    console.log("------new Date().getTime()",new Date().getTime())
                }
                if(status==="targetwaiting"){
                    setStatus("labelwaiting")
                    console.log("------new Date().getTime()",new Date().getTime())

                }
                if(status==="labelwaiting"){
                    setStatus("sucessLoading")
                    console.log("------new Date().getTime()",new Date().getTime())
                }
                if(status==="sucessLoading"){
                    setStatus("sucess")
                    console.log("------new Date().getTime()",new Date().getTime())

                }
               
              }, 1000*29);
              console.log("------定时器")
          
              
          
              return () => {
                console.log("------注销")
                intervalId && clearInterval(intervalId);
              };

        }
    },[status])

    

    
    

    return(
        <PageContainer >
            <ContentCard>
                <div style={{display:"flex",alignItems:"center",height:"80vh",padding:20}}>
                <Steps current={StatusMapping[status] || -1}>
                    <Step title="开始" 
                    description={<span><Button type="primary" onClick={handleStart}>开始</Button></span>} 
                    icon={status==="startwaiting"?<LoadingOutlined/>:null}
                    />
                    <Step title="获取MDM点位信息" description={""}  icon={status==="mdmwaiting"?<LoadingOutlined/>:null}  />
                    <Step title="指标计算" description={""}  icon={status==="targetwaiting"?<LoadingOutlined/>:null}/>
                    <Step title="标签计算" description={""}  icon={status==="labelwaiting"?<LoadingOutlined/>:null}/>
                    <Step title="完成" description={status==="sucess"?<a    target="_blank" href="http://h2o.cfuture.shop/icons?categoryId=1">跳转</a>:""}  icon={status==="sucessLoading"?<LoadingOutlined/>:null} />
               </Steps>

                </div>
          
            </ContentCard>
        </PageContainer>
        
    )
}

import React, { useEffect, useState } from 'react';
import { Button,Table,Radio } from 'antd';
import './index.less';
const rootCls = 'capacity-analyze-compo';
export default function Capacity(){
    const [radioValue,setRadioValue]=useState<string>("database")
    return (
        <div className={rootCls}>
            <div>
            <div className="table-caption">
            <div className="caption-left">
                  <h3 className={`${rootCls}__title`}>容量概况</h3>
            </div>
            <div className="caption-right">
                <Button type="primary">重新分析</Button>
            </div>

            </div>
            </div>
          
            <div>
            <h3 className={`${rootCls}__title`}>异常表</h3>
            <Table/>
            </div>

            <div>
                <Radio.Group  optionType="button" buttonStyle="solid"  value={radioValue} onChange={(e)=>{
                    setRadioValue(e.target.value)

                }} options={[
                    {label:"库空间",value:"database"},
                    {label:"表空间",value:"table"},
                ]}  />
                <div>
                    <Table />
                </div>
            </div>
        </div>
    )
}
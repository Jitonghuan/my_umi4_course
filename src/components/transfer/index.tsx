import React, { useState, useEffect, useRef } from 'react';
import { Transfer, Select, Space, Badge } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
export interface ShuttleFrameProps {
    showSearch?:boolean|true;
    title:String[];
    render?:()=>void;
    disabled?:boolean|false;
    canAddSource:RecordType[];
    alreadyAddTargets:RecordType[];
    querySourceListData:()=>any;
    style:any;

  }
export interface RecordType {
    key: string;
    title: string;
    description?: string;
    chosen?: boolean;
    value?:string;
  }


const TransferFrame = <
  T extends {
    id: React.Key;
  } = any,
>(props: ShuttleFrameProps) => {
  const {showSearch,title,render,disabled,canAddSource,alreadyAddTargets,style} =props;
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<any>([]); //已经选择的key值
    const [alreadyAddApps, setAlreadyAddApps] = useState<any>([]); //已选择数据
    const [sourceListData, setSourceListData] = useState<any>([]);
    let categoryCurrent: any = [];
    const querySourceListData = async () => {
        let canAddSourceData: any = []; //可选数据数组
        let alreadyAddTargetsData: any = []; //一进入页面已选数据
            //如果只存在可选数据，不存在目标数据
            if (canAddSource && alreadyAddTargets.length===0) {
              canAddSource?.map((item: any, index: number) => {
                canAddSourceData.push({
                  key: index.toString(),
                  title: item.title,
                  value: item.value,
                });
              });
              setSourceListData(canAddSourceData); //如果只存在可选数据，则可选数据为整体的总数据源
            }
            //如果已选目标数据存在
            if (alreadyAddTargets.length>0) {
              let arry: any = []; //存放整体的数组
              let selectedTargets: any = []; //已选目标数据数组
              canAddSource?.map((item: any, index: number) => {
                canAddSourceData.push({
                  key: index.toString(),
                  title: item.title,
                  value: item.value,
                }); //如果已选目标数据存在，仍旧先取出可选数据
                arry.push({
                  key: index.toString(),
                  title: item.title,
                  value: item.value,
                });
              }); //存放整体的数组arry中放入目标数据
             alreadyAddTargets?.map((item: any, index: number) => {
                arry.push({
                  key: arry.length.toString(),
                  title: item.title,
                  value: item.value,
                });
    
                alreadyAddTargetsData.push({
                  key: index.toString(),
                  title: item.title,
                  value: item.value,
                });
              }); //存放整体的数组arry中继续放入已选数据，此时已选数据的key必须唯一且延续上面的可选数据的key值往下
              let arryData = arry;
              setSourceListData(arryData); //将拿到的整体全部数据放入穿梭框的dataSource源
              setAlreadyAddApps(alreadyAddTargetsData);
              let keyArry: any = [];
              canAddSourceData.map((item: any) => {
                keyArry.push(item.key);
              }); //取出可选数据中所有的key值
              arryData?.filter((item: any) => {
                if (keyArry.includes(item.key) === false) {
                  // selectedTargets.push({key:item.key,title:item.title})
                  categoryCurrent.push(item.title);
                  selectedTargets.push(item.key);
                }
              }); //从整体数据源中筛选，其中不包含可选数据中所有的key值，即为已选数据，则setState目标数据key数组中,视图渲染
              setTargetKeys(selectedTargets);
            }
      };

  useEffect(() => {
    querySourceListData();
  }, [canAddSource]);


  const getfilterOption = (inputValue: string, option: any) => option?.title?.indexOf(inputValue) > -1;
  const handleChange = (newTargetKeys: string[],direction: any, moveKeys: any) => {
    setTargetKeys(newTargetKeys);
  };

  const handleSearch = (dir: TransferDirection, value: string) => {
    console.log('search:', dir, value);
  };
  

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  useEffect(()=>{
      return()=>{
        setTargetKeys([]);
        setSelectedKeys(undefined);
      }
  },[])

 
  return (
    <div style={style}>
      <Transfer
      dataSource={sourceListData}
      showSearch={showSearch}
      titles={title}
      filterOption={getfilterOption}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onSelectChange={onSelectChange}
      onChange={handleChange}
      onSearch={handleSearch}
      disabled={disabled}
      render= {item => item.title}
    />
    </div>
  );
};

export default TransferFrame;
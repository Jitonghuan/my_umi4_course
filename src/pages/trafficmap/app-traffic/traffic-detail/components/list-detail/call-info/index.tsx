
import React, { useState, useCallback, useEffect, useRef,useMemo } from 'react';
import { findDOMNode } from 'react-dom';
import { Card, Select, Form, Tooltip, Tabs, Button, Row, Col ,Table} from 'antd';
import { RedoOutlined, SyncOutlined } from '@ant-design/icons';
import HulkTable, { usePaginated, ColumnProps } from '@cffe/vc-hulk-table';
import VCCardLayout from '@cffe/vc-b-card-layout';
import {createStatisticsTableColumns,createQueryTableColumns} from './schema'
import { getRequest } from '@/utils/request';
import './index.less'
export  default function InstanceMonitor(){
    const statisticsColumns = useMemo(() => {
        return createStatisticsTableColumns({
          onView: (record, index) => {
          
          },
        
        }) as any;
      }, []);
      const queryColumns = useMemo(() => {
        return createQueryTableColumns({
          onView: (record, index) => {
          
          },
        
        }) as any;
      }, []);
    
    return(
        <>
         <Card className="call-info-body">
          <h3 className="call-info-tabs-content-title">
            调用统计
           
        
          </h3>
          <Table bordered columns={statisticsColumns}/>
           <h3 className="call-info-tabs-content-title">
            调用查询
          </h3>
          <Table bordered columns={queryColumns}/>
          </Card>
        </>
    )
}
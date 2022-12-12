import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Tabs, Form, Select, message, DatePicker, Input, Divider, Space, Radio } from 'antd';
import { InfoCircleOutlined, } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { getRequest} from '@/utils/request';
import PageContainer from '@/components/page-container';
import LightDragable from "@/components/light-dragable";
import { ScheduleOutlined, } from '@ant-design/icons';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import {queryTableFieldsApi} from '../../../common-service'
import { useEnvList, useInstanceList, useQueryDatabasesOptions, useQueryTableFieldsOptions, useQueryTablesOptions } from '../../../common-hook'
import { history } from 'umi';
import './index.less';
import moment from "moment";
export default function StructApply(){
    return(
        <PageContainer>

        </PageContainer>
    )
}
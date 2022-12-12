import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Tabs, Form, Select, message, DatePicker, Input, Divider, Space, Radio } from 'antd';
import { InfoCircleOutlined, } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { getRequest} from '@/utils/request';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import LightDragable from "@/components/light-dragable";
import { ScheduleOutlined, } from '@ant-design/icons';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import {queryTableFieldsApi} from '../../../common-service'
import { useEnvList, useInstanceList, useQueryDatabasesOptions, useQueryTableFieldsOptions, useQueryTablesOptions } from '../../../common-hook'
import { history } from 'umi';
import './index.less';
import moment from "moment";
export const appMicroFeTypeOptions: any[] = [
    { label: '主应用', value: 'mainProject' },
    { label: '子应用', value: 'subProject' },
  ];
export default function StructApply(){
    return(
        <PageContainer>
            <ContentCard>
                <h3>结构同步工单</h3>
                <div>
                    <Form>
                        <Form.Item label="标题">
                            <Input />


                        </Form.Item>
                        <Form.Item label="来源库">
                            <Form.Item label="环境">
                                <Select />

                            </Form.Item>
                            <Form.Item label="实例">
                                <Select />

                            </Form.Item>
                            <Form.Item label="库">
                                <Select />

                            </Form.Item>

                        </Form.Item>
                        <Form.Item label="目标库">
                        <Form.Item label="环境">
                                <Select />

                            </Form.Item>
                            <Form.Item label="实例">
                                <Select />

                            </Form.Item>
                            <Form.Item label="库">
                                <Select />

                            </Form.Item>

                        </Form.Item>
                        <Form.Item>
                            <Radio.Group options={appMicroFeTypeOptions}/>
                        </Form.Item>
                    </Form>
                </div>

            </ContentCard>

        </PageContainer>
    )
}
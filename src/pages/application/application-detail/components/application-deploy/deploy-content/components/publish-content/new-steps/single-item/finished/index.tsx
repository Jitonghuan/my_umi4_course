// finished step
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState, useContext, useEffect, useRef } from 'react';
import { Steps, Button, message } from 'antd';
import { StepItemProps } from '../../../types';
import DetailContext from '@/pages/application/application-detail/context';
import { downloadSource, listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

/** 执行完成 */
export default function FinishedStep(props: StepItemProps) {
    const { deployInfo, deployStatus, onOperate, envTypeCode, status, env = '', ...others } = props;
    const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
    const { appData } = useContext(DetailContext);
    const downLoadSupportEnv = useRef<string[]>(['']);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [supportEnv, setSupportEnv] = useState<any>([]);

    const isNotFrontend = appData?.appType !== 'frontend';

    return <Steps.Step {...others} title="完成" status={status} />;
}

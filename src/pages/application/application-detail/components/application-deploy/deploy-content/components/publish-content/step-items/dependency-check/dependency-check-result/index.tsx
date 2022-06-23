// 质量卡点结果
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/19 10:57

import React, { useState, useCallback, useContext } from 'react';
import { Modal, Spin, Tag } from 'antd';
import { getRequest } from '@/utils/request';
import DetailContext from '@/pages/application/application-detail/context';
import * as APIS from '@/pages/application/service';
import { DeployInfoVO } from '@/pages/application/application-detail/types';
import './index.less';

export interface QualityCheckResultProps {
  deployInfo: DeployInfoVO;
  visible?: boolean;
}

const getParents = (node: HTMLElement, selector: string): HTMLElement => {
  if (node === document.body) return node;
  if (node.matches(selector)) return node;
  return getParents(node.parentNode as HTMLElement, selector);
};

export default function QualityCheckResult(props: QualityCheckResultProps) {
  const { visible, deployInfo } = props;
  const { metadata, branchInfo, envInfo, buildInfo } = deployInfo || {};
  const { appData } = useContext(DetailContext);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>();
  const [visable, setVisable] = useState(false);

  const handleVisibleChange = useCallback(async () => {
    // if (!nextVisible) return;

    setVisable(true);

    setLoading(true);
    try {
      const result = await getRequest(APIS.checkResultUrl, {
        data: {
          deployId: deployInfo?.metadata?.id,
        },
      });

      setDetail(result.data || '');
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  }, [deployInfo, appData]);

  if (!visible) return null;

  const result_uc = detail?.result_uc || {};
  const result_qc = detail?.result_qc || {};

  return (
    <>
      <Modal
        title="检验结果"
        width={900}
        visible={visable}
        footer={null}
        onOk={() => {
          setVisable(false);
        }}
        onCancel={() => {
          setVisable(false);
        }}
        // trigger="click"
        // overlayStyle={{ width: 400 }}
        // overlayInnerStyle={{ width: 400 }}
        // onVisibleChange={handleVisibleChange}

        // getPopupContainer={() =>
        //   getParents(document.querySelector('#J_quality_check_detail_trigger')!, '.publish-content-compo')
        // }
      >
        <Spin spinning={loading}>
          <div className="quality-check-result">
            <pre> {detail}</pre>
          </div>
        </Spin>
      </Modal>
      <a id="J_quality_check_detail_trigger" onClick={handleVisibleChange}>
        检验结果
      </a>
    </>
  );
}

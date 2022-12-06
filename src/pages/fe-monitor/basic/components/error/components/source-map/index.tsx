import React, { useEffect, useState } from 'react';
import AceEditor from '@/components/ace-editor';
import { Modal, Spin, message } from '@cffe/h2o-design';
import { sourcemapDownload } from '@/pages/fe-monitor/basic/server';

interface IProps {
  visible: boolean;
  onClose: () => void;
  param: any;
  getParam?: (data: any) => any;
}

const SourceMapModal = (props: IProps) => {
  const { visible, onClose, param } = props;
  const [sourceInfo, setSourceInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  async function getSourceFile() {
    const { filePath } = param;
    const envCode = props.getParam ? props.getParam({}).envCode : param.envCode;
    let newFilePath = filePath.match(/http(\S*)js/);
    if (!newFilePath || !newFilePath[0]) {
      return message.error('错误文件map不存在');
    }
    let fileList = newFilePath[0].split('//')[1].split('/');
    fileList.shift();

    let d3 = param?.d3?.replace(/^:/, '') || '';
    d3 = d3.split(':');

    if (!d3[0] || !d3[1]) {
      return message.error('没有错误行列号');
    }
    setLoading(true);

    const res = await sourcemapDownload({
      // filePath: '/framework/20220720192313/components__layout__index.js.map',
      // envCode: 'g3a-test',
      // errorLine: 1,
      // errorColumn: 2220
      envCode,
      errorLine: d3[0],
      errorColumn: d3[1],
      filePath: '/hbos-A/' + fileList.join('/') + '.map',
    });

    setLoading(false);
    if (res?.data) {
      const contentRowArr = res.data.sourceCode?.split('\n'); //切分
      let startLine = res.data.line - 15 > 0 ? res.data.line - 15 : 0;
      setSourceInfo({
        ...res.data,
        line: res.data.line - 1,
        code: contentRowArr.splice(startLine, 20).join('\n'),
        startLine,
        // code: res.data?.line ? contentRowArr[res.data.line - 1] : '',
      });
    }
  }

  useEffect(() => {
    if (visible) {
      getSourceFile();
    } else {
      setSourceInfo({});
    }
  }, [visible]);

  return (
    <Modal title="SourceMap还原" visible={visible} footer={null} width={800} destroyOnClose onCancel={onClose}>
      {loading ? (
        <Spin tip="分析中，请稍后" />
      ) : (
        <>
          <div style={{ color: '#f03c07' }}>tips：若错误行列号不太准确，可结合报错信息根据上下文分析具体出错位置</div>
          <div style={{ marginTop: '10px' }}>错误信息：{param?.d1 || '-'}</div>
          <div style={{ marginTop: '10px' }}>错误文件：{sourceInfo?.file || '-'}</div>
          <div style={{ marginTop: '10px' }}>
            错误行列：{sourceInfo?.line || '-'}:{sourceInfo?.column || '-'}
          </div>
          <div style={{ marginTop: '10px' }}>错误代码：</div>
          <AceEditor
            mode="javascript"
            markers={[
              {
                startRow: sourceInfo?.line - sourceInfo?.startLine || 0,
                startCol: 0,
                endRow: sourceInfo?.line - sourceInfo?.startLine || 0,
                endCol: Infinity,
                type: 'fullLine',
                className: 'ace_active-line ace_active-markers-line',
                inFront: true,
              },
            ]}
            value={sourceInfo?.code}
            readOnly={true}
            firstLineNumber={sourceInfo?.startLine || 1}
            height={400}
          />
        </>
      )}
    </Modal>
  );
};

export default SourceMapModal;

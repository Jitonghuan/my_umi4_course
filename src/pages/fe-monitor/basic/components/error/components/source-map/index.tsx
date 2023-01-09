import React, { useEffect, useState } from 'react';
import AceEditor from '@/components/ace-editor';
import { Modal, Spin, message, Tabs, Input, Form, Button } from 'antd';
import { sourcemapDownload } from '@/pages/fe-monitor/basic/server';
const { TabPane } = Tabs;

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
  const [tabKey, setTabKey] = useState<any>('1');
  const [form] = Form.useForm();

  async function getSourceFile(query?: any) {
    const { filePath, d3 } = query || param;
    const envCode = props.getParam ? props.getParam({}).envCode : param.envCode;
    let newFilePath = filePath.match(/http(\S*)js/);
    if (!newFilePath || !newFilePath[0]) {
      return message.error('错误文件map不存在');
    }
    let fileList = newFilePath[0].split('//')[1].split('/');
    fileList.shift();

    let line = d3?.replace(/^:/, '') || '';
    line = line.split(':');

    if (!line[0] || !line[1]) {
      return message.error('没有错误行列号');
    }
    setLoading(true);

    const res = await sourcemapDownload({
      // filePath: '/framework/20220720192313/components__layout__index.js.map',
      // envCode: 'g3a-test',
      // errorLine: 1,
      // errorColumn: 2220
      envCode,
      errorLine: line[0],
      errorColumn: line[1],
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

  const handleSubmit = async () => {
    const query = await form.validateFields();
    getSourceFile(query);
  };

  useEffect(() => {
    if (visible) {
      getSourceFile();
    } else {
      setTabKey('1');
      setSourceInfo({});
    }
  }, [visible]);

  return (
    <Modal title="SourceMap还原" visible={visible} footer={null} width={800} destroyOnClose onCancel={onClose}>
      <Tabs activeKey={tabKey} onChange={setTabKey}>
        <TabPane tab="自动还原" key="1" />
        <TabPane tab="手动还原" key="2" />
      </Tabs>
      {loading ? (
        <Spin tip="分析中，请稍后" />
      ) : (
        <>
          <div style={{ color: '#f03c07', marginBottom: '10px' }}>
            tips：若错误行列号不太准确，可结合报错信息根据上下文分析具体出错位置
          </div>
          {tabKey === '1' ? (
            <div>错误信息：{param?.d1 || '-'}</div>
          ) : (
            <Form form={form} labelCol={{ flex: '120px' }}>
              <Form.Item
                label="原始错误文件"
                name="filePath"
                rules={[{ required: true, message: '请输入原始错误文件' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="原始错误行列号" name="d3" rules={[{ required: true, message: '请输入原始错误行列号' }]}>
                <Input placeholder="行:列" />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
                <Button type="primary" onClick={handleSubmit}>
                  还原
                </Button>
              </Form.Item>
            </Form>
          )}

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

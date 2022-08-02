import React, {useEffect, useState} from "react";
import MonacoEditor from "react-monaco-editor";
import { Modal, Spin } from "@cffe/h2o-design";
import { sourcemapDownload } from "@/pages/fe-monitor/basic/server";
import SourceMap from "source-map";
import {getRequest} from "@/utils/request";
import {message} from "antd";

interface IProps {
  visible: boolean;
  onClose: () => void;
  param: any;
}

interface IErrorPos {
  column: number;
  line: number;
}

const SourceMapModal = (props: IProps) => {
  const { visible, onClose, param } = props;
  const [sourceInfo, setSourceInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const getErrorCode = async (file: any, errorPos: IErrorPos) => {
    console.log(errorPos)
    const consumer = await new SourceMap.SourceMapConsumer(file); // 获取sourceMap consumer，我们可以通过传入打包后的代码位置来查询源代码的位置

    const originalPosition = consumer.originalPositionFor({ // 获取 出错代码 在 哪一个源文件及其对应位置
      line: errorPos.line,
      column: errorPos.column,
    });
    // 根据源文件名寻找对应源文件
    const sourceIndex = consumer.sources.findIndex(
      (item: any) => item === originalPosition.source
    );
    const sourceContent = sourceIndex!== -1 ? consumer.sourcesContent[sourceIndex] : '';
    const contentRowArr = sourceContent?.split("\n"); //切分
    setSourceInfo({
      ...originalPosition,
      code: originalPosition?.line ? contentRowArr[originalPosition.line - 1] : '',
      line: originalPosition?.line || 1,
    });
    setLoading(false);
  }

  async function downloadFile (file: string) {
    const d3 = param?.d3.split(':');
    console.log(d3);
    const res = await getRequest(file, {
      hideToast: true
    })
    if (res) {
      if (!d3[1] || !d3[2]) {
        setLoading(false);
        return message.error('没有错误行列号');
      }
      void getErrorCode(res, {
        line: d3[1],
        column: d3[2],
      })
    } else {
      setLoading(false);
    }
  }

  async function getSourceFile() {
    const { filePath, envCode } = param;
    let newFilePath = filePath.match(/http(\S*)js/);
    if (!newFilePath || !newFilePath[0]) {
      return message.error('错误文件map不存在');
    }
    setLoading(true);
    let fileList = newFilePath[0].split('//')[1].split('/');
    fileList.shift();

    const res = await sourcemapDownload({
      envCode,
      filePath: '/hbos-A/' + fileList.join('/') + '.map'
    })
    if (res?.data) {
      void downloadFile(res.data)
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (visible) {
      getSourceFile();
    } else {
      setSourceInfo({});
    }
  }, [visible])

  return (
    <Modal
      title='SourceMap还原'
      visible={visible}
      footer={null}
      width={800}
      destroyOnClose
      onCancel={onClose}
    >
      {
        loading ? <Spin tip="分析中，请稍后" /> : (
          <>
            <div>错误文件：{sourceInfo?.source || '-'}</div>
            <div style={{ marginTop: '10px' }}>错误行列：{sourceInfo?.line || '-'}:{sourceInfo?.column || '-'}</div>
            <div style={{ marginTop: '10px' }}>错误代码：</div>
            <MonacoEditor value={sourceInfo?.code} height={400} options={{ lineNumbers: (line) => sourceInfo ? sourceInfo.line : line }} />
          </>
        )
      }
    </Modal>
  )
}

export default SourceMapModal;

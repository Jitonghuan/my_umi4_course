import React from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/es/modal';
import './index.less';

export interface IProps extends ModalProps {
  /** 是否全屏 */
  isFull?: boolean;
}

/**
 * vc-modal
 * @description 弹窗组件封装
 * @author author
 * @version 1.0.0
 * @create 2021-05-21 15:47
 */
const VCModal: React.FC<IProps> = (props) => {
  const { isFull, width, className, ...rest } = props;

  return (
    <Modal
      {...rest}
      width={isFull ? '100%' : width}
      className={`vc-modal ${className} ${isFull ? 'vc-modal-full' : ''}`}
    />
  );
};

/**
 * 默认值
 */
VCModal.defaultProps = {
  // 属性默认值配置
};

export default VCModal;

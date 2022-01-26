/*
 * @Author: shixia.ds
 * @Date: 2021-11-30 15:44:26
 * @Description: 红线追踪弹窗：可拖动
 */
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import moment from 'moment';
import { listDangerousCalls } from '@/pages/trafficmap/service';
import DragModal from '../DragModal';
import './index.less';
interface IProps {
  envCode: string;
  visible: boolean;
  handleCancel: () => void;
  onRedLineSelect: (item: any) => void;
}

const RedLineModal: React.FC<IProps> = (props) => {
  const [options, setOptions] = useState([
    {
      label: '最近五分钟',
      value: 5,
    },
    {
      label: '最近十分钟',
      value: 10,
    },
    {
      label: '最近十五分钟',
      value: 15,
    },
    {
      label: '最近二十分钟',
      value: 20,
    },
    {
      label: '最近二十五分钟',
      value: 25,
    },
    {
      label: '最近三十分钟',
      value: 30,
    },
  ]);
  const [selectedOptions, setSelectedOptions] = useState<number>(5);

  const [selected, setSelected] = useState<any>('');

  const [redLineList, setRedLineList] = useState<any[]>([]);

  const { envCode, visible, handleCancel, onRedLineSelect } = props;

  useEffect(() => {
    visible && getRedLineList();
  }, [visible]);

  useEffect(() => {
    visible && getRedLineList();
  }, [selectedOptions]);

  const getRedLineList = async () => {
    const timeStart = moment()
      .subtract(selectedOptions + 1, 'minutes')
      .format('YYYY-MM-DD HH:mm');
    const timeEnd = moment().subtract(1, 'minute').format('YYYY-MM-DD HH:mm');

    let res = await listDangerousCalls({
      envCode: envCode,
      timeStart: timeStart,
      timeEnd: timeEnd,
    });
    setRedLineList(res.data);
  };

  const onOptionsChange = (value: number) => {
    setSelectedOptions(value);
  };

  return (
    <div className="drag-redline-modal" style={{ display: visible ? 'block' : 'none' }}>
      <DragModal
        title={'红线追踪'}
        onCancel={handleCancel}
        width={219}
        style={{ position: 'absolute', top: '14%', right: '0px', minWidth: '200px' }}
      >
        <Select options={options} style={{ width: '195px' }} onChange={onOptionsChange} value={selectedOptions} />
        <div style={{ marginTop: '12px' }}>
          {redLineList.map((item: any) => {
            return (
              <div
                className={selected == item.time ? 'redline-container redline-container-selected' : 'redline-container'}
                onClick={() => {
                  setSelected(item.time);
                  onRedLineSelect(item);
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="3929"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M512 298.666667c103.210667 0 189.301333 73.290667 209.066667 170.666666H981.333333a42.666667 42.666667 0 0 1 1.333334 85.312L981.333333 554.666667h-260.266666c-19.770667 97.376-105.861333 170.666667-209.066667 170.666666-103.205333 0-189.296-73.290667-209.066667-170.666666H42.666667a42.666667 42.666667 0 0 1-1.333334-85.312L42.666667 469.333333h260.266666C322.698667 371.957333 408.789333 298.666667 512 298.666667z"
                      p-id="3930"
                      fill="#F5222D"
                    />
                  </svg>
                  <span>{item.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </DragModal>
    </div>
  );
};

export default RedLineModal;

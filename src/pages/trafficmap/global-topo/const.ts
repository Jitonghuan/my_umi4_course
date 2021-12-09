/*
 * @Author: shixia.ds
 * @Date: 2021-12-07 11:35:21
 * @Description: 常量
 */

import serverblue from '@/assets/imgs/serverblue.svg';
import serverred from '@/assets/imgs/serverred.svg';
import serveryellow from '@/assets/imgs/serveryellow.svg';
import { IColor } from '../interface';

const DANGER_COLOR = '#F54F37';
const WARNING_COLOR = '#FFC21A';
const NORMAL_COLOR = '#3692FD';

const DANGER_COLOR_Fill = '#FEEDEB';
const WARNING_COLOR_Fill = '#FFF8E8';
const NORMAL_COLOR_Fill = '#EAF4FE';

export const APP_STATUS_COLOR_MAP: IColor = {
  danger: DANGER_COLOR,
  warning: WARNING_COLOR,
  normal: NORMAL_COLOR,
};

export const APP_STATUS_FILL_COLOR_MAP: IColor = {
  danger: DANGER_COLOR_Fill,
  warning: WARNING_COLOR_Fill,
  normal: NORMAL_COLOR_Fill,
};

export const APP_STATUS_ICON_MAP: IColor = {
  warning: serveryellow,
  danger: serverred,
  normal: serverblue,
};

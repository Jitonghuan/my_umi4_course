
import { addAPIPrefix } from '@/utils';
//新增报警分组
export const addAlertGroup = addAPIPrefix('/monitorManage/alertCenter/alertGroup/add');
//查看报警分组
export const viewAlertGroup = addAPIPrefix('/monitorManage/alertCenter/alertGroup/list');
//修改报警分组
export const updateAlertGroup = addAPIPrefix('/monitorManage/alertCenter/alertGroup/update');
//删除报警分组
export const deleteAlertGroup = addAPIPrefix('/monitorManage/alertCenter/alertGroup');
/** 推送报警分组到报警规则 */
export const pushAlertGroup = addAPIPrefix('/monitorManage/alertCenter/alertGroup/push');
/** 校验报警分组名称 */
export const checkName = addAPIPrefix('/monitorManage/alertCenter/alertGroup/checkName');
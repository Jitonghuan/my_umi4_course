//管理员页面接口文档
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/ig72yd
//2022/06/14 13:50
import { addAPIPrefix } from '@/utils';
/* POST 4、 发送系统消息 */
export const sendSystemNotice = addAPIPrefix('/adminManage/systemNotice/send');
/* POST 5、 获得系统通知内容列表 */
export const getContentList = addAPIPrefix('/adminManage/systemNotice/content/list');
/* POST 6、删除系统通知内容 */

export const deleteContent = addAPIPrefix('/adminManage/systemNotice/content/delete');

/* PUT 7、更新系统通知内容 */
export const updateContent = addAPIPrefix('/adminManage/systemNotice/content/update');

export const searchUserUrl = addAPIPrefix('/appManage/user/list');

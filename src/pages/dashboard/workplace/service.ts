//管理员页面接口文档
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/qo3mcm
//2022/06/14 13:50
import { addAPIPrefix } from '@/utils';

/* GET 1、查询未读消息数  */

export const getUnreadNum = addAPIPrefix('/adminManage/systemNotice/unreadNum');

/* GET 2、 查询所有系统消息 */

export const getSystemNoticeList = addAPIPrefix('/adminManage/systemNotice/list');

/* POST 3、 批量更新为已读 */

export const batchUpdateRead = addAPIPrefix('/adminManage/systemNotice/list/read');

/* GET 8、查询我的快捷入口 */
export const getMyEntryMenuList = addAPIPrefix('/adminManage/entryMenu/my/List');

/* POST 9、新增我的快捷入口*/
export const createMyEntryMenu = addAPIPrefix('/adminManage/entryMenu/my/create');

/* POST 7、删除我的快捷入口 */
export const deleteMyEntryMenu = addAPIPrefix('/adminManage/entryMenu/my/delete');

/* GET 8、查询文章  */

export const getInfoList = addAPIPrefix('/adminManage/post/list');

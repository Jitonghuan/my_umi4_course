import { addAPIPrefix } from '@/utils';

/** POST 新增用例类目*/
export const createCaseCategory = addAPIPrefix('/qc/teststation/caseCategoryCreate');

/** POST 删除用例类目*/
export const deleteCaseCategory = addAPIPrefix('/qc/teststation/caseCategoryDelete');

/** POST 更新用例类目*/
export const updateCaseCategory = addAPIPrefix('/qc/teststation/caseCategoryUpdate');

/** GET 分页列举用例类目下的子类目*/
export const getCaseCategoryPageList = addAPIPrefix('/qc/teststation/caseCategoryPageList');

/** GET 深度列举用例类目下所有子类目*/
export const getCaseCategoryDeepList = addAPIPrefix('/qc/teststation/caseCategoryDeepList');

import { addAPIPrefix } from '@/utils';

/** POST 新增用例类目 */
export const createCaseCategory = addAPIPrefix('/qc/teststation/caseCategoryCreate');

/** POST 删除用例类目 */
export const deleteCaseCategory = addAPIPrefix('/qc/teststation/caseCategoryDelete');

/** POST 更新用例类目 */
export const updateCaseCategory = addAPIPrefix('/qc/teststation/caseCategoryUpdate');

/** GET 分页列举用例类目下的子类目 */
export const getCaseCategoryPageList = addAPIPrefix('/qc/teststation/caseCategoryPageList');

/** GET 深度列举用例类目下所有子类目 */
export const getCaseCategoryDeepList = addAPIPrefix('/qc/teststation/caseCategoryDeepList');

/** -------------------------------------------------------------------------------------------------------------- */

/** POST 新增用例 */
export const createCase = addAPIPrefix('/qc/teststation/caseCreate');

/** POST 删除用例 */
export const caseDelete = addAPIPrefix('/qc/teststation/caseDelete');

/** POST 更新用例 */
export const updateCase = addAPIPrefix('/qc/teststation/caseUpdate');

/** POST 复制用例 */
export const copyCases = addAPIPrefix('/qc/teststation/copyCases');

/** POST 移动用例 */
export const moveCases = addAPIPrefix('/qc/teststation/moveCases');

/** GET 查看指定用例信息 */
export const getCaseInfo = addAPIPrefix('/qc/teststation/caseInfo');

/** GET 分页列举指定用例类目下的用例 */
export const getCasePageList = addAPIPrefix('/qc/teststation/casePageList');

/** GET 深度列举指定用例类目及其子类目下的用例 */
export const getCaseMultiDeepList = addAPIPrefix('/qc/teststation/caseMultiDeepList');

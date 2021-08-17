import { addAPIPrefix } from '@/utils';

/** POST 新增用例类目 */
export const createCaseCategory = addAPIPrefix('/qc/teststation/caseCategoryCreate');

/** POST 删除用例类目 */
export const deleteCaseCategory = addAPIPrefix('/qc/teststation/caseCategoryDelete');

/** POST 更新用例类目 */
export const updateCaseCategory = addAPIPrefix('/qc/teststation/caseCategoryUpdate');

/** GET  分页列举用例类目下的子类目 */
export const getCaseCategoryPageList = addAPIPrefix('/qc/teststation/caseCategoryPageList');

/** GET  深度列举用例类目下所有子类目 */
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

/** GET  查看指定用例信息 */
export const getCaseInfo = addAPIPrefix('/qc/teststation/caseInfo');

/** GET  分页列举指定用例类目下的用例 */
export const getCasePageList = addAPIPrefix('/qc/teststation/casePageList');

/** GET  深度列举指定用例类目及其子类目下的用例 */
export const getCaseMultiDeepList = addAPIPrefix('/qc/teststation/caseMultiDeepList');

/** GET  获取所属枚举 */
export const getCategoryList = addAPIPrefix('/appManage/category/list?pageSize=-1');

/** -------------------------------------------------------------------------------------------------------------- */

/** POST 测试计划-新增测试计划 */
export const createTestPlan = addAPIPrefix('/qc/teststation/addTestPlan');

/** POST 测试计划-删除测试计划 */
export const deleteTestPlan = addAPIPrefix('/qc/teststation/deleteTestPlan');

/** POST 测试计划-编辑测试计划 */
export const modifyTestPlan = addAPIPrefix('/qc/teststation/modifyTestPlan');

/** GET  测试计划-查询计划列表 */
export const getTestPlanList = addAPIPrefix('/qc/teststation/getTestPlanList');

/** POST 测试阶段-新增/删除测试阶段用例 */
export const modifyPhaseCase = addAPIPrefix('/qc/teststation/modifyCasesToPhase');

/** GET  测试阶段-查询测试阶段详情 */
export const getTestPhaseDetail = addAPIPrefix('/qc/teststation/queryPhaseDetail');

/** POST 测试执行-执行测试用例(测试备注、修改测试状态) */
export const executePhaseCase = addAPIPrefix('/qc/teststation/executePhaseCase');

/** GET  测试执行-查询某阶段待执行用例树 */
export const getPhaseCaseTree = addAPIPrefix('/qc/teststation/queryPhaseCaseTree');

/** GET  测试执行-查询用例执行详情及执行记录 */
export const getPhaseCaseDetail = addAPIPrefix('/qc/teststation/queryPhaseCaseDetail');

/** POST 测试执行-关联Bug */
export const relatedBug = addAPIPrefix('/qc/teststation/relatedBugByCase');

/** GET  获取所属业务列表 */
export const getProjects = addAPIPrefix('/appManage/category/list?pageIndex=-1&pageSize=100');

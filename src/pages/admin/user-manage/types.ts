export interface CreateUserProps {
  name: string;
  email: string;
  mobile?: string;
  ssoUsername?: string;
  leaderDingUid?: string;
  dingUid?: string;
}

// 新增用户角色
export interface CreateUserRoleProps {
  id: number;
  groupCode: string;
  categoryCode: string;
  role: string;
}

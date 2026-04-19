import { User } from './user';

export interface Role {
  id: number;
  name: string;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}

export interface UserRoleRequest {
  roleName: string;
}

export interface UserStatusSetRequest {
  status: string;
}

export interface UserAuditLog {
  id: number;
  username: string;
  userAgent: string;
  clientIp: string;
  requestUri: string;
  methodName: string;
  executionTimeMs: number;
  paramContent: string;
  createdDate: string;
}

export interface UserSearchFilter {
  username?: string;
  userStatus?: string;
  userPlan?: string;
  roleId?: number;
}

export interface RoleSearchFilter {
  name?: string;
}

export interface UserAuditFilter {
  username?: string;
  requestUri?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  userAgent?: string;
  clientIp?: string;
  executionTimeMsFrom?: number;
  executionTimeMsTo?: number;
}

export interface UsersPageData {
  content: User[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface RolesPageData {
  content: Role[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface UserAuditPageData {
  content: UserAuditLog[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

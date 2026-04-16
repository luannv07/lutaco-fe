import { EnumValue } from './enum-value.model';

export interface User {
  id: string;
  username: string;
  fullName: string;
  address: string | null;
  email: string;
  gender: EnumValue;
  userStatus: EnumValue;
  userPlan: EnumValue;
  roleName: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

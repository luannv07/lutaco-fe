export interface User {
  id: string;
  username: string;
  fullName: string;
  address: string | null;
  email: string;
  gender: {
    value: string;
    display: string;
  };
  userStatus: {
    value: string;
    display: string;
  };
  roleName: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  userPlan: {
    value: string;
    display: string;
  };
}

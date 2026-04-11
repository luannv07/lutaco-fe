export interface LoginRequest {
  username: string;
  password: string;
}
export interface AuthData {
  accessToken?: string;
  refreshToken?: string;
  authenticated?: boolean;
}

export interface UserCreateRequest {
  username: string;
  password: string;
  fullName: string;
  address?: string; // optional
  email: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

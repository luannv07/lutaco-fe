export interface LoginRequest {
  username: string;
  password: string;
}
export interface AuthData {
  accessToken?: string;
  refreshToken?: string;
  authenticated?: boolean;
}



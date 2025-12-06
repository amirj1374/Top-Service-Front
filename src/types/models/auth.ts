import type { CustomizerDTO } from '@/types/models/person';

export interface UserInfoResponse {
  name: string;
  sub: string;
  emailVerified: boolean;
  issuer: string | null;
  branchName: string;
  preferredUsername: string;
  nonce: string;
  sid: string;
  branchCode: string;
  audience: string[];
  acr: string;
  azp: string;
  authTime: string;
  fullName: string;
  position: string;
  expiration: string;
  sessionState: string;
  issuedAt: string;
  jti: string;
  authorities: string[];
  username: string;
  email: string | null;
  roles: string[];
  lotusRoles: string[];
  customizer: CustomizerDTO;
}

export interface authPayload {
  password: string;
  rememberMe: boolean;
  username: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterUser {
  id: string;
  name: string;
  email: string;
  age: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterResponse {
  access_token: string;
  user: RegisterUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: RegisterUser;
}
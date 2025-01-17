export interface ApiResponse<T> {
  StatusCode: number
  Message: string
  TotalRecord: number
  Data: T
}

export interface LoginResponse {
  UserId: string
  UserName: string
  AccessToken: string
  RefreshToken: string
}

export interface AuthUser {
  userId: string
  userName: string
  accessToken: string
  refreshToken: string
}

export type LoginApiResponse = ApiResponse<LoginResponse>
export type RegisterApiResponse = ApiResponse<boolean>

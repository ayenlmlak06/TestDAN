import { ApiResponse } from './auth'

interface UserInfo {
  Id: string
  UserName: string
  Email: string
  PhoneNumber: string | null
  Avatar: string
}

export interface UpdateUserRequest {
  UserName: string
  PhoneNumber: string
  Avatar?: File
}

export type UserInfoResponse = ApiResponse<UserInfo>
export type UpdateUserResponse = ApiResponse<boolean>

export interface UserProfile {
  id: string
  userName: string
  email: string
  phoneNumber: string | null
  avatar: string
}

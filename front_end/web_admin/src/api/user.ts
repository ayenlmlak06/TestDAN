import api from './axios'
import type { UserInfoResponse, UpdateUserResponse, UpdateUserRequest } from '../types/user'

export const userApi = {
  getMyInfo: async () => {
    const response = await api.get<UserInfoResponse>('/user/get-info-mine')
    return response.data
  },

  updateProfile: async (data: UpdateUserRequest) => {
    const formData = new FormData()
    formData.append('UserName', data.UserName)
    formData.append('PhoneNumber', data.PhoneNumber)
    if (data.Avatar) {
      formData.append('Avatar', data.Avatar)
    }

    const response = await api.put<UpdateUserResponse>('/user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

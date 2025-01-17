import { ApiResponse } from '../types/auth'
import api from './axios'

export const fileApi = {
  getUploadFolders: async () => {
    const response = await api.get<ApiResponse<string[]>>('/files/upload-folders')
    return response.data
  },

  uploadFile: async (folder: string, file: File) => {
    const formData = new FormData()
    formData.append('files', file)

    const response = await api.post<string[]>(`/files/${folder}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

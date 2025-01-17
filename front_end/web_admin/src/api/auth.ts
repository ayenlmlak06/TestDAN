import axios from 'axios'
import type { LoginApiResponse, RegisterApiResponse } from '../types/auth'

const API_URL = 'https://les-app-api.azurewebsites.net/api/v1'
const DEVICE_ID = '00000000-0000-0000-0000-000000000000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    X_DEVICE_UDID: DEVICE_ID,
    'Content-Type': 'application/json'
  }
})

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<LoginApiResponse>('/user/login', {
      Email: email,
      Password: password
    })
    return response.data
  },

  register: async (email: string, password: string) => {
    const response = await api.post<RegisterApiResponse>('/user/register', {
      Email: email,
      Password: password
    })
    return response.data
  }
}

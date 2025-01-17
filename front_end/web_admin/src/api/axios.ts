import axios from 'axios'

const api = axios.create({
  baseURL: 'https://les-app-api.azurewebsites.net/api/v1',
  headers: {
    X_DEVICE_UDID: '00000000-0000-0000-0000-000000000000',
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const authUser = localStorage.getItem('auth_user')
  if (authUser) {
    const { accessToken } = JSON.parse(authUser)
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

export default api

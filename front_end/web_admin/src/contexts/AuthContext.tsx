import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import type { AuthUser } from '../types/auth'
import { authApi } from '../api/auth'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const AUTH_STORAGE_KEY = 'auth_user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  })

  const isAuthenticated = !!user

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    if (response.StatusCode === 200 && response.Data) {
      const userData: AuthUser = {
        userId: response.Data.UserId,
        userName: response.Data.UserName,
        accessToken: response.Data.AccessToken,
        refreshToken: response.Data.RefreshToken
      }
      setUser(userData)
    } else {
      throw new Error(response.Message)
    }
  }

  const register = async (email: string, password: string) => {
    const response = await authApi.register(email, password)
    if (response.StatusCode !== 200) {
      throw new Error(response.Message)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

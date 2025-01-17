import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VocabularyPage from './pages/VocabularyPage'
import ExercisePage from './pages/ExercisePage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import LessonCategoriesPage from './pages/LessonCategoriesPage'
import LessonsPage from './pages/LessonsPage'
import LessonDetailPage from './pages/LessonDetailPage'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes - redirect to home if already logged in */}
              <Route
                path='/login'
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path='/register'
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />

              {/* Protected routes - redirect to login if not authenticated */}
              <Route
                path='/'
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path='vocabulary' element={<VocabularyPage />} />
                <Route path='exercises' element={<ExercisePage />} />
                <Route path='profile' element={<ProfilePage />} />
                <Route path='lesson-categories' element={<LessonCategoriesPage />} />

                <Route path='/categories/:categoryId/lessons' element={<LessonsPage />} />
                <Route path='/lessons/:id' element={<LessonDetailPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App

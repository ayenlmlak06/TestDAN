import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const { Content } = Layout

const MainLayout = () => {
  return (
    <Layout className='min-h-screen'>
      <Sidebar />
      <Layout>
        <Header />
        <Content className='p-6'>
          <div className='bg-white p-6 rounded-lg min-h-[calc(100vh-theme(spacing.32))]'>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout

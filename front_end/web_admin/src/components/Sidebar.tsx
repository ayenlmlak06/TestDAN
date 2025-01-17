import { Layout, Menu } from 'antd'
import { DashboardOutlined, BookOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLessonCategories } from '../hooks/useLessonCategories'
import type { MenuProps } from 'antd'

const { Sider } = Layout

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { categories } = useLessonCategories()

  const lessonCategorySubMenuItems = categories.map((category) => ({
    key: `/categories/${category.Id}/lessons`,
    label: category.Name,
    icon: <BookOutlined />
  }))

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    // {
    //   key: '/vocabulary',
    //   icon: <BookOutlined />,
    //   label: 'Vocabulary'
    // },
    // {
    //   key: '/exercises',
    //   icon: <FormOutlined />,
    //   label: 'Exercises'
    // },
    {
      key: 'lessons',
      icon: <BookOutlined />,
      label: 'Lessons',
      children: lessonCategorySubMenuItems
    },
    {
      key: '/lesson-categories',
      icon: <BookOutlined />,
      label: 'Lesson Categories'
    }
  ]

  return (
    <Sider theme='light' className='min-h-screen border-r border-gray-200' width={250}>
      <div className='h-16 flex items-center justify-center border-b border-gray-200'>
        <h1 className='text-lg font-bold'>Admin Dashboard</h1>
      </div>
      <Menu
        mode='inline'
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['lessons']}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className='border-r-0'
      />
    </Sider>
  )
}

export default Sidebar

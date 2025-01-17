import { Layout, Avatar, Dropdown, MenuProps } from 'antd'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { userApi } from '../api/user'
import type { UserProfile } from '../types/user'

const { Header: AntHeader } = Layout

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await userApi.getMyInfo()
      if (response.StatusCode === 200 && response.Data) {
        setProfile({
          id: response.Data.Id,
          userName: response.Data.UserName,
          email: response.Data.Email,
          phoneNumber: response.Data.PhoneNumber,
          avatar: response.Data.Avatar
        })
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        logout()
        navigate('/login')
      }
    }
  ]

  return (
    <AntHeader className='bg-white px-6 flex items-center justify-between shadow-sm'>
      <div className='text-xl font-semibold'>English Learning Admin</div>
      <div className='flex items-center gap-4'>
        <Dropdown menu={{ items }} placement='bottomRight'>
          <div className='cursor-pointer flex items-center gap-3 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors'>
            <Avatar src={profile?.avatar} icon={<UserOutlined />} />
            <span className='text-gray-700'>{profile?.userName}</span>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  )
}

export default Header

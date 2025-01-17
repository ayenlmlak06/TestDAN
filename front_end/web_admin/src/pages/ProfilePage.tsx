import { useEffect, useState, useRef } from 'react'
import { Avatar, Skeleton, Button, message, Form, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { userApi } from '../api/user'
import type { UserProfile, UpdateUserRequest } from '../types/user'

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState<string>('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await userApi.getMyInfo()
      if (response.StatusCode === 200 && response.Data) {
        const profileData = {
          id: response.Data.Id,
          userName: response.Data.UserName,
          email: response.Data.Email,
          phoneNumber: response.Data.PhoneNumber,
          avatar: response.Data.Avatar
        }
        setProfile(profileData)
        setPreviewAvatar(response.Data.Avatar)
      }
    } catch (error) {
      console.error(error)
      message.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setPreviewAvatar(URL.createObjectURL(file))
    }
  }

  const handleUpdateProfile = async (values: { userName: string; phoneNumber: string }) => {
    try {
      setUploadLoading(true)
      const updateData: UpdateUserRequest = {
        UserName: values.userName,
        PhoneNumber: values.phoneNumber || '',
        Avatar: avatarFile || undefined
      }

      const response = await userApi.updateProfile(updateData)
      if (response.StatusCode === 200) {
        message.success('Profile updated successfully')
        await fetchProfile()
      }
    } catch (error) {
      console.error(error)
      message.error('Failed to update profile')
    } finally {
      setUploadLoading(false)
    }
  }

  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />
  }

  return (
    <div className='p-6'>
      <div className='max-w-3xl'>
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-gray-800'>Profile</h1>
          <p className='text-gray-500 mt-1'>This is how others will see you on the site.</p>
        </div>

        <Form
          initialValues={{
            userName: profile?.userName,
            phoneNumber: profile?.phoneNumber
          }}
          onFinish={handleUpdateProfile}
          className='space-y-8'
        >
          {/* Username Section */}
          <div>
            <h3 className='text-base font-medium text-gray-800 mb-2'>Username</h3>
            <Form.Item
              name='userName'
              className='mb-2'
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input className='max-w-md' />
            </Form.Item>
            <p className='text-gray-500 text-sm'>
              This is your public display name. It can be your real name or a pseudonym. You can only change this once
              every 30 days.
            </p>
          </div>

          {/* Email Section */}
          <div>
            <h3 className='text-base font-medium text-gray-800 mb-2'>Email</h3>
            <Input value={profile?.email} readOnly className='max-w-md' />
            <p className='text-gray-500 text-sm mt-2'>
              You can manage verified email addresses in your email settings.
            </p>
          </div>

          {/* Phone Section */}
          <div>
            <h3 className='text-base font-medium text-gray-800 mb-2'>Phone Number</h3>
            <Form.Item name='phoneNumber' className='mb-2'>
              <Input className='max-w-md' />
            </Form.Item>
          </div>

          {/* Avatar Section */}
          <div>
            <h3 className='text-base font-medium text-gray-800 mb-2'>Profile Picture</h3>
            <div className='flex items-center gap-4'>
              <Avatar
                size={100}
                src={previewAvatar || profile?.avatar}
                icon={<UserOutlined />}
                className='border border-gray-200'
              />
              <input type='file' ref={fileInputRef} className='hidden' accept='image/*' onChange={handleAvatarChange} />
              <Button onClick={() => fileInputRef.current?.click()} className='h-auto py-1'>
                Change avatar
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='pt-4 border-t'>
            <Button type='primary' htmlType='submit' loading={uploadLoading}>
              Save changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default ProfilePage

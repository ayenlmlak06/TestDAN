import { useState } from 'react'
import { Form, Input, Button, message, Card } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'

const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const onFinish = async (values: { Email: string; Password: string }) => {
    try {
      setLoading(true)
      await register(values.Email, values.Password)
      message.success('Registration successful')
      navigate('/login')
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 px-4'>
      {/* Left side - decorative */}
      <div className='hidden lg:flex lg:w-1/2 h-screen bg-emerald-600 items-center justify-center'>
        <div className='max-w-md text-white p-8'>
          <h1 className='text-4xl font-bold mb-6'>Welcome to Our Platform</h1>
          <p className='text-lg text-emerald-200 mb-8'>
            Join our community and start your journey to mastering English language learning.
          </p>
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <div className='bg-emerald-500 p-2 rounded-lg'>
                <UserOutlined className='text-2xl' />
              </div>
              <p className='text-emerald-200'>Track your progress with personalized dashboards</p>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='bg-emerald-500 p-2 rounded-lg'>
                <MailOutlined className='text-2xl' />
              </div>
              <p className='text-emerald-200'>Access to extensive vocabulary exercises</p>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='bg-emerald-500 p-2 rounded-lg'>
                <LockOutlined className='text-2xl' />
              </div>
              <p className='text-emerald-200'>Practice with interactive learning materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className='w-full lg:w-1/2 flex justify-center items-center min-h-screen p-8'>
        <Card bordered={false} className='w-full max-w-md shadow-xl rounded-xl'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-800'>Create an Account</h2>
            <p className='text-gray-600 mt-2'>Start your learning journey today</p>
          </div>

          <Form name='register' onFinish={onFinish} layout='vertical' size='large' className='space-y-4'>
            <Form.Item
              name='Email'
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined className='text-gray-400' />} placeholder='Email' className='rounded-lg' />
            </Form.Item>

            <Form.Item
              name='Password'
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className='text-gray-400' />}
                placeholder='Password'
                className='rounded-lg'
              />
            </Form.Item>

            <Form.Item className='mb-0'>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                className='w-full h-12 rounded-lg bg-emerald-600 hover:bg-emerald-700 border-none'
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className='mt-6 text-center'>
            <p className='text-gray-600'>
              Already have an account?{' '}
              <Link to='/login' className='text-emerald-600 hover:text-emerald-800 font-medium'>
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage

import { useState } from 'react'
import { Form, Input, Button, message, Card, Checkbox } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const onFinish = async (values: { Email: string; Password: string }) => {
    try {
      setLoading(true)
      await login(values.Email, values.Password)
      message.success('Login successful')
      navigate('/')
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 px-4'>
      {/* Left side - form */}
      <div className='hidden lg:flex lg:w-1/2 h-screen bg-emerald-600 items-center justify-center order-1 lg:order-1'>
        <div className='max-w-md text-white p-8'>
          <h1 className='text-4xl font-bold mb-6'>Welcome Back!</h1>
          <p className='text-lg text-emerald-200 mb-8'>
            Continue your journey to mastering English with our comprehensive learning platform.
          </p>
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <div className='bg-emerald-500 p-2 rounded-lg'>
                <MailOutlined className='text-2xl' />
              </div>
              <p className='text-emerald-200'>Access your personalized learning dashboard</p>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='bg-emerald-500 p-2 rounded-lg'>
                <LockOutlined className='text-2xl' />
              </div>
              <p className='text-emerald-200'>Resume your progress where you left off</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - decorative */}
      <div className='w-full lg:w-1/2 flex justify-center items-center min-h-screen p-8 order-2 lg:order-2'>
        <Card bordered={false} className='w-full max-w-md shadow-xl rounded-xl'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-800'>Welcome Back</h2>
            <p className='text-gray-600 mt-2'>Sign in to continue your learning</p>
          </div>

          <Form
            name='login'
            onFinish={onFinish}
            layout='vertical'
            size='large'
            initialValues={{ remember: true }}
            className='space-y-4'
          >
            <Form.Item
              name='Email'
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined className='text-gray-400' />} placeholder='Email' className='rounded-lg' />
            </Form.Item>

            <Form.Item name='Password' rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password
                prefix={<LockOutlined className='text-gray-400' />}
                placeholder='Password'
                className='rounded-lg'
              />
            </Form.Item>

            <div className='flex justify-between items-center mb-4'>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to='/forgot-password' className='text-emerald-600 hover:text-emerald-800'>
                Forgot password?
              </Link>
            </div>

            <Form.Item className='mb-0'>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                className='w-full h-12 rounded-lg bg-emerald-600 hover:!bg-emerald-700 border-none'
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className='mt-6 text-center'>
            <p className='text-gray-600'>
              Don't have an account?{' '}
              <Link to='/register' className='text-emerald-600 hover:text-emerald-800 font-medium'>
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage

import { Form, Input, Button, FormInstance } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useRef } from 'react'

interface CategoryFormProps {
  form: FormInstance
  onSubmit: (values: { name: string }, file: File | undefined) => void
  onCancel: () => void
  previewImage: string
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isLoading: boolean
  isEditing: boolean
}

const CategoryForm = ({
  form,
  onSubmit,
  onCancel,
  previewImage,
  onImageChange,
  isLoading,
  isEditing
}: CategoryFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (values: { name: string }) => {
    const file = fileInputRef.current?.files?.[0] || undefined
    onSubmit(values, file)
  }

  return (
    <Form form={form} onFinish={handleSubmit} layout='vertical'>
      <Form.Item name='name' label='Category Name' rules={[{ required: true, message: 'Please input category name!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label='Thumbnail'>
        <div className='space-y-4'>
          {previewImage && (
            <div className='w-full aspect-square rounded-lg overflow-hidden p-16'>
              <img src={previewImage} alt='Preview' className='w-full h-full object-cover' />
            </div>
          )}
          <input type='file' ref={fileInputRef} accept='image/*' onChange={onImageChange} className='hidden' />
          <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()} block>
            {previewImage ? 'Change Thumbnail' : 'Upload Thumbnail'}
          </Button>
        </div>
      </Form.Item>

      <Form.Item className='mb-0 text-right'>
        <Button type='default' onClick={onCancel} className='mr-2'>
          Cancel
        </Button>
        <Button type='primary' htmlType='submit' loading={isLoading}>
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CategoryForm

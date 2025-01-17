import { useState } from 'react'
import { Button, Form, message, Empty, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useLessonCategories } from '../hooks/useLessonCategories'
import type { LessonCategory } from '../types/lessonCategory'
import CategoryCard from '../components/lesson-categories/CategoryCard'
import CategoryModal from '../components/lesson-categories/CategoryModal'

const LessonCategoriesPage = () => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string>('')
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useLessonCategories()

  const handleSubmit = async (values: { name: string }, file: File | undefined) => {
    try {
      if (!file && !editingId) {
        message.error('Please select a thumbnail image')
        return
      }

      if (editingId) {
        await updateCategory.mutateAsync({
          id: editingId,
          data: {
            Name: values.name,
            Thumbnail: file
          }
        })
        message.success('Category updated successfully')
      } else {
        if (!file) return
        await createCategory.mutateAsync({
          Name: values.name,
          Thumbnail: file
        })
        message.success('Category created successfully')
      }

      handleCloseModal()
    } catch (error) {
      console.error(error)
      message.error('Operation failed')
    }
  }

  const handleEdit = (category: LessonCategory) => {
    setEditingId(category.Id)
    form.setFieldsValue({ name: category.Name })
    setPreviewImage(category.Thumbnail)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setPreviewImage('')
    form.resetFields()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
        <Spin size='large' />
      </div>
    )
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Lesson Categories</h1>
          <p className='text-gray-500 mt-1'>Manage your lesson categories here</p>
        </div>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} size='large'>
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <Empty description='No categories found' />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
          {categories.map((category) => (
            <CategoryCard
              key={category.Id}
              category={category}
              onEdit={handleEdit}
              onDelete={(id) => deleteCategory.mutate(id)}
            />
          ))}
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        form={form}
        onSubmit={handleSubmit}
        previewImage={previewImage}
        onImageChange={handleImageChange}
        isLoading={createCategory.isPending || updateCategory.isPending}
        isEditing={!!editingId}
      />
    </div>
  )
}

export default LessonCategoriesPage

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Empty, Spin, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useLesson, useLessons } from '../hooks/useLessons'
import { useLessonCategories } from '../hooks/useLessonCategories'
import LessonCard from '../components/lessons/LessonCard'
import CreateLessonForm from '../components/lessons/CreateLessonForm'
import type { CreateLessonRequest, LessonDetail } from '../types/lesson'
import { queryClient } from '../api/queryClient'

const LessonsPage = () => {
  const { categoryId = '' } = useParams()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<LessonDetail | null>(null)

  const { categories } = useLessonCategories()
  const { lessons, isLoading, createLesson, updateLesson, deleteLesson } = useLessons(categoryId)
  const { data: eachLesson } = useLesson(editingLesson?.Id || '')

  const currentCategory = categories.find((c) => c.Id === categoryId)

  const handleSubmit = async (values: CreateLessonRequest) => {
    console.log(values)
    try {
      if (editingLesson) {
        await updateLesson.mutateAsync({
          id: editingLesson.Id,
          data: {
            ...values
          }
        })
      } else {
        await createLesson.mutateAsync(values)
      }
      setIsModalOpen(false)
      setEditingLesson(null)
      queryClient.invalidateQueries({ queryKey: ['lesson', editingLesson?.Id] })
      queryClient.invalidateQueries({ queryKey: ['lesson', eachLesson?.Id] })
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = (eachLesson: LessonDetail) => {
    setEditingLesson(eachLesson)
    setIsModalOpen(true)
  }

  const handleDeleteLesson = async (id: string) => {
    try {
      await deleteLesson.mutateAsync(id)
    } catch (error) {
      console.error(error)
    }
  }

  if (!currentCategory) {
    return (
      <Empty
        description='Please select a category'
        className='h-[calc(100vh-200px)] flex flex-col items-center justify-center'
      />
    )
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>{currentCategory.Name} Lessons</h1>
          <p className='text-gray-500 mt-1'>Manage your {currentCategory.Name.toLowerCase()} lessons here</p>
        </div>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} size='large'>
          Create Lesson
        </Button>
      </div>

      {/* Lessons Grid */}
      {isLoading ? (
        <div className='flex justify-center items-center h-[400px]'>
          <Spin size='large' />
        </div>
      ) : lessons.length === 0 ? (
        <Empty description={`No ${currentCategory.Name.toLowerCase()} lessons found`} />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {lessons.map((lesson: LessonDetail) => (
            <LessonCard
              key={lesson.Id}
              lesson={lesson}
              onView={(id) => navigate(`/lessons/${id}`)}
              onEdit={() => handleEdit(lesson)}
              onDelete={handleDeleteLesson}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Lesson Modal */}
      <Modal
        title={`${editingLesson ? 'Edit' : 'Create New'} ${currentCategory.Name} Lesson`}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingLesson(null)
        }}
        footer={null}
        width={800}
      >
        <CreateLessonForm
          onSubmit={handleSubmit}
          isLoading={createLesson.isPending || updateLesson.isPending}
          categoryId={categoryId}
          categoryType={currentCategory.Name as 'Grammar' | 'Vocabulary'}
          initialValues={eachLesson || undefined}
        />
      </Modal>
    </div>
  )
}

export default LessonsPage

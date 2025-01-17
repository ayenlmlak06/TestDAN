import { Card, Button, Tooltip, Popconfirm } from 'antd'
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { LessonDetail } from '../../types/lesson'

interface LessonCardProps {
  lesson: LessonDetail
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const LessonCard = ({ lesson, onView, onEdit, onDelete }: LessonCardProps) => {
  return (
    <Card
      hoverable
      className='overflow-hidden transition-all duration-300 hover:shadow-lg'
      cover={
        <div className='relative aspect-video'>
          <img
            src={lesson.Thumbnail || '/placeholder-lesson.png'}
            alt={lesson.Title}
            className='w-full h-full object-cover'
          />
        </div>
      }
      actions={[
        <Tooltip title='View Lesson' key='view'>
          <Button type='text' icon={<EyeOutlined />} onClick={() => onView(lesson.Id)} />
        </Tooltip>,
        <Tooltip title='Edit Lesson' key='edit'>
          <Button type='text' icon={<EditOutlined />} onClick={() => onEdit(lesson.Id)} />
        </Tooltip>,
        <Popconfirm
          key='delete'
          title='Delete this lesson?'
          description='This action cannot be undone.'
          onConfirm={() => onDelete(lesson.Id)}
        >
          <Button type='text' danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ]}
    >
      <Card.Meta
        title={lesson.Title}
        description={<span className='text-sm text-gray-500'>{lesson.LessonCategoryName}</span>}
      />
    </Card>
  )
}

export default LessonCard

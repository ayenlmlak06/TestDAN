import { Card, Button, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { LessonCategory } from '../../types/lessonCategory'

interface CategoryCardProps {
  category: LessonCategory
  onEdit: (category: LessonCategory) => void
  onDelete: (id: string) => void
}

const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
  return (
    <Card
      key={category.Id}
      cover={
        <div className='aspect-square p-10' onClick={() => onEdit(category)}>
          <img src={category.Thumbnail} alt={category.Name} className='w-full h-full object-cover' />
        </div>
      }
      actions={[
        <Button key='edit' icon={<EditOutlined />} onClick={() => onEdit(category)} />,
        <Popconfirm key='delete' title='Delete this category?' onConfirm={() => onDelete(category.Id)}>
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ]}
      hoverable
      className='transition-shadow duration-300'
    >
      <Card.Meta title={category.Name} />
    </Card>
  )
}

export default CategoryCard

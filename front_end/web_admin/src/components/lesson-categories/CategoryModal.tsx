import { Modal, FormInstance } from 'antd'
import CategoryForm from './CategoryForm'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  form: FormInstance
  onSubmit: (values: { name: string }, file: File | undefined) => void
  previewImage: string
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isLoading: boolean
  isEditing: boolean
}

const CategoryModal = ({
  isOpen,
  onClose,
  form,
  onSubmit,
  previewImage,
  onImageChange,
  isLoading,
  isEditing
}: CategoryModalProps) => {
  return (
    <Modal title={isEditing ? 'Edit Category' : 'Add New Category'} open={isOpen} onCancel={onClose} footer={null}>
      <CategoryForm
        form={form}
        onSubmit={onSubmit}
        onCancel={onClose}
        previewImage={previewImage}
        onImageChange={onImageChange}
        isLoading={isLoading}
        isEditing={isEditing}
      />
    </Modal>
  )
}

export default CategoryModal

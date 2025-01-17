import { useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useExercises } from '../hooks/useApi'
import type { Exercise } from '../types'
import { ColumnType } from 'antd/es/table'
import { getCategoryColor, getDifficultyColor, getTypeColor } from '../utils/colorMapping'
import debounce from 'lodash/debounce'
import useExerciseFilters from '../hooks/useExerciseFilters'

const ExercisesPage = () => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const { exercises, isLoading, createExercise, updateExercise, deleteExercise } = useExercises()
  const { setSearchText, filters, setFilters, filteredExercises, filterOptions } = useExerciseFilters(exercises)

  const handleSearch = debounce((value: string) => {
    setSearchText(value)
  }, 300)

  const setTypeFilter = (value: string[]) => {
    setFilters({ ...filters, type: value })
  }

  const setDifficultyFilter = (value: string[]) => {
    setFilters({ ...filters, difficulty: value })
  }

  const setCategoryFilter = (value: string[]) => {
    setFilters({ ...filters, category: value })
  }

  const columns: ColumnType<Exercise>[] = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getTypeColor(type)} style={{ textTransform: 'capitalize' }}>
          {type}
        </Tag>
      )
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: string) => (
        <Tag color={getDifficultyColor(difficulty)} style={{ textTransform: 'capitalize' }}>
          {difficulty}
        </Tag>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={getCategoryColor(category)} style={{ textTransform: 'capitalize' }}>
          {category}
        </Tag>
      )
    },
    {
      title: 'Correct Answer',
      dataIndex: 'correctAnswer',
      key: 'correctAnswer'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: string, record: Exercise) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title='Delete this exercise?' onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const handleEdit = (record: Exercise) => {
    setEditingId(record.id)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteExercise.mutateAsync(id)
      message.success('Exercise deleted successfully')
    } catch (error) {
      console.error('Error:', error)
      message.error('Failed to delete exercise')
    }
  }

  const handleSubmit = async (values: Exercise) => {
    try {
      if (editingId) {
        await updateExercise.mutateAsync({
          id: editingId,
          data: values
        })
        message.success('Exercise updated successfully')
      } else {
        await createExercise.mutateAsync(values)
        message.success('Exercise added successfully')
      }
      setIsModalOpen(false)
      form.resetFields()
      setEditingId(null)
    } catch (error) {
      console.error('Error:', error)
      message.error('Operation failed')
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Exercise Management</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null)
            setIsModalOpen(true)
          }}
        >
          Add Exercise
        </Button>
      </div>

      <div className='mb-4 flex justify-between'>
        <Input.Search
          onChange={(e) => setSearchText(e.target.value)}
          placeholder='Search in questions and answers...'
          allowClear
          onSearch={handleSearch}
          className='max-w-md'
        />

        <div className='flex gap-4'>
          <Select
            mode='multiple'
            allowClear
            placeholder='Filter by type'
            onChange={setTypeFilter}
            style={{ minWidth: 200 }}
            options={filterOptions.type.map((type) => ({
              label: type.replace('-', ' '),
              value: type
            }))}
          />

          <Select
            mode='multiple'
            allowClear
            placeholder='Filter by difficulty'
            onChange={setDifficultyFilter}
            style={{ minWidth: 200 }}
            options={filterOptions.difficulty.map((difficulty) => ({
              label: difficulty,
              value: difficulty
            }))}
          />

          <Select
            mode='multiple'
            allowClear
            placeholder='Filter by category'
            onChange={setCategoryFilter}
            style={{ minWidth: 200 }}
            options={filterOptions.category.map((category) => ({
              label: category,
              value: category
            }))}
          />
        </div>
      </div>

      <Table columns={columns} dataSource={filteredExercises} loading={isLoading} rowKey='id' />

      <Modal
        title={editingId ? 'Edit Exercise' : 'Add New Exercise'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
          setEditingId(null)
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout='vertical'>
          <Form.Item name='question' label='Question' rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name='type' label='Type' rules={[{ required: true }]}>
            <Select>
              <Select.Option value='multiple-choice'>Multiple Choice</Select.Option>
              <Select.Option value='fill-in-blank'>Fill in the Blank</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name='difficulty' label='Difficulty' rules={[{ required: true }]}>
            <Select>
              <Select.Option value='easy'>Easy</Select.Option>
              <Select.Option value='medium'>Medium</Select.Option>
              <Select.Option value='hard'>Hard</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name='category' label='Category' rules={[{ required: true }]}>
            <Select>
              <Select.Option value='vocabulary'>Vocabulary</Select.Option>
              <Select.Option value='grammar'>Grammar</Select.Option>
              <Select.Option value='reading'>Reading</Select.Option>
              <Select.Option value='listening'>Listening</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name='correctAnswer' label='Correct Answer' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className='mb-0 text-right'>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type='primary' htmlType='submit' loading={isLoading} disabled={isLoading}>
                {editingId ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ExercisesPage

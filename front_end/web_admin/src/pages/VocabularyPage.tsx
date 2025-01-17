import { useState, useMemo } from 'react'
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useVocabulary } from '../hooks/useApi'
import type { Vocabulary } from '../types'
import debounce from 'lodash/debounce'
import { ColumnType } from 'antd/es/table'

const VocabularyPage = () => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchText, setSearchText] = useState('')
  const { vocabulary, isLoading, createVocabulary, updateVocabulary, deleteVocabulary } = useVocabulary()

  const filteredData = useMemo(() => {
    if (!searchText) return vocabulary

    const searchLower = searchText.toLowerCase()
    return vocabulary.filter(
      (item) =>
        item.word.toLowerCase().includes(searchLower) ||
        item.meaning.toLowerCase().includes(searchLower) ||
        item.example.toLowerCase().includes(searchLower)
    )
  }, [vocabulary, searchText])

  const handleSearch = debounce((value: string) => {
    setSearchText(value)
  }, 300)

  const columns: ColumnType<Vocabulary>[] = [
    {
      title: 'Word',
      dataIndex: 'word',
      key: 'word'
    },
    {
      title: 'Meaning',
      dataIndex: 'meaning',
      key: 'meaning'
    },
    {
      title: 'Pronunciation',
      dataIndex: 'pronunciation',
      key: 'pronunciation'
    },
    {
      title: 'Example',
      dataIndex: 'example',
      key: 'example'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: Vocabulary, record: Vocabulary) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title='Delete this word?' onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const handleEdit = (record: Vocabulary) => {
    setEditingId(record.id)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteVocabulary.mutateAsync(id)
      message.success('Word deleted successfully')
    } catch (error) {
      console.error('Error:', error)
      message.error('Failed to delete word')
    }
  }

  const handleSubmit = async (values: Vocabulary) => {
    try {
      if (editingId) {
        await updateVocabulary.mutateAsync({
          id: editingId,
          data: values
        })
        message.success('Word updated successfully')
      } else {
        await createVocabulary.mutateAsync(values)
        message.success('Word added successfully')
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
        <h1 className='text-2xl font-bold'>Vocabulary Management</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null)
            setIsModalOpen(true)
          }}
        >
          Add Word
        </Button>
      </div>

      <div className='mb-4 w-1/3'>
        <Input.Search
          placeholder='Search words, meanings, or examples...'
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={isLoading}
        rowKey='id'
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50']
        }}
      />

      <Modal
        title={editingId ? 'Edit Word' : 'Add New Word'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout='vertical'>
          <Form.Item name='word' label='Word' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='meaning' label='Meaning' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='pronunciation' label='Pronunciation' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='example' label='Example' rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item className='mb-0 text-right'>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type='primary' htmlType='submit'>
                {editingId ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default VocabularyPage

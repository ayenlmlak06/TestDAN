import { Form, Input, Button, Space, Card, Divider, Upload, Select } from 'antd'
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons'
import type { CreateLessonRequest, LessonDetail } from '../../types/lesson'
import { useFileUpload } from '../../hooks/useFileUpload'
import { message } from 'antd'
import { fileApi } from '../../api/file'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

interface CreateLessonFormProps {
  onSubmit: (values: CreateLessonRequest) => void
  isLoading: boolean
  categoryId: string
  categoryType: 'Grammar' | 'Vocabulary'
  initialValues?: LessonDetail
}

interface FormValues {
  Id?: string
  title: string
  thumbnail: string
  questions: {
    Id?: string
    content: string
    answers: {
      Id?: string
      content: string
      isCorrect: boolean
    }[]
  }[]
  grammars?: {
    Id?: string
    content: string
    note: string
  }[]
  vocabularies?: {
    Id?: string
    word: string
    pronunciation: string
    meaning: string
    example: string
    medias: string[]
  }[]
}

const CreateLessonForm = ({ onSubmit, isLoading, categoryId, categoryType, initialValues }: CreateLessonFormProps) => {
  const [form] = Form.useForm<FormValues>()
  const { uploadFile } = useFileUpload()
  const [selectedFolder, setSelectedFolder] = useState<string>('vocabulary')

  const { data: folders } = useQuery({
    queryKey: ['uploadFolders'],
    queryFn: async () => {
      const response = await fileApi.getUploadFolders()
      return response.Data
    }
  })

  /* eslint-disable @typescript-eslint/no-explicit-any */

  // Log to debug
  console.log('Initial Values:', initialValues)
  console.log('Category Type:', categoryType)

  // Initialize form with default values
  useEffect(() => {
    const defaultValues: FormValues = {
      Id: initialValues?.Id,
      title: initialValues?.Title || '',
      thumbnail: initialValues?.Thumbnail || '',
      questions: initialValues?.Questions?.map((q) => ({
        Id: q.Id,
        content: q.Content,
        answers:
          q.Answers?.map((a) => ({
            Id: a.Id,
            content: a.Content,
            isCorrect: a.IsCorrect
          })) || []
      })) || [{ content: '', answers: [{ content: '', isCorrect: false }] }]
    }

    // Add category-specific fields
    if (categoryType === 'Grammar') {
      defaultValues.grammars = initialValues?.Grammars?.map((g) => ({
        Id: g.Id,
        content: g.Content,
        note: g.Note
      })) || [{ content: '', note: '' }]
    } else {
      defaultValues.vocabularies = initialValues?.Vocabularies?.map((v) => ({
        Id: v.Id,
        word: v.Word,
        pronunciation: v.Pronunciation,
        meaning: v.Meaning,
        example: v.Example,
        medias: v.Medias || []
      })) || [{ word: '', pronunciation: '', meaning: '', example: '', medias: [] }]
    }

    console.log('Setting form values:', defaultValues)
    form.setFieldsValue(defaultValues)
  }, [form, initialValues, categoryType])

  const handleSubmit = (values: FormValues) => {
    const formattedValues: CreateLessonRequest = {
      Id: initialValues?.Id,
      Title: values.title,
      LessonCategoryId: categoryId,
      Thumbnail: values.thumbnail || '',
      Questions: (values.questions || []).map((q) => ({
        Id: q.Id,
        Content: q.content,
        Answers: (q.answers || []).map((a) => ({
          Id: a.Id,
          Content: a.content,
          IsCorrect: Boolean(a.isCorrect)
        }))
      }))
    }

    if (categoryType === 'Grammar') {
      formattedValues.Grammars = (values.grammars || []).map((g) => ({
        Id: g.Id,
        Content: g.content,
        Note: g.note || ''
      }))
    } else {
      formattedValues.Vocabularies = (values.vocabularies || []).map((v) => ({
        Id: v.Id,
        Word: v.word,
        Pronunciation: v.pronunciation || '',
        Meaning: v.meaning || '',
        Example: v.example || '',
        Medias: Array.isArray(v.medias)
          ? v.medias.map((media: any) => {
              if (typeof media === 'string') return media
              return media.url || media.thumbUrl || ''
            })
          : v.medias
            ? [typeof v.medias === 'string' ? v.medias : (v.medias as any).url || (v.medias as any).thumbUrl || '']
            : []
      }))
    }

    onSubmit(formattedValues)
  }

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit} className='max-w-4xl mx-auto'>
      {/* Basic Information */}
      <Card className='mb-6'>
        <h3 className='text-lg font-medium mb-4'>Basic Information</h3>
        <Form.Item name='title' label='Lesson Title' rules={[{ required: true, message: 'Please enter lesson title' }]}>
          <Input placeholder='Enter lesson title' />
        </Form.Item>

        <Form.Item
          name='thumbnail'
          label='Thumbnail URL'
          rules={[{ required: true, message: 'Please enter thumbnail URL' }]}
        >
          <Input placeholder='Enter thumbnail URL' />
        </Form.Item>
      </Card>
      {/* Grammar or Vocabulary Section */}
      {categoryType === 'Grammar' ? (
        <Card className='mb-6'>
          <h3 className='text-lg font-medium mb-4'>Grammar Rules</h3>
          <Form.List name='grammars'>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} className='mb-4'>
                    <Space className='w-full' direction='vertical'>
                      <Form.Item
                        {...field}
                        name={[field.name, 'content']}
                        label='Content'
                        rules={[{ required: true, message: 'Please enter grammar content' }]}
                      >
                        <Input.TextArea placeholder='Grammar rule content' />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'note']}
                        label='Notes'
                        rules={[{ required: true, message: 'Please enter grammar notes' }]}
                      >
                        <Input.TextArea placeholder='Additional notes' />
                      </Form.Item>
                      <Button type='text' danger onClick={() => remove(field.name)}>
                        <MinusCircleOutlined /> Remove Rule
                      </Button>
                    </Space>
                    <Divider />
                  </div>
                ))}
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Grammar Rule
                </Button>
              </>
            )}
          </Form.List>
        </Card>
      ) : (
        <Card className='mb-6'>
          <h3 className='text-lg font-medium mb-4'>Vocabulary Items</h3>
          <Form.List name='vocabularies'>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} className='mb-4'>
                    <Space className='w-full' direction='vertical'>
                      <Form.Item
                        {...field}
                        name={[field.name, 'word']}
                        label='Word'
                        rules={[{ required: true, message: 'Please enter word' }]}
                      >
                        <Input placeholder='Word' />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'pronunciation']}
                        label='Pronunciation'
                        rules={[{ required: true, message: 'Please enter pronunciation' }]}
                      >
                        <Input placeholder='Pronunciation' />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'meaning']}
                        label='Meaning'
                        rules={[{ required: true, message: 'Please enter meaning' }]}
                      >
                        <Input.TextArea placeholder='Meaning' />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'example']}
                        label='Example'
                        rules={[{ required: true, message: 'Please enter example' }]}
                      >
                        <Input.TextArea placeholder='Example' />
                      </Form.Item>
                      <Form.Item {...field} name={[field.name, 'medias']} label='Medias'>
                        <Space direction='vertical' className='w-full'>
                          <Select
                            value={selectedFolder}
                            onChange={setSelectedFolder}
                            style={{ width: '200px' }}
                            options={folders?.map((folder) => ({
                              label: folder,
                              value: folder
                            }))}
                            placeholder='Select upload folder'
                          />
                          <Upload
                            listType='picture'
                            beforeUpload={async (file) => {
                              try {
                                const [url] = await uploadFile.mutateAsync({
                                  folder: selectedFolder,
                                  file
                                })
                                form.setFieldValue(['vocabularies', field.name, 'medias'], [url])
                                message.success('Upload successful')
                              } catch (error) {
                                console.log(error)
                                message.error('Upload failed')
                              }
                              return false
                            }}
                          >
                            <Button icon={<UploadOutlined />}>Upload Media</Button>
                          </Upload>
                        </Space>
                      </Form.Item>
                      <Button type='text' danger onClick={() => remove(field.name)}>
                        <MinusCircleOutlined /> Remove Word
                      </Button>
                    </Space>
                    <Divider />
                  </div>
                ))}
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Vocabulary
                </Button>
              </>
            )}
          </Form.List>
        </Card>
      )}
      {/* Questions Section */}
      <Card>
        <h3 className='text-lg font-medium mb-4'>Questions</h3>
        <Form.List
          name='questions'
          initialValue={
            initialValues?.Questions?.map((q) => ({
              content: q.Content,
              answers: q.Answers?.map((a) => ({
                content: a.Content,
                isCorrect: a.IsCorrect
              }))
            })) || [{ content: '', answers: [{ content: '', isCorrect: false }] }]
          }
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div key={field.key} className='mb-4'>
                  <Space className='w-full' direction='vertical'>
                    <Form.Item
                      {...field}
                      name={[field.name, 'content']}
                      rules={[{ required: true, message: 'Please enter question content' }]}
                    >
                      <Input.TextArea placeholder='Question content' />
                    </Form.Item>

                    <Form.List name={[field.name, 'answers']}>
                      {(answerFields, { add: addAnswer, remove: removeAnswer }) => (
                        <>
                          {answerFields.map((answerField) => (
                            <Space key={answerField.key} className='w-full'>
                              <Form.Item
                                {...answerField}
                                name={[answerField.name, 'content']}
                                rules={[{ required: true, message: 'Please enter answer content' }]}
                              >
                                <Input placeholder={`Answer ${answerField.name + 1}`} />
                              </Form.Item>
                              <Form.Item
                                {...answerField}
                                name={[answerField.name, 'isCorrect']}
                                valuePropName='checked'
                              >
                                <Button
                                  type={
                                    form.getFieldValue([
                                      'questions',
                                      field.name,
                                      'answers',
                                      answerField.name,
                                      'isCorrect'
                                    ])
                                      ? 'primary'
                                      : 'default'
                                  }
                                  className={
                                    form.getFieldValue([
                                      'questions',
                                      field.name,
                                      'answers',
                                      answerField.name,
                                      'isCorrect'
                                    ])
                                      ? 'bg-green-500 hover:bg-green-600'
                                      : ''
                                  }
                                  onClick={() => {
                                    const answers = form.getFieldValue(['questions', field.name, 'answers']) || []
                                    // Update all answers to false first
                                    const updatedAnswers = answers.map((_: any, idx: number) => ({
                                      ...answers[idx],
                                      isCorrect: idx === answerField.name
                                    }))
                                    // Update the entire answers array at once
                                    form.setFieldValue(['questions', field.name, 'answers'], updatedAnswers)
                                    // Force form to rerender
                                    form.validateFields()
                                  }}
                                >
                                  Correct Answer
                                </Button>
                              </Form.Item>
                              {answerFields.length > 1 && (
                                <Button type='text' danger onClick={() => removeAnswer(answerField.name)}>
                                  <MinusCircleOutlined />
                                </Button>
                              )}
                            </Space>
                          ))}
                          {answerFields.length < 4 && (
                            <Button type='dashed' onClick={() => addAnswer()} block icon={<PlusOutlined />}>
                              Add Answer
                            </Button>
                          )}
                        </>
                      )}
                    </Form.List>
                    <Button type='text' danger onClick={() => remove(field.name)}>
                      <MinusCircleOutlined /> Remove Question
                    </Button>
                  </Space>
                  <Divider />
                </div>
              ))}
              <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                Add Question
              </Button>
            </>
          )}
        </Form.List>
      </Card>

      {/* Submit Button */}
      <Form.Item className='mt-6'>
        <Button type='primary' htmlType='submit' loading={isLoading} block>
          {initialValues ? 'Update' : 'Create'} Lesson
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CreateLessonForm

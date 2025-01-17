import { useParams, useNavigate } from 'react-router-dom'
import { Card, Tabs, Button, Spin, Empty, Typography, Space, Tag } from 'antd'
import { ArrowLeftOutlined, BookOutlined } from '@ant-design/icons'
import { useLesson } from '../hooks/useLessons'

const { Title, Text, Paragraph } = Typography

const LessonDetailPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: lesson, isLoading } = useLesson(id)

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-200px)]'>
        <Spin size='large' />
      </div>
    )
  }

  if (!lesson) {
    return (
      <Empty
        description='Lesson not found'
        className='h-[calc(100vh-200px)] flex flex-col items-center justify-center'
      />
    )
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-6'>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className='mb-4'>
          Back
        </Button>
        <Title level={2}>{lesson.Title}</Title>
        <Space size='middle'>
          <Tag color='blue'>{lesson.LessonCategoryName}</Tag>
          <Text type='secondary'>
            <Space>
              <BookOutlined /> {lesson.TotalView} Views
            </Space>
          </Text>
        </Space>
      </div>

      {/* Content */}
      <Tabs
        defaultActiveKey='content'
        items={[
          {
            key: 'content',
            label: 'Content',
            children: (
              <Card>
                {lesson.Grammars?.length > 0 && (
                  <div className='mb-8'>
                    <Title level={4}>Grammar Rules</Title>
                    {lesson.Grammars.map((grammar, index) => (
                      <Card key={index} className='mb-4'>
                        <Paragraph>{grammar.Content}</Paragraph>
                        {grammar.Note && <Paragraph type='secondary'>Note: {grammar.Note}</Paragraph>}
                      </Card>
                    ))}
                  </div>
                )}

                {lesson.Vocabularies?.length > 0 && (
                  <div className='mb-8'>
                    <Title level={4}>Vocabulary</Title>
                    {lesson.Vocabularies.map((vocab) => (
                      <Card key={vocab.Id} className='mb-4'>
                        <Title level={5}>{vocab.Word}</Title>
                        <Text className='block'>{vocab.Pronunciation}</Text>
                        <Paragraph>{vocab.Meaning}</Paragraph>
                        <Paragraph italic>Example: {vocab.Example}</Paragraph>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            )
          },
          {
            key: 'questions',
            label: 'Questions',
            children: (
              <Card>
                {lesson.Questions.map((question, qIndex) => (
                  <Card key={question.Id} className='mb-4'>
                    <Title level={5}>Question {qIndex + 1}</Title>
                    <Paragraph>{question.Content}</Paragraph>
                    <Space direction='vertical' className='w-full'>
                      {question.Answers.map((answer) => (
                        <Button
                          key={answer.Id}
                          block
                          type={answer.IsCorrect ? 'primary' : 'default'}
                          className={answer.IsCorrect ? 'bg-green-500' : ''}
                        >
                          {answer.Content}
                        </Button>
                      ))}
                    </Space>
                  </Card>
                ))}
              </Card>
            )
          }
        ]}
      />
    </div>
  )
}

export default LessonDetailPage

import { Card, Row, Col, Statistic } from 'antd'
import { BookOutlined, FormOutlined, UserOutlined } from '@ant-design/icons'
import { useVocabulary, useExercises } from '../hooks/useApi'

const DashboardPage = () => {
  const { vocabulary, isLoading: vocabLoading } = useVocabulary()
  const { exercises, isLoading: exercisesLoading } = useExercises()

  const stats = [
    {
      title: 'Total Vocabulary',
      value: vocabulary.length,
      icon: <BookOutlined className='text-blue-500 text-2xl' />,
      loading: vocabLoading
    },
    {
      title: 'Total Exercises',
      value: exercises.length,
      icon: <FormOutlined className='text-green-500 text-2xl' />,
      loading: exercisesLoading
    },
    {
      title: 'Active Users',
      value: 150, // Mock data
      icon: <UserOutlined className='text-purple-500 text-2xl' />,
      loading: false
    }
  ]

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title={
                  <div className='flex items-center gap-2'>
                    {stat.icon}
                    <span>{stat.title}</span>
                  </div>
                }
                value={stat.value}
                loading={stat.loading}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default DashboardPage

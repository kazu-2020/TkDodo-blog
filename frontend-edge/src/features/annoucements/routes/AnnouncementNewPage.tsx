import { useNavigate } from 'react-router-dom'
import { Box , useToast } from '@chakra-ui/react'

import { AnnouncementForm } from '../components/AnnouncementForm'
import { useCreateAnnouncement } from '../api/createAnnouncements'

export const AnnouncementNewPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { mutate: createAnnouncement } = useCreateAnnouncement({
    config: {
      onSuccess: () => {
        navigate('/announcements')
        toast({
          title: '作成しました。',
          status: 'success',
          isClosable: true,
          position: 'top-right'
        })
      },
      onError: () => {
        toast({
          title: '新規作成に失敗しました。',
          status: 'error',
          isClosable: true,
          position: 'top-right'
        })
      }
    }
  })

  return (
    <Box p={4}>
      <AnnouncementForm onSubmit={createAnnouncement} />
    </Box>
  )
}

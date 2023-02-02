import { useNavigate } from 'react-router-dom'
import { Box, useToast } from '@chakra-ui/react'

import { AnnouncementForm, FormInput } from '../components/AnnouncementForm'
import { useCreateAnnouncement } from '../api/createAnnouncements'

export const NewAnnouncement = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { mutateAsync: createAnnouncementAsync } = useCreateAnnouncement()

  const onSubmit = async (formData: FormInput) => {
    try {
      await createAnnouncementAsync(formData)
      navigate('/announcements')
      toast({
        title: '作成しました。',
        status: 'success',
        isClosable: true,
        position: 'top-right'
      })
    } catch {
      toast({
        title: '新規作成に失敗しました。',
        status: 'error',
        isClosable: true,
        position: 'top-right'
      })
    }
  }

  return (
    <Box p={4}>
      <AnnouncementForm {...{ onSubmit }} />
    </Box>
  )
}

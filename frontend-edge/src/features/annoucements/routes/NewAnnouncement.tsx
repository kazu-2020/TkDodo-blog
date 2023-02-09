import { useNavigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'

import { useToastForCreation } from '@/hooks/useToast'

import { AnnouncementForm, FormInput } from '../components/AnnouncementForm'
import { useCreateAnnouncement } from '../api/createAnnouncements'

export const NewAnnouncement = () => {
  const navigate = useNavigate()
  const toast = useToastForCreation()
  const { mutateAsync: createAnnouncementAsync } = useCreateAnnouncement()

  const onSubmit = async (formData: FormInput) => {
    await createAnnouncementAsync(formData, {
      onSuccess: () => {
        navigate('/announcements')
        toast.success()
      },
      onError: () => {
        toast.fail()
      }
    })
  }

  return (
    <Box p={4}>
      <AnnouncementForm {...{ onSubmit }} />
    </Box>
  )
}

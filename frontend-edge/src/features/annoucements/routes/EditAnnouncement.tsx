import { useParams } from 'react-router-dom'
import { Box, useToast } from '@chakra-ui/react'

import { AnnouncementForm, FormInput } from '../components/AnnouncementForm'
import { useUpdateAnnouncement } from '../api/updateAnnouncement'
import { useAnnouncement } from '../api/getAnnouncement'

export const EditAnnouncement = () => {
  const { announcementId } = useParams()
  const toast = useToast({
    isClosable: true,
    position: 'top-right'
  })

  const { data, isLoading } = useAnnouncement({
    params: {
      announcementId: announcementId!
    }
  })

  const { mutateAsync: updateAnnouncementAsync } = useUpdateAnnouncement()

  const onSubmitForm = async (formData: FormInput) => {
    try {
      await updateAnnouncementAsync({ id: announcementId!, data: formData })
      toast({
        title: '保存しました。',
        status: 'success'
      })
    } catch {
      toast({
        title: '保存に失敗しました。',
        status: 'error'
      })
    }
  }

  return (
    <Box p={4}>
      {!isLoading && (
        <AnnouncementForm
          isEdit
          status={data?.announcement?.status}
          contents={data?.announcement?.contents}
          onSubmit={onSubmitForm}
        />
      )}
    </Box>
  )
}

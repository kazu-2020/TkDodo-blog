import { useParams } from 'react-router-dom'
import { useCallback } from 'react'
import { Box, useToast } from '@chakra-ui/react'

import { AnnouncementForm, FormInput } from '../components/AnnouncementForm'
import { useUpdateAnnouncement } from '../api/updateAnnouncement'
import { useAnnouncement } from '../api/getAnnouncement'

export const AnnouncementEditPage = () => {
  const { announcementId } = useParams()
  const toast = useToast()

  const { data, isLoading } = useAnnouncement({
    params: {
      announcementId: announcementId!
    }
  })

  const { mutate: updateAnnouncement } = useUpdateAnnouncement({
    config: {
      onSuccess: () => {
        if (!toast.isActive('update-announcement-success')) {
          toast({
            id: 'update-announcement-success',
            title: '保存しました。',
            status: 'success',
            isClosable: true,
            position: 'top-right'
          })
        }
      },
      onError: () => {
        if (!toast.isActive('update-announcement-error')) {
          toast({
            id: 'update-announcement-error',
            title: '保存に失敗しました。',
            status: 'error',
            isClosable: true,
            position: 'top-right'
          })
        }
      }
    }
  })

  const onSubmitForm = useCallback(
    (formData: FormInput) =>
      updateAnnouncement({ id: announcementId!, data: formData }),
    []
  )

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

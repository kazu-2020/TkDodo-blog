import { useParams } from 'react-router-dom'
import { Box } from '@chakra-ui/react'

import { useToastForUpdation } from '@/hooks/useToast'

import { AnnouncementForm, FormInput } from '../components/AnnouncementForm'
import { useUpdateAnnouncement } from '../api/updateAnnouncement'
import { useAnnouncement } from '../api/getAnnouncement'

export const EditAnnouncement = () => {
  const { announcementId } = useParams()
  const toast = useToastForUpdation()

  const { data, isLoading } = useAnnouncement({
    params: {
      announcementId: announcementId!
    }
  })

  const { mutateAsync: updateAnnouncementAsync } = useUpdateAnnouncement()

  const onSubmitForm = (formData: FormInput) => {
    updateAnnouncementAsync(
      { id: announcementId!, data: formData },
      {
        onSuccess: () => {
          toast.success()
        },
        onError: () => {
          toast.fail()
        }
      }
    )
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

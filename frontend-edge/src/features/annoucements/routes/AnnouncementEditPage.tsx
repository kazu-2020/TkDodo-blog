import { useParams } from 'react-router-dom'
import { Box } from '@chakra-ui/react'

import { AnnouncementForm } from '../components/AnnouncementForm'
import { useAnnouncement } from '../api/getAnnouncement'

export const AnnouncementEditPage = () => {
  const { announcementId } = useParams()
  const { data, isLoading } = useAnnouncement({
    params: {
      announcementId: announcementId!
    }
  })

  return (
    <Box p={4}>
      {!isLoading && (
        <AnnouncementForm
          isEdit
          status={data?.announcement?.status}
          contents={data?.announcement?.contents}
          onSubmit={(data) => alert(JSON.stringify(data))}
        />
      )}
    </Box>
  )
}

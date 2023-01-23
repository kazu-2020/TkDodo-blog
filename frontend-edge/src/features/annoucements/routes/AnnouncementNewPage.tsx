import { Box } from '@chakra-ui/react'
import { AnnouncementForm } from '../components/AnnouncementForm'

export const AnnouncementNewPage = () => {
  return (
    <Box p={4}>
      <AnnouncementForm onSubmit={() => console.log('click')} />
    </Box>
  )
}

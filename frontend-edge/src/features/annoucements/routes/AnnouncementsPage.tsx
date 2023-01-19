import { Box } from '@chakra-ui/react'

import { AnnouncementList } from '../components/AnnouncementList'

export const AnnouncementsPage = () => (
  <Box p={4}>
    <AnnouncementList hasPagination />
  </Box>
)

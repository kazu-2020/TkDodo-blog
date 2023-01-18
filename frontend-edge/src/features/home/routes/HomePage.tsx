import { Box } from '@chakra-ui/react'

import { AnnouncementList } from '@/features/annoucements'

export const HomePage = () => (
  <Box p={4}>
    <AnnouncementList isSawMore displayedCount={5} />
  </Box>
)

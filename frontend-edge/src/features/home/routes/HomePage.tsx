import { Suspense } from 'react'
import { Box, Skeleton } from '@chakra-ui/react'

import { AnnouncementList } from '@/features/annoucements'

export const HomePage = () => (
  <Box p={4}>
    <Suspense fallback={<Skeleton w="1200px" h={80} />}>
      <AnnouncementList isSawMore displayedCount={20} />
    </Suspense>
  </Box>
)

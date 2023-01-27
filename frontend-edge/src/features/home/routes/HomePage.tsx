import { Box } from '@chakra-ui/react'

import { AnnouncementList } from '@/features/annoucements'

export const HomePage = () => (
  <Box p={4}>
    {/* TODO: 認可による isEditableのハンドリングを実装 */}
    <AnnouncementList isSawMore displayedCount={5} isEditable />
  </Box>
)

import { Box } from '@chakra-ui/react'

import { AnnouncementList } from '../components/AnnouncementList'

export const Announcements = () => (
  <Box p={4}>
    {/* TODO: 認可による isEditableのハンドリングを実装 */}
    <AnnouncementList hasPagination isEditable />
  </Box>
)

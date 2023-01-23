import { Box } from '@chakra-ui/react'

import { AnnouncementList } from '../components/AnnouncementList'

export const AnnouncementsPage = () => (
  <Box p={4}>
    {/* TODO: 認可による isEditableのハンドリングを実装 */}
    <AnnouncementList hasPagination isEditable />
  </Box>
)

import { Badge } from '@chakra-ui/react'

import { ApiState } from '@/types/api_state'

const PlaylistList = ({ apiState }: ApiState) => (
  <Badge
    ml="1"
    px={3}
    py={0.5}
    fontSize="xs"
    colorScheme="blue"
    borderRadius="xl"
  >
    {apiState === 'open' ? 'API公開中' : 'API非公開'}
  </Badge>
)
export default PlaylistList

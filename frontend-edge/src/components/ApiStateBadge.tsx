import { Badge } from '@chakra-ui/react'

const PlaylistList = ({ apiState }: { apiState: string }) => (
  <Badge
    ml="1"
    px={3}
    py={0.5}
    fontSize="xs"
    bg={apiState === 'open' ? 'green.400' : 'gray.400'}
    color="white"
    borderRadius="xl"
  >
    {apiState === 'open' ? 'API公開中' : 'API非公開'}
  </Badge>
)
export default PlaylistList

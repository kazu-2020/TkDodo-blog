import { StyleProps } from '@chakra-ui/styled-system/dist/declarations/src/system.types'
import { Badge } from '@chakra-ui/react'

export const PlayableStatusBadge = ({
  isPlayable
}: { isPlayable: boolean } & StyleProps) => (
  <Badge
    px={3}
    py={1}
    fontSize="sm"
    variant="solid"
    colorScheme={isPlayable ? 'pink' : 'gray'}
    borderRadius="sm"
  >
    {isPlayable ? '視聴可能' : '視聴不可'}
  </Badge>
)

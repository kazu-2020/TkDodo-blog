import { StyleProps } from '@chakra-ui/styled-system/dist/declarations/src/system.types'
import { Badge } from '@chakra-ui/react'

export const PlayableStatusBadge = ({
  isPlayable
}: { isPlayable: boolean } & StyleProps) => (
  <Badge
    w="64px"
    h="23px"
    color="#FEFEFB"
    borderRadius="12px"
    fontWeight="bold"
    fontSize="sx"
    lineHeight="23px"
    variant="solid"
    bgColor={isPlayable ? '#F8BBD0' : '#BDBDBD'}
    textAlign="center"
  >
    {isPlayable ? '視聴可能' : '視聴不可'}
  </Badge>
)

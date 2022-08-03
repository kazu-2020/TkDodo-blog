import { nanoid } from 'nanoid'
import { Skeleton, Stack } from '@chakra-ui/react'

export const ListScreenSkeleton = ({ size = 20 }: { size?: number }) => (
  <Stack pt={10} pb={3}>
    {[...Array(size)].map(() => (
      // eslint-disable-next-line react/no-array-index-key
      <Skeleton
        data-testid="skeleton"
        key={nanoid()}
        h="48px"
        px={3}
        bg="white"
        borderRadius="md"
      />
    ))}
  </Stack>
)

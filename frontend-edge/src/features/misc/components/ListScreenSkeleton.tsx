import { Skeleton, Stack } from '@chakra-ui/react'

const ListScreenSkeleton = () => (
  <Stack>
    {[...Array(20)].map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <Skeleton key={i} h="48px" px={3} bg="white" borderRadius="md" />
    ))}
  </Stack>
)

export default ListScreenSkeleton

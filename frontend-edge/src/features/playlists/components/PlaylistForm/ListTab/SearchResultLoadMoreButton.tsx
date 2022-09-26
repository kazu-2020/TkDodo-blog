import { Button, ButtonProps } from '@chakra-ui/react'

export const SearchResultLoadMoreButton = ({
  perPage,
  isLoading,
  onClick,
  loadingText
}: { perPage: number } & ButtonProps) => (
  <Button
    onClick={onClick}
    w="100%"
    m={0}
    bgColor="white"
    color="primary"
    borderRadius="none"
    isLoading={isLoading}
    loadingText={loadingText || '取得中'}
  >
    次の{perPage}件を表示
  </Button>
)

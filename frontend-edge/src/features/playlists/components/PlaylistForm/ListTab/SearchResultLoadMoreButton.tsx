import { Button, ButtonProps, Grid, GridItem } from '@chakra-ui/react'

export const SearchResultLoadMoreButton = ({
  perPage,
  isLoading,
  onClick,
  loadingText
}: { perPage: number } & ButtonProps) => (
  <Grid templateColumns="repeat(12, 1fr)" color="gray" pb={2}>
    <GridItem colSpan={12} h="5">
      <Button
        onClick={onClick}
        w="100%"
        bgColor="white"
        color="primary"
        borderRadius="none"
        isLoading={isLoading}
        loadingText={loadingText || '取得中'}
      >
        次の{perPage}件を表示
      </Button>
    </GridItem>
  </Grid>
)

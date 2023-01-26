import { Button, HStack } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

type Props = {
  page?: number
  offset?: number
  totalCount?: number
  pageCount?: number
  onChangePage?: (page: number) => void
}

export const Pagination = ({
  page = 1,
  offset = 50,
  totalCount = 0,
  pageCount = 5,
  onChangePage = () => {}
}: Props) => {
  const lastPage = Math.ceil(totalCount / offset)
  const renderPageCount = lastPage < pageCount ? lastPage : pageCount
  let renderStartPage = page > 1 ? page - 1 : page
  if (page + renderPageCount > lastPage) {
    renderStartPage = lastPage - renderPageCount + 1
  }

  return (
    <HStack spacing="10px" justify="center" role="navigation">
      <Button
        size="sm"
        colorScheme="teal"
        variant="solid"
        isDisabled={page === 1}
        onClick={() => {
          const prevPageNumber = page - 1
          onChangePage(prevPageNumber)
        }}
      >
        <ChevronLeftIcon />
      </Button>
      {Array(renderPageCount)
        .fill('page')
        .map((value, index) => {
          const key = `${value}-${index + renderStartPage}`
          const pageNumber = index + renderStartPage
          return (
            <Button
              key={key}
              size="sm"
              colorScheme="teal"
              variant="solid"
              isActive={pageNumber === page}
              onClick={() => {
                onChangePage(pageNumber)
              }}
            >
              {pageNumber}
            </Button>
          )
        })}
      <Button
        size="sm"
        colorScheme="teal"
        variant="solid"
        isDisabled={page === lastPage}
        onClick={() => {
          const nextPageNumber = page + 1
          onChangePage(nextPageNumber)
        }}
      >
        <ChevronRightIcon />
      </Button>
    </HStack>
  )
}

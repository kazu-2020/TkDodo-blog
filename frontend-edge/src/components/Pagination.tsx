import { useState } from 'react'
import { Button, HStack } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

type Props = {
  currentPage: number
  offset: number
  totalCount: number
  pageCount: number
  onPageChange: (page: number) => void
}

const Pagination = ({
  currentPage = 1,
  offset = 20,
  totalCount = 101,
  pageCount = 5,
  onPageChange = () => {}
}: Props) => {
  const [page, setPage] = useState(currentPage)

  const lastPage = Math.ceil(totalCount / offset)
  const renderPageCount = lastPage < pageCount ? lastPage : pageCount
  let renderStartPage = page > 1 ? page - 1 : page
  if (page + renderPageCount > lastPage) {
    renderStartPage = lastPage - renderPageCount + 1
  }

  return (
    <HStack spacing="10px">
      <Button
        size="md"
        colorScheme="teal"
        variant="solid"
        isDisabled={page === 1}
        onClick={() => {
          const prevPageNumber = page - 1
          onPageChange(prevPageNumber)
          setPage(prevPageNumber)
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
              size="md"
              colorScheme="teal"
              variant="solid"
              isActive={pageNumber === page}
              onClick={() => {
                onPageChange(pageNumber)
                setPage(pageNumber)
              }}
            >
              {pageNumber}
            </Button>
          )
        })}
      <Button
        size="md"
        colorScheme="teal"
        variant="solid"
        isDisabled={page === lastPage}
        onClick={() => {
          const nextPageNumber = page + 1
          onPageChange(nextPageNumber)
          setPage(nextPageNumber)
        }}
      >
        <ChevronRightIcon />
      </Button>
    </HStack>
  )
}

export default Pagination

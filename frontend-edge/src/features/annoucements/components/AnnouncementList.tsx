import Link from '@/components/Link'
import { Annoucement } from '@/types/announcement'
import { Box, Button, Center, Flex, Heading, Spacer } from '@chakra-ui/react'
import { AnnouncementListItem } from './AnnouncementListItem'
import { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { composeStories } from '@storybook/testing-react'

type AnnouncementListProps = {
  annoucments: Annoucement[]
  isEditable?: boolean
  isSawMore?: boolean
  pagination?: ReactNode
}

export const AnnouncementList = ({
  annoucments,
  isSawMore,
  isEditable,
  pagination
}: AnnouncementListProps) => {
  return (
    <Center flexDirection="column">
      <Box
        p={6}
        background="white"
        boxShadow="xs"
        border="1px solid #E2E8F0"
        borderRadius="sm"
        w="fit-content"
      >
        <Flex columnGap={4} align="center" mb={6}>
          <Heading size="md">運営チームからのお知らせ</Heading>
          {isSawMore && (
            <Link to="#" color="#009688" fontWeight="bold">
              もっと見る
            </Link>
          )}
          <Spacer />
          {isEditable && (
            <Button
              background="#FF9800"
              color="white"
              boxShadow="md"
              _hover={{ opacity: 0.6 }}
            >
              新規お知らせ登録
            </Button>
          )}
        </Flex>

        {annoucments.length > 0 && (
          <Box w="1200px" border="1px solid #E2E8F0">
            {annoucments.map((announcement, index) => {
              const { id, status, contents, dataCreated } = announcement

              return (
                <AnnouncementListItem
                  key={id}
                  createdAt={dataCreated}
                  background={index % 2 === 0 ? '#BDBDBD33' : 'white'}
                  {...{ status, contents }}
                />
              )
            })}
          </Box>
        )}
      </Box>

      {pagination && <Box mt={6}>{pagination}</Box>}
    </Center>
  )
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  const stories = await import('./AnnouncementList.stories')
  const { Default, Editable, ShowMore, WithPagination } =
    composeStories(stories)

  describe('編集可の場合', () => {
    it('新規お知らせ登録ボタンが表示されること', () => {
      render(<Editable />)
      expect(
        screen.getByText('新規お知らせ登録', { selector: 'button' })
      ).toBeInTheDocument()
    })
  })

  describe('編集不可の場合', () => {
    it('新規お知らせ登録ボタンが表示されないこと', () => {
      render(<Default />)
      expect(
        screen.queryByText('新規お知らせ登録', { selector: 'button' })
      ).not.toBeInTheDocument()
    })
  })

  describe('isSawMore: trueの場合', () => {
    it('「もっと見る」リンクが表示されること', () => {
      render(<ShowMore />)
      expect(
        screen.getByText('もっと見る', { selector: 'a' })
      ).toBeInTheDocument()
    })
  })

  describe('isSawMore: falseの場合', () => {
    it('「もっと見る」リンクが表示されないこと', () => {
      render(<Default />)
      expect(
        screen.queryByText('もっと見る', { selector: 'a' })
      ).not.toBeInTheDocument()
    })
  })

  it('paginationが差し込まれた場合、ページネーションが表示されること', () => {
    render(<WithPagination />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
}

import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { render, screen } from '@testing-library/react'
import { composeStories } from '@storybook/testing-react'
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  Text
} from '@chakra-ui/react'

import type { Pagination as PaginationType } from '@/types/pagination'
import { Announcement } from '@/types/announcement'
import { Pagination } from '@/components/Pagination'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'
import Link from '@/components/Link'

import { useAnnouncements } from '../api/getAnnouncements'

import { AnnouncementListItem } from './AnnouncementListItem'

type AnnouncementListProps = {
  isEditable?: boolean
  isSawMore?: boolean
  hasPagination?: boolean
  displayedCount?: number
}

export const AnnouncementList = ({
  isEditable,
  isSawMore,
  hasPagination,
  displayedCount = 50
}: AnnouncementListProps) => {
  const [page, setPage] = useState(1)

  const navigate = useNavigate()

  const { data, isLoading } = useAnnouncements({
    params: {
      page,
      per: displayedCount
    }
  })

  const announcements = useMemo(() => data?.announcements ?? [], [data])

  const announcementItem = (announcement: Announcement, index: number) => {
    const { id, status, contents, dateCreated } = announcement

    return (
      <AnnouncementListItem
        key={id}
        createdAt={dateCreated}
        bg={index % 2 === 0 ? '#BDBDBD33' : 'white'}
        {...{ status, contents }}
      />
    )
  }

  const paginate = (paginateData: PaginationType) => {
    const { currentPage, totalPages, count } = paginateData

    return (
      <Pagination
        totalCount={count}
        page={currentPage}
        offset={displayedCount}
        pageCount={totalPages}
        onChangePage={setPage}
      />
    )
  }

  const goToNewPage = () => navigate('/announcements/new')

  return (
    <Center flexDirection="column" rowGap={6}>
      <Box
        p={6}
        bg="white"
        boxShadow="xs"
        border="1px solid #E2E8F0"
        borderRadius="sm"
        w="full"
      >
        <Flex columnGap={4} align="center" mb={6}>
          <Heading size="md">運営チームからのお知らせ</Heading>
          {isSawMore && (
            <Link to="/announcements" color="#009688" fontWeight="bold">
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
              onClick={goToNewPage}
            >
              新規お知らせ登録
            </Button>
          )}
        </Flex>

        {isLoading && <ListScreenSkeleton size={displayedCount} />}
        {!isLoading &&
          announcements.length > 0 &&
          announcements.map(announcementItem)}
        {!isLoading && announcements.length === 0 && (
          <Text>お知らせはありません</Text>
        )}
      </Box>

      {hasPagination && data?.pagination && paginate(data.pagination)}
    </Center>
  )
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  const stories = await import('./AnnouncementList.stories') // eslint-disable-line import/no-cycle
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

  describe('hasPagination: trueの場合', () => {
    it('ページネーションが表示されること', async () => {
      render(<WithPagination />)
      const pagination = await screen.findByRole('navigation')
      expect(pagination).toBeInTheDocument()
    })
  })

  describe('hasPagination: falseの場合', () => {
    it('ページネーションが表示されないこと', () => {
      render(<Default />)
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })
  })
}

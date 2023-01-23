import { RiPencilLine } from 'react-icons/all'
import { memo } from 'react'
import { render, screen } from '@testing-library/react'
import { composeStories } from '@storybook/testing-react'
import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

import { formatDateWithWeekday } from '@/utils/format'
import { autoLink } from '@/utils/dom'
import { AnnouncementStatus } from '@/types/announcement'

import { AnnouncementBadge } from './AnnouncementBadge'

type AnnouncementListItemProps = {
  status: AnnouncementStatus
  contents: string
  createdAt: string
  isEditable?: boolean
  bg?: string
}

export const AnnouncementListItem = memo(
  ({
    status,
    contents,
    createdAt,
    isEditable,
    bg = '#fff'
  }: AnnouncementListItemProps) => (
    <Flex
      data-testid="announcement-list-item"
      align="center"
      px={2}
      minH={10}
      columnGap={6}
      {...{ bg }}
    >
      <Text fontSize="sm">{formatDateWithWeekday(createdAt)}</Text>
      <AnnouncementBadge {...{ status }} />
      <Text
        flex={1}
        ref={(element) => {
          if (!element) return

          const targetElement = element
          targetElement.innerHTML = autoLink(contents)
          const aTags = element.getElementsByTagName('a')
          Array.from(aTags).forEach((aTag) => {
            const el = aTag
            el.style.color = '#009688'
          })
        }}
      />
      {isEditable && (
        <Box>
          <IconButton
            aria-label="Edit announcement"
            icon={<RiPencilLine color="#009688" />}
            variant="ghost"
          />
          <IconButton
            aria-label="Delete announcement"
            icon={<DeleteIcon color="#009688" />}
            variant="ghost"
          />
        </Box>
      )}
    </Flex>
  )
)

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  const stories = await import('./AnnouncementListItem.stories') // eslint-disable-line import/no-cycle
  const { Default, Editable } = composeStories(stories)

  describe('編集可の場合', () => {
    it('編集ボタンが表示されること', () => {
      render(<Editable />)

      expect(
        screen.getByLabelText('Edit announcement', { selector: 'button' })
      ).toBeInTheDocument()
    })

    it('削除ボタンが表示されること', () => {
      render(<Editable />)

      expect(
        screen.getByLabelText('Delete announcement', { selector: 'button' })
      ).toBeInTheDocument()
    })
  })

  describe('編集不可の場合', () => {
    it('編集ボタンが非表示になること', () => {
      render(<Default />)

      expect(
        screen.queryByLabelText('Edit announcement', { selector: 'button' })
      ).not.toBeInTheDocument()
    })

    it('削除ボタンが非表示になること', () => {
      render(<Default />)

      expect(
        screen.queryByLabelText('Delete announcement', { selector: 'button' })
      ).not.toBeInTheDocument()
    })
  })
}

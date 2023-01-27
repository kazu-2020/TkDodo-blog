import { useNavigate } from 'react-router-dom'
import { RiPencilLine } from 'react-icons/all'
import { memo, useCallback, useId } from 'react'
import { render, screen } from '@testing-library/react'
import { composeStories } from '@storybook/testing-react'
import {
  Box,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

import { formatDateWithWeekday } from '@/utils/format'
import { autoLink } from '@/utils/dom'
import { AnnouncementStatus } from '@/types/announcement'
import { queryClient } from '@/lib/react-query'

import { useDeleteAnnouncement } from '../api/deleteAnnouncement'

import { DeleteAnnouncementModal } from './DeleteAnnouncementModal'
import { AnnouncementBadge } from './AnnouncementBadge'

type AnnouncementListItemProps = {
  id: number
  status: AnnouncementStatus
  contents: string
  createdAt: string
  isEditable?: boolean
  bg?: string
}

const replaceURLStringsWithLinks = (contents: string): string => {
  const temporary = document.createElement('div')
  temporary.innerHTML = autoLink(contents)
  const links = temporary.getElementsByTagName('a')
  Array.from(links).forEach((link) => {
    const target = link
    target.style.color = '#009688'
  })
  const result = temporary.innerHTML
  temporary.remove()

  return result
}

export const AnnouncementListItem = memo(
  ({
    id,
    status,
    contents,
    createdAt,
    isEditable,
    bg = '#fff'
  }: AnnouncementListItemProps) => {
    const navigate = useNavigate()
    const toast = useToast()
    const randId = useId()

    const {
      isOpen: isOpenDeleteModal,
      onOpen: onOpenDelelteModal,
      onClose: onCloseDeleteModal
    } = useDisclosure()

    const { mutateAsync: onDeleteAnnouncementAsync } = useDeleteAnnouncement({
      config: {
        onSuccess: () => {
          toast({
            title: '削除しました。',
            status: 'success',
            isClosable: true,
            position: 'top-right'
          })
          queryClient.invalidateQueries(['announcements'])
        },
        onError: () => {
          toast({
            title: '削除に失敗しました。',
            status: 'error',
            isClosable: true,
            position: 'top-right'
          })
        }
      }
    })

    const onClickEditIcon = () => navigate(`/announcements/${id}/edit`)
    const onClickDeleteButton = useCallback(async () => {
      await onDeleteAnnouncementAsync({ id: `${id}` })
      onCloseDeleteModal()
    }, [id, onCloseDeleteModal, onDeleteAnnouncementAsync])

    return (
      <Flex
        data-testid={`announcement-list-item-${randId}`}
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

            targetElement.innerHTML = replaceURLStringsWithLinks(contents)
          }}
        />
        {isEditable && (
          <Box>
            <IconButton
              aria-label="Edit announcement"
              icon={<RiPencilLine color="#009688" />}
              variant="ghost"
              onClick={onClickEditIcon}
            />
            <IconButton
              aria-label="Delete announcement"
              icon={<DeleteIcon color="#009688" />}
              variant="ghost"
              onClick={onOpenDelelteModal}
            />
          </Box>
        )}

        <DeleteAnnouncementModal
          isOpen={isOpenDeleteModal}
          onClose={onCloseDeleteModal}
          {...{ onClickDeleteButton }}
        />
      </Flex>
    )
  }
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

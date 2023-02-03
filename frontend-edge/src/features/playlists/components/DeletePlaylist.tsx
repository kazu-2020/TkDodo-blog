import { MdDelete } from 'react-icons/all'
import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  useToast
} from '@chakra-ui/react'

import { useDeletePlaylist } from '@/features/playlists/api/deletePlaylist'

type DeletePlaylistProps = {
  playlistId: string
  onDrawerClose: () => void
}

/* eslint-disable max-lines-per-function */
export const DeletePlaylist = ({
  playlistId,
  onDrawerClose
}: DeletePlaylistProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const { mutateAsync: deletePlaylistAsync, isLoading } = useDeletePlaylist()

  const onClickDeleteButton = async () => {
    try {
      await deletePlaylistAsync({ playlistId })
      toast({
        title: '削除しました。',
        status: 'success'
      })
      onClose()
      onDrawerClose()
    } catch {
      toast({
        title: '削除に失敗しました。',
        status: 'error'
      })
    }
  }

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        data-testid="playlist-drawer-delete-button"
        color="gray"
        colorScheme="gray"
        variant="outline"
        onClick={onOpen}
        leftIcon={<MdDelete />}
      >
        削除する
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              プレイリストを削除
            </AlertDialogHeader>

            <AlertDialogBody>
              削除したプレイリストは復元できません。
              <br />
              本当に削除しますか？
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Button
                data-testid="playlist-alert-delete-button"
                colorScheme="red"
                loadingText="送信中"
                onClick={onClickDeleteButton}
                ml={3}
                {...{ isLoading }}
              >
                削除する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
/* eslint-enable max-lines-per-function */

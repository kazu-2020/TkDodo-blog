import { MdDelete } from 'react-icons/all'
import React from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from '@chakra-ui/react'

import { useDeletePlaylist } from '@/features/playlists/api/deletePlaylist'

type Props = {
  playlistId: string
  onDrawerClose: () => void
}

export const DeletePlaylist = ({ playlistId, onDrawerClose }: Props) => {
  const deletePlaylistMutation = useDeletePlaylist()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        colorScheme="red"
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
                colorScheme="red"
                isLoading={deletePlaylistMutation.isLoading}
                loadingText="送信中"
                onClick={async () => {
                  await deletePlaylistMutation.mutateAsync({
                    playlistId
                  })
                  onClose()
                  onDrawerClose()
                }}
                ml={3}
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

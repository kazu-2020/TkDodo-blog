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

import { useDeleteSeriesDeck } from '../api/deleteSeriesDeck'

type DeleteSeriesDeckProps = {
  seriesDeckId: string
  onDrawerClose: () => void
}

const DeleteSeriesDeck = ({
  seriesDeckId,
  onDrawerClose
}: DeleteSeriesDeckProps) => {
  const deleteSeriesDeckMutation = useDeleteSeriesDeck()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        data-testid="series-deck-drawer-delete-button"
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
              シリーズデッキを削除
            </AlertDialogHeader>

            <AlertDialogBody>
              削除したデッキは復元できません。
              <br />
              本当に削除しますか？
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Button
                data-testid="series-deck-alert-delete-button"
                colorScheme="red"
                isLoading={deleteSeriesDeckMutation.isLoading}
                loadingText="送信中"
                onClick={async () => {
                  await deleteSeriesDeckMutation.mutateAsync({
                    seriesDeckId
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
export default DeleteSeriesDeck

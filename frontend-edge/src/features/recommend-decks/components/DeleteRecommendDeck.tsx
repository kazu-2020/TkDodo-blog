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

import { useDeleteRecommendDeck } from '../api/deleteRecommendDeck'

type DeleteRecommendDeckProps = {
  recommendDeckId: string
  onDrawerClose: () => void
}

const DeleteRecommendDeck = ({
  recommendDeckId,
  onDrawerClose
}: DeleteRecommendDeckProps) => {
  const deleteRecommendDeckMutation = useDeleteRecommendDeck()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        color="gray"
        colorScheme="gray"
        data-testid="recommend-deck-drawer-delete-button"
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
              レコメンドデッキを削除
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
                data-testid="recommend-deck-alert-delete-button"
                colorScheme="red"
                isLoading={deleteRecommendDeckMutation.isLoading}
                loadingText="送信中"
                onClick={async () => {
                  await deleteRecommendDeckMutation.mutateAsync({
                    recommendDeckId
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
export default DeleteRecommendDeck

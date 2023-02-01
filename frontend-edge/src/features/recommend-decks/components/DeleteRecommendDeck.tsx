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

import { useDeleteRecommendDeck } from '../api/deleteRecommendDeck'

type DeleteRecommendDeckProps = {
  recommendDeckId: string
  onDrawerClose: () => void
}

const DeleteRecommendDeck = ({
  recommendDeckId,
  onDrawerClose
}: DeleteRecommendDeckProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast({
    position: 'top-right',
    isClosable: true
  })

  const { mutateAsync: deleteRecommendDeckAsync, isLoading } =
    useDeleteRecommendDeck()

  const onClickDeleteButton = async () => {
    try {
      await deleteRecommendDeckAsync({
        recommendDeckId
      })
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
export default DeleteRecommendDeck

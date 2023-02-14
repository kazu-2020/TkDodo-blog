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
  useDisclosure
} from '@chakra-ui/react'

import { useToastForDeletion } from '@/hooks/useToast'

import { useDeleteSeriesDeck } from '../api/deleteSeriesDeck'

type DeleteSeriesDeckProps = {
  seriesDeckId: string
  onDrawerClose: () => void
}

const DeleteSeriesDeck = ({
  seriesDeckId,
  onDrawerClose
}: DeleteSeriesDeckProps) => {
  const toast = useToastForDeletion()

  const { mutateAsync: deleteSeriesDeckAsync, isLoading } =
    useDeleteSeriesDeck()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const onClickDeleteButton = () => {
    deleteSeriesDeckAsync(
      { seriesDeckId },
      {
        onSuccess: () => {
          toast.success()
          onClose()
          onDrawerClose()
        },
        onError: () => {
          toast.fail()
        }
      }
    )
  }

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        color="gray"
        colorScheme="gray"
        data-testid="series-deck-drawer-delete-button"
        variant="outline"
        onClick={onOpen}
        leftIcon={<MdDelete />}
      >
        削除する
      </Button>

      <AlertDialog leastDestructiveRef={cancelRef} {...{ isOpen, onClose }}>
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
export default DeleteSeriesDeck

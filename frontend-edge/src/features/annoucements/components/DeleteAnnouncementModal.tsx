import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react'

type DeleteAnnouncementModalProps = {
  isOpen: boolean
  onClose: VoidFunction
  onClickDeleteButton: VoidFunction
}

export const DeleteAnnouncementModal = ({
  isOpen,
  onClose,
  onClickDeleteButton
}: DeleteAnnouncementModalProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <AlertDialog leastDestructiveRef={cancelRef} {...{ isOpen, onClose }}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            お知らせを削除
          </AlertDialogHeader>

          <AlertDialogBody p={4}>
            削除したお知らせは復元できません。
            <br />
            本当に削除しますか？
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              キャンセル
            </Button>
            <Button colorScheme="red" onClick={onClickDeleteButton} ml={3}>
              削除する
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

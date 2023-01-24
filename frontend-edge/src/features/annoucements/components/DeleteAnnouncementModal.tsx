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
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize="20px"
            fontWeight="bold"
            color="#757575"
            p={4}
          >
            お知らせの削除
          </AlertDialogHeader>

          <AlertDialogBody p={4}>
            削除したお知らせは復元できません。
            <br />
            本当に削除しますか？
          </AlertDialogBody>

          <AlertDialogFooter columnGap={6} justifyContent="center" p={4}>
            <Button
              ref={cancelRef}
              onClick={onClose}
              px={8}
              fontSize="sm"
              variant="ghost"
            >
              キャンセル
            </Button>
            <Button
              colorScheme="red"
              onClick={onClickDeleteButton}
              px={8}
              fontSize="sm"
            >
              削除する
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

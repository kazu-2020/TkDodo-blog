import { useToast, UseToastOptions } from '@chakra-ui/react'

const COMMON_CONFIG: UseToastOptions = {
  position: 'top-right',
  isClosable: true
}

export const useToastForCreation = () => {
  const toast = useToast(COMMON_CONFIG)

  const success = () => toast({ title: `作成しました`, status: 'success' })
  const fail = () => toast({ title: `新規作成に失敗しました`, status: 'error' })

  return {
    success,
    fail
  }
}

export const useToastForUpdation = () => {
  const toast = useToast(COMMON_CONFIG)

  const success = () => toast({ title: `保存しました`, status: 'success' })
  const fail = () => toast({ title: `保存に失敗しました`, status: 'error' })

  return {
    success,
    fail
  }
}

export const useToastForDeletion = () => {
  const toast = useToast(COMMON_CONFIG)

  const success = () => toast({ title: `削除しました`, status: 'success' })
  const fail = () => toast({ title: `削除に失敗しました`, status: 'error' })

  return {
    success,
    fail
  }
}

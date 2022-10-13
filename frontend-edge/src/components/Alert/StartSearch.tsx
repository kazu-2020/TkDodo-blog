import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react'

export const StartSearch = () => (
  <Alert status="info">
    <AlertIcon />
    <AlertTitle>検索条件を入力して検索してください</AlertTitle>
  </Alert>
)

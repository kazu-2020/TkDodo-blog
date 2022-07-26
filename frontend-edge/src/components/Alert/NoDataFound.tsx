import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle
} from '@chakra-ui/react'

const NoDataFound = () => (
  <Alert status="warning">
    <AlertIcon />
    <AlertTitle>条件に一致するデータは見つかりませんでした</AlertTitle>
    <AlertDescription>
      検索条件を見直して再度、検索してください。
    </AlertDescription>
  </Alert>
)

export default NoDataFound

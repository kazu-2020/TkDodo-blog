import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle
} from '@chakra-ui/react'

type Props = {
  target: string
}

export const NoDataFound = ({ target }: Props) => (
  <Alert status="warning">
    <AlertIcon />
    <AlertTitle>{target}が見つかりませんでした。</AlertTitle>
    <AlertDescription>他のキーワードや条件でお探しください。</AlertDescription>
  </Alert>
)

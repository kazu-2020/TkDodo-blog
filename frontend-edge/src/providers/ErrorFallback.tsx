import { FallbackProps } from 'react-error-boundary'
import * as React from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import {
  Box,
  Button,
  Center,
  Image,
  Link,
  Text,
  VStack,
  ChakraProvider
} from '@chakra-ui/react'

import '../assets/css/index.scss'
import theme from '../lib/theme'

const axiosErrorStack = (error: Error) => {
  if (!(error instanceof AxiosError)) {
    return null
  }

  const axiosError = error as AxiosError
  const response = axiosError.response as AxiosResponse | undefined
  return (
    <Box pt={10}>
      <Text fontWeight="bold">Axiosエラー情報</Text>
      <Text my={2} p={2} bg="white">
        {JSON.stringify(axiosError.toJSON())}
      </Text>
      {response?.data && (
        <iframe
          width="100%"
          height="600px"
          title="error"
          srcDoc={response?.data}
        />
      )}
    </Box>
  )
}

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <ChakraProvider theme={theme}>
    <VStack p={0}>
      <Center w="100%" bg="white" p={15}>
        <Image src="/logo-black@2x.jpg" alt="EditorialHands" h="32px" />
      </Center>
      <VStack spacing={0} w="80%">
        <Text fontSize="18px" fontWeight="bold" py={10}>
          システムエラーが発生しました
        </Text>
        <Center pt={10}>
          <Button onClick={resetErrorBoundary}>再読込する</Button>
        </Center>
        <Center pt={3} pb={10}>
          <Link href="/">TOPへ戻る</Link>
        </Center>

        <Text
          fontSize="12px"
          fontWeight="bold"
          textAlign="left"
          w="100%"
          pb={2}
        >
          エラー情報
        </Text>
        <VStack
          textAlign="left"
          w="100%"
          borderColor="black"
          border="1px"
          borderStyle="solid"
          py={4}
          px={2}
        >
          <Text w="100%" fontSize="12px">
            {error.name}
          </Text>
          <Text w="100%" fontSize="12px">
            {error.message}
          </Text>
          <Text w="100%" fontSize="12px">
            {error.stack}
            {axiosErrorStack(error)}
          </Text>
        </VStack>
      </VStack>
    </VStack>
  </ChakraProvider>
)

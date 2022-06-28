import React from 'react'
import { Box, HStack, Text, Link as ChakraLink } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export default function Footer() {
  return (
    <Box bg="#ffee58" color="#00000099" fontSize="sm">
      <HStack justifyContent="flex-end">
        <Text>こちらはdev環境です。</Text>
        <ChakraLink href="https://eh.nr.nhk.jp/" isExternal>
          本番環境へ
          <ExternalLinkIcon mx="2px" />
        </ChakraLink>
      </HStack>
    </Box>
  )
}

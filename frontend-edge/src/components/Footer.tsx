import { IoMdInformationCircleOutline } from 'react-icons/all'
import React from 'react'
import { Box, HStack, Text, Link as ChakraLink } from '@chakra-ui/react'
import { ExternalLinkIcon, Icon } from '@chakra-ui/icons'

const Footer = () => {
  if (import.meta.env.MODE === 'production') {
    return null
  }

  return (
    <Box
      bg="#ffee58"
      color="#00000099"
      pos="sticky"
      zIndex="999"
      bottom="0"
      w="full"
      mt={5}
      fontSize="sm"
    >
      <HStack justifyContent="center">
        <Icon as={IoMdInformationCircleOutline} w={3} h={3} />
        <Text>こちらは{import.meta.env.MODE}環境です。</Text>
        <ChakraLink href="https://eh.nr.nhk.jp/" isExternal>
          本番環境へ
          <ExternalLinkIcon mx="2px" />
        </ChakraLink>
      </HStack>
    </Box>
  )
}
export default Footer

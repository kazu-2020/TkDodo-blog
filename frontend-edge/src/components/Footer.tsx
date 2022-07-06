import { IoMdInformationCircleOutline } from 'react-icons/all'
import React from 'react'
import { Box, HStack, Text, Link as ChakraLink } from '@chakra-ui/react'
import { ExternalLinkIcon, Icon } from '@chakra-ui/icons'

const Footer = () => (
  <Box
    bg="#ffee58"
    color="#00000099"
    pos="fixed"
    zIndex="999"
    bottom="0"
    w="full"
    fontSize="sm"
  >
    <HStack justifyContent="center">
      <Icon as={IoMdInformationCircleOutline} w={3} h={3} />
      <Text>こちらはdev環境です。</Text>
      <ChakraLink href="https://eh.nr.nhk.jp/" isExternal>
        本番環境へ
        <ExternalLinkIcon mx="2px" />
      </ChakraLink>
    </HStack>
  </Box>
)
export default Footer

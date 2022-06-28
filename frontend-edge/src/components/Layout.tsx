import { Outlet } from 'react-router-dom'
import React from 'react'
import { Flex, ChakraProvider, Container } from '@chakra-ui/react'

import theme from '../theme'

import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" minH="100vh">
        <Header />
        <Container maxW="container.lg" py={4} flexGrow="1">
          <Outlet />
        </Container>
        <Footer />
      </Flex>
    </ChakraProvider>
  )
}

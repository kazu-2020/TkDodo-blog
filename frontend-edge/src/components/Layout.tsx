import { Outlet } from 'react-router-dom'
import React from 'react'
import { Flex, ChakraProvider, Container } from '@chakra-ui/react'

import theme from '../lib/theme'

import Header from './Header'
import Footer from './Footer'

const Layout = () => (
  <ChakraProvider theme={theme}>
    <Flex direction="column" minH="100vh">
      <Header />
      <Container maxW="container.lg" py={4} flexGrow="1" mt="64px" mb="32px">
        <Outlet />
      </Container>
      <Footer />
    </Flex>
  </ChakraProvider>
)
export default Layout

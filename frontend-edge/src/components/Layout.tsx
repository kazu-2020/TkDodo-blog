import { Outlet } from 'react-router-dom'
import React from 'react'
import { Flex, ChakraProvider, Container } from '@chakra-ui/react'

import theme from '../lib/theme'

import Header from './Header'
import Footer from './Footer'
import { BreadcrumbContextProvider, Breadcrumb } from './Breadcrumb'

const Layout = () => (
  <ChakraProvider theme={theme}>
    <Flex direction="column" minH="100vh">
      <Header />
      <Container maxW="container.xl" flexGrow="1" mt="64px" mb="32px">
        <BreadcrumbContextProvider>
          <Breadcrumb my={5} />
          <Outlet />
        </BreadcrumbContextProvider>
      </Container>
      <Footer />
    </Flex>
  </ChakraProvider>
)

export default Layout

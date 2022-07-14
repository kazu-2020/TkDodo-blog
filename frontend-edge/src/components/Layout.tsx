import { Outlet } from 'react-router-dom'
import React from 'react'
import { Flex, ChakraProvider, Container } from '@chakra-ui/react'

import {BreadcrumbContextProvider} from "@/components/breadcrumb/BreadcrumbContext";

import theme from '../lib/theme'

import Header from './Header'
import Footer from './Footer'
import Breadcrumb from "./Breadcrumb"

const Layout = () => (
  <ChakraProvider theme={theme}>
    <Flex direction="column" minH="100vh">
      <Header />
      <BreadcrumbContextProvider>
        <Breadcrumb mt="64px" />
        <Container maxW="container.lg" py={4} flexGrow="1" mt="16px" mb="32px">
          <Outlet />
        </Container>
      </BreadcrumbContextProvider>
      <Footer />
    </Flex>
  </ChakraProvider>
)
export default Layout

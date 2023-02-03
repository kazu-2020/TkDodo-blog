import { Outlet, useLocation } from 'react-router-dom'
import React from 'react'
import { Flex, Container } from '@chakra-ui/react'

import { Header } from './Header'
import Footer from './Footer'
import { BreadcrumbContextProvider, Breadcrumb } from './Breadcrumb'

const Layout = () => {
  const location = useLocation()
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Container maxW="container.xl" flexGrow="1">
        <BreadcrumbContextProvider>
          {location.pathname !== '/' && <Breadcrumb my={5} />}
          <Outlet />
        </BreadcrumbContextProvider>
      </Container>
      <Footer />
    </Flex>
  )
}

export default Layout

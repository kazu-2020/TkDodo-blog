import { Link as RouterLink } from 'react-router-dom'
import React from 'react'
import { Link as ChakraLink } from '@chakra-ui/react'

type LinkProps = React.ComponentProps<typeof ChakraLink> &
  React.ComponentProps<typeof RouterLink>

const Link = ({ children, ...props }: LinkProps) => (
  <ChakraLink as={RouterLink} {...props}>
    {children}
  </ChakraLink>
)
export default Link

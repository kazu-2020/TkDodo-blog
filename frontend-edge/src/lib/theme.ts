import { extendTheme } from '@chakra-ui/react'

// @see https://chakra-ui.com/docs/styled-system/customize-theme
const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: '"Noto Sans JP", sans-serif',
        bg: '#f0f0f0',
        color: '#000000DE'
      }
    }
  },
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac'
    },
    primary: '#009688',
    secondary: '#cddc39',
    accent: '#ff9800',
    error: '#f44336',
    warning: '#ff5722',
    info: '#607d8b',
    success: '#8bc340'
  }
})

export default theme

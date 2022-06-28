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
    }
  }
})

export default theme

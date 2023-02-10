import { StepsStyleConfig as Steps } from 'chakra-ui-steps'
import { extendTheme } from '@chakra-ui/react'

import { buttonTheme } from './chakra'

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
    primary: '#009688',
    secondary: '#cddc39',
    accent: '#ff9800',
    error: '#f44336',
    warning: '#ff5722',
    info: '#607d8b',
    success: '#8bc340',
    link: '#009688',
    lightGray: '#eeeeee',
    disabled: 'rgba(0,0,0,.38)'
  },
  components: {
    Steps
    Steps,
    Button: buttonTheme
  }
})

export default theme

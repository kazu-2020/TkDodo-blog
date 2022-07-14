import { extendTheme } from '@chakra-ui/react'

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
  color: '#111'
}

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
    success: '#8bc340',
    link: '#009688',
    disabled: 'rgba(0,0,0,.38)'
  },
  components: {
    // @see https://chakra-ui.com/community/recipes/floating-labels
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles
              }
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label':
              {
                ...activeLabelStyles
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'white',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top'
            }
          }
        }
      }
    },
  }
})

export default theme

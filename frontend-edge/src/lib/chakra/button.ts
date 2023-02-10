/*
  [参考]
  https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/theme/src/components/button.ts
  https://chakra-ui.com/docs/components/button/theming
*/

import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const accentSolid = defineStyle(() => ({
  fontSize: '14px',
  fontWeight: 'bold',
  lineHeight: '20px',
  borderRadius: 'base',
  boxShadow: 'md',
  color: 'white',
  bg: 'accent',
  _hover: {
    opacity: 0.6,
    _disabled: {
      bg: 'accent'
    }
  }
}))

export const buttonTheme = defineStyleConfig({
  variants: { accentSolid }
})

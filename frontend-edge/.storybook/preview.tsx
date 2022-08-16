import { ChakraProvider } from '@chakra-ui/react'
import theme from '../src/lib/theme'
import { withRouter } from 'storybook-addon-react-router-v6'

import { initialize, mswDecorator } from 'msw-storybook-addon'

// Initialize MSW
initialize({
  onUnhandledRequest: 'bypass' // MSWに処理されないリクエストをバイパスする
})

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

const withChakra = (StoryFn: Function) => {
  return (
    <ChakraProvider theme={theme}>
      <div id="story-wrapper">
        <StoryFn />
      </div>
    </ChakraProvider>
  )
}

export const decorators = [withRouter, withChakra, mswDecorator]

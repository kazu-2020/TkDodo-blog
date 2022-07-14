import { ChakraProvider } from '@chakra-ui/react'
import theme from '../src/lib/theme'
import {MemoryRouter} from 'react-router-dom'

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
        <MemoryRouter initialEntries={['/playlists/new']}>
          <StoryFn />
        </MemoryRouter>
      </div>
    </ChakraProvider>
  )
}

export const decorators = [withChakra]
